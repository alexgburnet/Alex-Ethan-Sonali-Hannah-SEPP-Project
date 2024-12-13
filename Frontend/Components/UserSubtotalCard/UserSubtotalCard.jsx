import React from 'react';

import './UserSubtotalCard.css';

/* 
    The `purchases` prop should be an array of objects with the following structure:
    const purchases = [
        { item: 'Item 1', price: 10.00, quantity: 2 },
        { item: 'Item 2', price: 15.00, quantity: 1 },
        { item: 'Item 3', price: 20.00, quantity: 3 },
    ];

    The component will render only if `purchases` is not empty.
*/

function UserSubtotalCard(props) {
    const { purchases, userPFP, userName } = props;

    if (!purchases || purchases.length === 0) {
        return null;
    }

    // Calculate total price considering quantity
    const totalPrice = purchases.reduce((total, purchase) => {
        return total + purchase.price * purchase.quantity;
    }, 0);

    return (
        <div className="subtotal-card">
            {/* User Information */}
            <div className="user-info">
                <img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="User Profile" className="profile-pic" />
                <p className="user-name">{userName}</p>
            </div>

            {/* Vertical Divider */}
            <div className="vertical-line"></div>

            {/* Purchase Information */}
            <div className="purchase-info">
                {purchases.map((purchase, index) => (
                    <div className="purchase-item" key={index}>
                        <span className="item-name">{purchase.item}</span>
                        <span className="item-quantity">Qty: {purchase.quantity}</span>
                        <span className="item-price">${(purchase.price * purchase.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr />
                <div className="total-price">
                    <strong>Total: ${totalPrice.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}

UserSubtotalCard.defaultProps = {
    userPFP: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    userName: "John Doe",
    purchases: [
        { item: 'Item 1', price: 10.00, quantity: 2 },
        { item: 'Item 2', price: 15.00, quantity: 1 },
        { item: 'Item 3', price: 20.00, quantity: 3 },
    ]
}

export default UserSubtotalCard;