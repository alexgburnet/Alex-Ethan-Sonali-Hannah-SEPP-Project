import './UserSubtotalCard.css';

function UserSubtotalCard() {
    return (
        <div className="subtotal-card">
            <div className="user-info">
                <img src="https://via.placeholder.com/150" alt="User Profile" className="profile-pic" />
                <p className="user-name">John Doe</p>
            </div>
            <div className="vertical-line"></div>
            <div className="purchase-info">
                <p>Item 1: $10.00</p>
                <p>Item 2: $15.00</p>
                <p>Item 3: $20.00</p>
                <p>Item 3: $20.00</p>
                <p>Item 3: $20.00</p>
                <p>Item 3: $20.00</p>
                <p>Item 3: $20.00</p>
                <p>Item 3: $20.00</p>
                <p>Total: $45.00</p>
            </div>
        </div>
    );
}

export default UserSubtotalCard;