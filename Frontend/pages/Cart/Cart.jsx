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

    const pressHandler = () => {
        setConfirmed(true);
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

    // Function to fetch user basket and delivery cost data from the API
    const fetchData = async () => {
        try {
            // Replace 'xxx' with actual user_id and order_id, possibly from props or context
            const user_id = 'xxx'; // Replace with actual user_id
            const order_id = 'xxx'; // Replace with actual order_id
    
            // Fetch all APIs in parallel
            const [basketResponse, deliveryResponse, hostResponse] = await Promise.all([
                axios.get(`${API_URL}/get_user_basket`, {
                    params: { user_id, order_id }
                }),
                axios.get(`${API_URL}/get_delivery_cost`, {
                    params: { order_id }
                }),
                axios.get(`${API_URL}/user_is_host`, {
                    params: { user_id, order_id }
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
    
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch cart, delivery, or host data.");
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

    // Calculate Subtotal and Shipping based on fetched data
    const subtotal = calculateSubtotal();
    const shipping = deliveryCost.total; // Use the fetched total delivery cost
    const total = subtotal + deliveryCost.individual; // Calculate total cost

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
                        <p><strong>Shipping:</strong> £{shipping.toFixed(2)} {deliveryCost.individual ? ` (Individual: £${deliveryCost.individual.toFixed(2)})` : ''}</p>
                        <hr />
                        <div className='button-container'>
                            {isHost ? 
                                <CustomButton 
                                    text={confirmed ? 'Pay' : 'Confirm Order'}
                                    onClick={pressHandler}
                                />
                                :
                                <CustomButton 
                                    text={confirmed ? 'Pay' : 'Host must confirm order'}
                                    onClick={pressHandler}
                                    disabled={confirmed ? false : true}
                                />
                            }
                        </div>

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