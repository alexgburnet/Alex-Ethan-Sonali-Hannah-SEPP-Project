import { Link } from 'react-router-dom'

import './SimilarProductCard.css'

function SimilarProductCard () {


    return (
            <Link to='/product' className='similar-product-container'>
                <div className='image-container'>
                    <img src='https://via.placeholder.com/150' alt="Item" />
                </div>
                <div className='detail-container'>
                    <h4>Title</h4>
                </div>
            </Link>
    )
}

export default SimilarProductCard