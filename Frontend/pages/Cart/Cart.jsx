import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Sidebar from '../../Components/Sidebar/Sidebar';
import UserSubtotalCard from '../../Components/UserSubtotalCard/UserSubtotalCard';
import AddressForm from '../../Components/AddressForm/AddressForm';
import './Cart.css';
import API_URL from '../../config';

function Cart() {
    const [confirmed, setConfirmed] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [userCarts, setUserCarts] = useState([]);
    const [deliveryCost, setDeliveryCost] = useState({ total: 0, individual: 0, people: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [timeDue, setTimeDue] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [finalCost, setFinalCost] = useState(null);

    // Extract user_id and order_id from cookies
    const user_id = Cookies.get('user_id');
    const order_id = Cookies.get('order_id');

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const pressHandler = async () => {
        setConfirming(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/confirm_order`, {
                user_id,
                order_id
            });

            if (response.data.success) {
                setConfirmed(true);
                setOrderConfirmed(true);
            } else {
                setError(response.data.message || "Failed to confirm the order.");
            }
        } catch (err) {
            console.error("Error confirming order (try signing out and back in):", err);
            setError("An error occurred while confirming the order. (try signing out and back in)");
        } finally {
            setConfirming(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchData = async () => {
        try {
            if (order_id === '-1') {
                console.warn("Skipping API calls because order_id is -1.");
                return;
            }

            const [basketRes, deliveryRes, hostRes, confirmRes] = await Promise.all([
                axios.get(`${API_URL}/get_user_basket`, { params: { user_id, order_id } }),
                axios.get(`${API_URL}/get_delivery_cost`, { params: { order_id } }),
                axios.get(`${API_URL}/user_is_host`, { params: { user_id, order_id } }),
                axios.get(`${API_URL}/check_if_order_confirmed`, { params: { order_id } })
            ]);

            if (basketRes.data.userCarts) setUserCarts(basketRes.data.userCarts);
            if (deliveryRes.data.total) setDeliveryCost(deliveryRes.data);
            if (typeof hostRes.data.isHost === 'boolean') setIsHost(hostRes.data.isHost);
            if (typeof confirmRes.data.confirmed === 'boolean') {
                setOrderConfirmed(confirmRes.data.confirmed);
                setConfirmed(confirmRes.data.confirmed);
            }
        } catch (err) {
            console.error("Error fetching cart data:", err);
            setError("Failed to fetch cart data. (try signing out and back in)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user_id && order_id) {
            fetchData();
        } else {
            setError("User ID or Order ID is missing. Please log in again.");
            setLoading(false);
        }
    }, [user_id, order_id]);

    useEffect(() => {
        let timer;
        if (confirmed && order_id !== '-1') {
            const fetchTimeDue = async () => {
                try {
                    const response = await axios.get(`${API_URL}/get_time_due`, { params: { order_id } });
                    if (response.data.time_due) {
                        const dueDate = new Date(response.data.time_due);
                        setTimeDue(dueDate);
                        const initialTimeLeft = Math.floor((dueDate - new Date()) / 1000);
                        setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);
                    }
                } catch (err) {
                    console.error("Error fetching time due:", err);
                }
            };

            fetchTimeDue();

            timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [confirmed, order_id]);

    useEffect(() => {
        const fetchFinalCost = async () => {
            try {
                if (order_id === '-1') {
                    console.warn("Skipping final cost fetch because order_id is -1.");
                    return;
                }

                const response = await axios.get(`${API_URL}/get_final_cost`, { params: { order_id, user_id } });
                if (response.data.final_cost) setFinalCost(response.data.final_cost);
            } catch (err) {
                console.error("Error fetching final cost:", err);
            }
        };

        if (orderConfirmed) fetchFinalCost();
    }, [orderConfirmed, order_id, user_id]);

    const calculateSubtotal = () => {
        return userCarts[0]?.purchases.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    };

    const subtotal = calculateSubtotal();
    const shipping = deliveryCost.individual;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="cart-page">
                <Sidebar />
                <div className="cart-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page">
                <Sidebar />
                <div className="cart-container">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Sidebar />
            <div className="cart-container">
                <div className="user-carts">
                    {userCarts.length > 0 ? (
                        userCarts.map((cart, index) => (
                            <UserSubtotalCard
                                key={index}
                                userPFP={cart.userPFP}
                                userName={cart.userName}
                                purchases={cart.purchases}
                                isCurrentUser={index === 0}
                            />
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
                <div className="user-subtotal-area">
                    <div className="user-subtotal">
                        <p><strong>Subtotal:</strong> £{subtotal.toFixed(2)}</p>
                        <p>
                            <strong>Shipping:</strong> £{shipping.toFixed(2)} (£{deliveryCost.total} / {deliveryCost.people})
                        </p>
                        <hr />
                        <p><strong>Total:</strong> £{total.toFixed(2)}</p>
                        {confirmed && finalCost !== null && (
                            <div className="final-cost">
                                <p><strong>Final Cost:</strong> £{finalCost.toFixed(2)}</p>
                            </div>
                        )}
                        <div className="button-container">
                            {isHost ? 
                                <CustomButton 
                                    text={confirmed ? 'Pay' : (confirming ? 'Confirming...' : 'Confirm Order')}
                                    onClick={pressHandler}
                                    disabled={confirming || (!isHost && !confirmed)} // Disable during confirmation or if not host
                                />
                                :
                                <CustomButton 
                                    text={confirmed ? 'Pay' : 'Host must confirm order'}
                                    onClick={pressHandler}
                                    disabled={!confirmed || !isHost} // Disable if not host and not confirmed
                                />
                            }
                        </div>
                        {error && (
                            <div className="error-message">
                                <p>Error: {error}</p>
                            </div>
                        )}
                        {confirmed && timeLeft > 0 && (
                            <div className="timer">
                                <p>Time to pay: {formatTime(timeLeft)}</p>
                            </div>
                        )}
                    </div>
                    <div className="link-container">
                        <p><strong>Share this link to add others:</strong></p>
                        <p>http://172.167.146.215:3000/?order={order_id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;