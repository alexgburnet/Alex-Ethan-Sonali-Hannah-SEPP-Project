import { useState } from 'react';

import CustomButton from '../../Components/CustomButton/CustomButton';
import Sidebar from '../../Components/Sidebar/Sidebar';
import UserSubtotalCard from '../../Components/UserSubtotalCard/UserSubtotalCard';
import './Cart.css';

function Cart () {

    const [confirmed, setConfirmed] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

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

    return (
        <div className="cart-page">
            <Sidebar />
            <div className="cart-container">
                {confirmed ? 
                <div className='payment-container'>
                    <div className='payment-container'>
                    <form className="payment-form">
                        <label>
                            <p>Address:</p>
                            <input
                                type="text"
                                name="address"
                                value={paymentInfo.address}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>City:</p>
                            <input
                                type="text"
                                name="city"
                                value={paymentInfo.city}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>Postal Code:</p>
                            <input
                                type="text"
                                name="postalCode"
                                value={paymentInfo.postalCode}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p>Country:</p>
                            <input
                                type="text"
                                name="country"
                                value={paymentInfo.country}
                                onChange={handleInputChange}
                            />
                        </label>
                    </form>
                </div>
                </div>
                :
                <div className="user-carts">
                    <UserSubtotalCard/>
                    <UserSubtotalCard/>
                    <UserSubtotalCard/>
                    <UserSubtotalCard/>
                    <UserSubtotalCard/>
                    <UserSubtotalCard/>
                </div>
            }
                <div className="user-subtotal-area">
                        <div className="user-subtotal">
                        <p>Your Subtotal: £12.00</p>
                        <p>Your Shipping: £1.00 (£3.00 / 3)</p>
                        <hr></hr>
                        <div className='button-container'>
                            <CustomButton 
                                text={confirmed ? 'Pay' : 'Confirm Order'}
                                onClick={pressHandler}
                            />
                        </div>

                        {!confirmed || <p> hh:mm to pay</p>}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Cart;