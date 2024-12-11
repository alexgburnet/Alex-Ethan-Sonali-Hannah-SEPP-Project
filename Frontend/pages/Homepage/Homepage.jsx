import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Searchbar from "../../Components/Searchbar/Searchbar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css';

function Homepage () {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Check if order_id is already set in cookies
        let orderId = Cookies.get('order_id');
        if (!orderId) {
            // If not set, initialize it to -1 so the backend can generate a new one on add-to-basket
            Cookies.set('order_id', '-1', { expires: 7 }); // Expires in 7 days
            console.log('order_id was not found. Initialized to -1.');
        } else {
            console.log(`order_id found in cookies: ${orderId}`);
        }
    }, []);

    const handleSearch = (query) => {
        console.log(`Search query: ${query}`);
        setSearchQuery(query);
    }

    return (
        <div className="homepage">
            <Sidebar />
            <div className="items-search">
                <Searchbar onSearch={handleSearch}/>
                <ItemContainer searchQuery={searchQuery}/>
            </div>
        </div>
    );
}

export default Homepage;