import './UserSubtotalCard.css';

/*purchase array should be of form
const purchases = [
        { item: 'Item 1', price: 10.00 },
        { item: 'Item 2', price: 15.00 },
        { item: 'Item 3', price: 20.00 },
    ];
 */
function UserSubtotalCard(props) {
    const purchases = props.purchases;
    const totalPrice = purchases.reduce((total, purchase) => total + purchase.price, 0);
    return (
        <div className="subtotal-card">
            <div className="user-info">
                <img src={props.userPFP} alt="User Profile" className="profile-pic" />
                <p className="user-name">{props.userName}</p>
            </div>
            <div className="vertical-line"></div>
            <div className="purchase-info">
                {purchases.map((purchase, index) => (
                    <p key={index}>
                        <p>{purchase.item}</p>
                        <p>{purchase.price.toFixed(2)}</p>
                    </p>
                ))}
                <hr />
                <p>Total: ${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
}

UserSubtotalCard.defaultProps = {
    userPFP: "https://via.placeholder.com/150",
    userName: "John Doe",
    purchases: [
        { item: 'Item 1', price: 10.00 },
        { item: 'Item 2', price: 15.00 },
        { item: 'Item 3', price: 20.00 },
    ]
}

export default UserSubtotalCard;