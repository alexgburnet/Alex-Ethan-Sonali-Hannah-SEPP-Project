import React, { useState, useEffect } from 'react';
import axios from 'axios';

import API_URL from '../../config';

import './ItemContainer.css';
import ItemCard from '../ItemCard/ItemCard';

function ItemContainer({ searchQuery }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchItems = async () => {
      try {
        // Determine the API URL based on whether there is a search query
        const url = searchQuery
          ? `${API_URL}/search_result?search_query=${searchQuery}`
          : `${API_URL}/search_result`;

        const response = await axios.get(url);

        // Handle response based on your API's data structure
        if (response.data.error) {
          setError(response.data.error); // API error handling
          setItems([]);
        } else {
          setItems(response.data.items || []); // Populate items, if available
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery]);

  return (
    <div className="item-container">
      <div className="search-result">
        <p>{searchQuery ? `Results for: ${searchQuery}` : "Here are some random items you might like!"}</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="item-cards-grid">
        {searchQuery && items.length === 0 && !loading && !error && (
          <p>No items found</p>
        )}
        {items.length > 0 && 
          items.map((item, index) => (
            <ItemCard
              key={index}
              imgSource={item.imgSource || "https://via.placeholder.com/150"} // Fallback to placeholder if no imgSource
              itemName={item.itemName || "Item Name"} // Default name if missing
              itemDescription={item.itemDescription || "Item Description"} // Default description if missing
              price={item.price ? item.price.toFixed(2) : "0.00"} // Format price
              productId={item.productId}
            />
          ))
        }
      </div>
    </div>
  );
}

export default ItemContainer;