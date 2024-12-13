import React from 'react';
import { Link } from 'react-router-dom';

import './SimilarProductCard.css';

function SimilarProductCard(props) {
    return (
        <Link to={`/product/${props.productId}`} className='similar-product-container'>
            <div className='image-container'>
                <img 
                    src={props.imgSource || 'https://via.placeholder.com/150'} 
                    alt={props.itemName || 'Item'} 
                    className='product-image' 
                />
            </div>
            <div className='detail-container'>
                <h4>{props.itemName || 'No Title Available'}</h4>
            </div>
        </Link>
    );
}

export default SimilarProductCard;