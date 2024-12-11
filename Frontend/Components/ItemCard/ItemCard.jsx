import React from 'react';

import './ItemCard.css';
import { Link } from 'react-router-dom';

function ItemCard(props) {

    return (
        <Link to={`/product/${props.productId}`} className="ItemCardLink">
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
        </Link>
    );
}

ItemCard.defaultProps = {
    imgSource: "https://via.placeholder.com/150",
    itemName: "Item Name",
    itemDescription: "Item Description",
    price: "0.00"
}

export default ItemCard;