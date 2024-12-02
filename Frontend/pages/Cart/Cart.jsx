import { useState } from 'react';

import CustomButton from '../../Components/CustomButton/CustomButton';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Cart.css';

function Cart () {

    const [confirmed, setConfirmed] = useState(false);

    const pressHandler = () => {
        setConfirmed(true);
    }

    return (
        <div className="cart-page">
            <Sidebar />
            <div className="cart-container">
                <div className="user-carts">
                    <p>user carts here</p>
                </div>
                <div className="user-subtotal-area">
                        <div className="user-subtotal">
                        <p>Your Subtotal: £12.00</p>
                        <p>Your Shipping: £1.00 (£3.00 / 3)</p>
                        <hr></hr>

                        <CustomButton 
                            text={confirmed ? 'Pay' : 'Confirm Order'}
                            onClick={pressHandler}
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Cart;