import './ItemCard.css';

function ItemCard(props) {
    return(
        <div className="ItemCard">
            <div className="ItemCardImage">
                <img src={props.imgSource} alt="Item" />
            </div>
            <div className="ItemCardDetails">
                <h3>{props.itemName}</h3>
                <p>{props.itemDescription}</p>
                <p>Price: ${props.price}</p>
            </div>
        </div>
    );
}

export default ItemCard;