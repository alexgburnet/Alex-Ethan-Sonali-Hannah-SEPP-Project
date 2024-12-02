import React from 'react';
import { useLocation } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';

import CustomButton from '../../Components/CustomButton/CustomButton';

import './Productpage.css';
import 'react-image-gallery/styles/css/image-gallery.css';

function ProductPage() {
    const location = useLocation();

    const { imgSource, itemName, itemDescription, price } = location.state || ProductPage.defaultProps;

    const clickHandler = () => {
        console.log('add to cart');
    }

    const images = [
        {
            original: imgSource,
        }
    ];

    return (
        <div className="product-page">
            <div className='product-container'>
                <div className='image-container'>
                    <ImageGallery 
                        items={images}
                        showPlayButton={false}
                        showFullscreenButton={false}
                    />
                </div>

                <div className='product-info-container'>
                    <h1>{itemName}</h1>
                    <p>${price}</p>

                    <hr></hr>

                    <div className='quantity-container'>
                        <h3>Quantity</h3>
                        <input type='number' min='1' max='10' defaultValue='1'></input>
                    </div>

                    <hr></hr>

                    <CustomButton 
                        text='Add to cart'
                        onClick={clickHandler}
                    />

                    <p>{itemDescription}</p>
                </div>
            </div>

            <div className='similar-products-container'>
                <p>similar products</p>
            </div>
        </div>
    );
}

ProductPage.defaultProps = {
    imgSource: "https://via.placeholder.com/150",
    itemName: "Item Name",
    itemDescription: "Item Description",
    price: "0.00"
}

export default ProductPage;