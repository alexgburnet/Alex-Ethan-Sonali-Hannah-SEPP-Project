// Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for HTTP requests
import CustomButton from '../../Components/CustomButton/CustomButton';
import Sidebar from '../../Components/Sidebar/Sidebar';
import UserSubtotalCard from '../../Components/UserSubtotalCard/UserSubtotalCard';
import AddressForm from '../../Components/AddressForm/AddressForm';
import './Cart.css';
import API_URL from '../../config';
import { useLocation } from 'react-router-dom'; // Import useLocation if using query params

function Cart () {

    const [confirmed, setConfirmed] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false); // New state variable
    const [paymentInfo, setPaymentInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    
    const [userCarts, setUserCarts] = useState([]); // State to store fetched user carts
    const [deliveryCost, setDeliveryCost] = useState({ total: 0, individual: 0 }); // State to store delivery cost
    const [loading, setLoading] = useState(true);   // State to manage loading
    const [error, setError] = useState(null);       // State to manage errors
    const [confirming, setConfirming] = useState(false); // New state for confirmation loading

    const pressHandler = async () => {
        setConfirming(true); // Start confirmation loading
        setError(null); // Reset any previous errors

        try {
            const response = await axios.post(`${API_URL}/confirm_order`, {
                user_id,
                order_id
            });

            if (response.data && response.data.success) {
                setConfirmed(true); // Update confirmed state on success
                // Optionally, you might want to refetch the confirmation status
                // to ensure synchronization
                // fetchData();
            } else {
                setError(response.data.message || "Failed to confirm the order.");
            }
        } catch (err) {
            console.error("Error confirming order:", err);
            setError("An error occurred while confirming the order.");
        } finally {
            setConfirming(false); // End confirmation loading
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Extract user_id and order_id from query params or other sources
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const user_id = query.get('user_id') || 'xxx'; // Replace 'xxx' with actual user_id or handle accordingly
    const order_id = query.get('order_id') || 'xxx'; // Replace 'xxx' with actual order_id or handle accordingly

    // Function to fetch user basket, delivery cost, host status, and order confirmation status from the API
    const fetchData = async () => {
        try {
            // Fetch all APIs in parallel
            const [basketResponse, deliveryResponse, hostResponse, confirmResponse] = await Promise.all([
                axios.get(`${API_URL}/get_user_basket`, {
                    params: { user_id, order_id }
                }),
                axios.get(`${API_URL}/get_delivery_cost`, {
                    params: { order_id }
                }),
                axios.get(`${API_URL}/user_is_host`, {
                    params: { user_id, order_id }
                }),
                axios.get(`${API_URL}/check_if_order_confirmed`, {
                    params: { order_id }
                })
            ]);

            // Handle user basket response
            if (basketResponse.data && basketResponse.data.userCarts) {
                setUserCarts(basketResponse.data.userCarts);
            } else {
                setError("Invalid response from basket API.");
            }

            // Handle delivery cost response
            if (deliveryResponse.data && deliveryResponse.data.total !== undefined && deliveryResponse.data.individual !== undefined) {
                setDeliveryCost({
                    total: deliveryResponse.data.total,
                    individual: deliveryResponse.data.individual
                });
            } else {
                setError("Invalid response from delivery cost API.");
            }

            // Handle host status response
            if (hostResponse.data && typeof hostResponse.data.isHost === 'boolean') {
                setIsHost(hostResponse.data.isHost);
            } else {
                setError("Invalid response from host status API.");
            }

            // Handle order confirmation response
            if (confirmResponse.data && typeof confirmResponse.data.confirmed === 'boolean') {
                setOrderConfirmed(confirmResponse.data.confirmed);
                if (confirmResponse.data.confirmed) {
                    setConfirmed(true); // If already confirmed, update the confirmed state
                }
            } else {
                setError("Invalid response from order confirmation API.");
            }

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch cart, delivery, host, or confirmation data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user_id, order_id]); // Dependency array includes user_id and order_id

    // Function to calculate Subtotal based on the first userCart (current user)
    const calculateSubtotal = () => {
        if (userCarts.length === 0) return 0;
        const firstUserCart = userCarts[0];
        return firstUserCart.purchases.reduce((acc, purchase) => {
            return acc + purchase.price * purchase.quantity;
        }, 0);
    };

    // Function to calculate total number of items for Shipping calculation based on the first userCart
    const calculateTotalItems = () => {
        if (userCarts.length === 0) return 0;
        const firstUserCart = userCarts[0];
        return firstUserCart.purchases.reduce((acc, purchase) => {
            return acc + purchase.quantity;
        }, 0);
    };

    // Calculate Subtotal and Shipping based on fetched data
    const subtotal = calculateSubtotal();
    const totalItems = calculateTotalItems();
    const shipping = deliveryCost.individual * totalItems; // Correct shipping calculation
    const total = subtotal + shipping; // Correct total calculation

    // Conditional rendering based on loading and error states
    if (loading) {
        return (
            <div className="cart-page">
                <Sidebar />
                <div className="cart-container">
                    <div className="spinner"></div>
                    <p>Loading your basket...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page">
                <Sidebar />
                <div className="cart-container">
                    <div className="error-message">
                        <p>Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Sidebar />
            <div className="cart-container">

                {confirmed && isHost ?
                    <div className='address-container'>
                        <h3>Delivery Address:</h3>
                        <AddressForm AddressInfo={paymentInfo} setAddressInfo={setPaymentInfo}/>
                    </div>
                :
                    <div className="user-carts">
                        {userCarts.length > 0 ? (
                            <>
                                {/* Current User's Cart */}
                                <UserSubtotalCard 
                                    key={0} 
                                    userPFP={userCarts[0].userPFP} 
                                    userName={userCarts[0].userName} 
                                    purchases={userCarts[0].purchases} 
                                    isCurrentUser={true} 
                                />
                                
                                {/* Other Users' Carts */}
                                {userCarts.slice(1).map((userCart, index) => (
                                    <UserSubtotalCard 
                                        key={index + 1} 
                                        userPFP={userCart.userPFP} 
                                        userName={userCart.userName} 
                                        purchases={userCart.purchases} 
                                        isCurrentUser={false} 
                                    />
                                ))}
                            </>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>
                }

                <div className="user-subtotal-area">
                    <div className="user-subtotal">
                        <p><strong>Subtotal:</strong> £{subtotal.toFixed(2)}</p>
                        <p>
                            <strong>Shipping:</strong> £{shipping.toFixed(2)} 
                            {deliveryCost.individual ? ` (£${deliveryCost.individual.toFixed(2)} x ${totalItems})` : ''}
                        </p>
                        <hr />
                        <div className='button-container'>
                            {isHost ? 
                                <CustomButton 
                                    text={confirmed ? 'Pay' : (confirming ? 'Confirming...' : 'Confirm Order')}
                                    onClick={pressHandler}
                                    disabled={confirming || orderConfirmed} // Disable during confirmation or if already confirmed
                                />
                                :
                                <CustomButton 
                                    text={confirmed ? 'Pay' : 'Host must confirm order'}
                                    onClick={pressHandler}
                                    disabled={!confirmed || orderConfirmed} // Disable based on confirmation status
                                />
                            }
                        </div>

                        {orderConfirmed && (
                            <div className='confirmation-message'>
                                <p>Your order has been confirmed!</p>
                            </div>
                        )}

                        {error && (
                            <div className='error-message'>
                                <p>Error: {error}</p>
                            </div>
                        )}

                        {confirmed && (
                            <div className='timer'>
                                <p>hh:mm to pay</p>
                            </div>
                        )}
                        <hr />
                        <p><strong>Total:</strong> £{total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;