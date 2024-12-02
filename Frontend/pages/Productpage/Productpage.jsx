import ImageGallery from 'react-image-gallery';

import './Productpage.css';
import 'react-image-gallery/styles/css/image-gallery.css';

function ProductPage() {

    const images = [
        {
          original: "https://picsum.photos/id/1018/1000/600/",
          thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
          original: "https://picsum.photos/id/1015/1000/600/",
          thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
          original: "https://picsum.photos/id/1019/1000/600/",
          thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
      ];
      
    
  return (
    <div className="product-page">
        <div className='product-container'>

            <div className='image-container'>
                <ImageGallery 
                    items={images}
                    showPlayButton={false}
                    showFullscreenButton={false}
                />
            </div>

            <div className='product-info-container'>
                <h1>Title</h1>

                <hr></hr>

                <div className='quantity-container'>
                    <h3>Quantity</h3>
                    <input type='number' min='1' max='10' defaultValue='1'></input>
                </div>

                <hr></hr>

                <button className='add-to-cart'>Add to cart</button>

                <p>Description</p>


            </div>

        </div>

        <div className='similar-products-container'>
            <p>similar products</p>
        </div>
    </div>
  );
}

export default ProductPage;