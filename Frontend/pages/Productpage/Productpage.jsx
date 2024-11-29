import './Productpage.css';

function ProductPage() {

    
  return (
    <div className="product-page">
        <div className='product-container'>

            <div className='image-container'>
                <p>image container</p>
            </div>

            <div className='product-info-container'>
                <p>product info</p>
            </div>

        </div>

        <div className='similar-products-container'>
            <p>similar products</p>
        </div>
    </div>
  );
}

export default ProductPage;