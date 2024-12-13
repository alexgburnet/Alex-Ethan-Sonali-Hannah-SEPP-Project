import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import API_URL from '../../config';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SimilarProductCard from '../../Components/SimilarProductCard/SimilarProductCard';

import './Productpage.css';

function ProductPage() {
    const { productId } = useParams(); // Get productId from URL parameters
    const navigate = useNavigate(); // For navigation to similar products

    // State for product data
    const [productData, setProductData] = useState({
        imgSource: "https://via.placeholder.com/150",
        itemName: "Loading...",
        itemDescription: "Loading...",
        price: "0.00"
    });

    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Similar items state
    const [similarItems, setSimilarItems] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(false);
    const [similarError, setSimilarError] = useState(null);

    // Fetch product data when component mounts or productId changes
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`${API_URL}/get_product_info?product_id=${productId}`);
                setProductData({
                    imgSource: response.data.photoURL, // Updated to match the API response
                    itemName: response.data.title,
                    itemDescription: response.data.description,
                    price: response.data.price
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setError('Error loading product information.');
                setLoading(false);
            }
        };

        fetchProductData();
        // Reset quantity and messages when productId changes
        setQuantity(1);
        setError(null);
        setSuccess(false);
    }, [productId]);

    // Fetch similar items when product name is available
    useEffect(() => {
        if (productData.itemName && productData.itemName !== "Loading...") {
            setSimilarLoading(true);
            setSimilarError(null);

            const fetchSimilarItems = async () => {
                try {
                    const response = await axios.get(`${API_URL}/search_result`, {
                        params: { search_query: productData.itemName }
                    });

                    if (response.data.error) {
                        setSimilarError(response.data.error);
                        setSimilarItems([]);
                    } else {
                        setSimilarItems(response.data.items || []);
                    }
                } catch (error) {
                    console.error('Error fetching similar items:', error);
                    setSimilarError(error.response ? error.response.data.message : error.message);
                    setSimilarItems([]);
                } finally {
                    setSimilarLoading(false);
                }
            };

            fetchSimilarItems();
        }
    }, [productData.itemName]);

    const handleQuantityChange = (event) => {
        setQuantity(Math.max(1, Number(event.target.value))); // Ensure quantity is at least 1
    };

    const handleAddToBasket = async () => {
        try {
            const orderId = Cookies.get('order_id') || '-1';
            const userId = Cookies.get('user_id') || 'default';

            const data = {
                order_id: parseInt(orderId), // Ensure order_id is sent as a number
                product_id: parseInt(productId), // Ensure product_id is sent as a number
                quantity: quantity,
                user_id: userId,
            };

            const response = await axios.post(`${API_URL}/add_to_basket`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                if (response.data.new_order_id && response.data.new_order_id !== orderId) {
                    Cookies.set('order_id', response.data.new_order_id, { expires: 7 });
                }
                window.alert("Item added to basket successfully!");
                setError(null);
            } else {
                window.alert(response.data.error || 'An unknown error occurred.');
                setError(response.data.error || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error('Error adding to basket:', error);
            window.alert("An error occurred while adding to the basket.");
            setError('An error occurred while adding to the basket.');
        }
    };

    const handleSimilarProductClick = (id) => {
        navigate(`/product/${id}`); // Navigate to the clicked similar product
    };

    if (loading) {
        return <div className="product-page">Loading...</div>;
    }

    if (error) {
        return <div className="product-page">Error: {error}</div>;
    }

    return (
        <div className="product-page">
            <div className='product-container'>
                <div className='image-container'>
                    <img
                        src={productData.imgSource}
                        alt={productData.itemName}
                        className="product-image"
                    />
                </div>

                <div className='product-info-container'>
                    <h1>{productData.itemName}</h1>
                    <p>£{productData.price.toFixed(2)}</p>

                    <hr />

                    <div className='quantity-container'>
                        <h3>Quantity</h3>
                        <input
                            type='number'
                            min='1'
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </div>

                    <hr />

                    <CustomButton
                        text='Add to cart'
                        onClick={handleAddToBasket}
                    />

                    <p>{productData.itemDescription}</p>
                </div>
            </div>

            <div className='similar-products'>
                <div className='title-container'>
                    <h3>You may also like:</h3>
                </div>
                <div className='similar-products-container'>
                    {similarLoading && <p>Loading similar products...</p>}
                    {similarError && <p className="error">{similarError}</p>}
                    {!similarLoading && !similarError && similarItems.length === 0 && (
                        <p>No similar products found.</p>
                    )}
                    {!similarLoading && !similarError && similarItems.length > 0 && (
                        similarItems.map((item) => (
                            <SimilarProductCard
                                key={item.productId}
                                imgSource={item.imgSource || "https://via.placeholder.com/150"}
                                itemName={item.itemName || "Item Name"}
                                itemDescription={item.itemDescription || "Item Description"}
                                price={item.price ? item.price.toFixed(2) : "0.00"}
                                productId={item.productId}
                                onClick={() => handleSimilarProductClick(item.productId)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductPage;