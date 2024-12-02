import './ItemCard.css';

function ItemCard() {
    return(
        <div className="ItemCard">
            <div className="ItemCardImage">
                <img src="https://via.placeholder.com/150" alt="Item" />
            </div>
            <div className="ItemCardDetails">
                <h3>Item Name</h3>
                <p>Item Description</p>
                <p>Price: $0.00</p>
            </div>
        </div>
    );
}

export default ItemCard;