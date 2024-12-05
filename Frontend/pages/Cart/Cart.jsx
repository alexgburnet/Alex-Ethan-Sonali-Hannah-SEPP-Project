import { useState } from 'react';

import CustomButton from '../../Components/CustomButton/CustomButton';
import Sidebar from '../../Components/Sidebar/Sidebar';
import UserSubtotalCard from '../../Components/UserSubtotalCard/UserSubtotalCard';
import AddressForm from '../../Components/AddressForm/AddressForm';
import './Cart.css';

function Cart () {

    const [confirmed, setConfirmed] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const isHost = true;

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

                {confirmed && isHost ?
                    <div className='address-container'>
                        <h3>Delivery Address:</h3>
                        <AddressForm AddressInfo={paymentInfo} setAddressInfo={setPaymentInfo}/>
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

                        {!confirmed || <div className='timer'><p> hh:mm to pay</p></div>}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Cart;