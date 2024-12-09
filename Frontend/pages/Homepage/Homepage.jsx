import React from 'react';

import { useState } from "react";

import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Searchbar from "../../Components/Searchbar/Searchbar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css'

function Homepage () {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        console.log(query);
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
    )
}

export default Homepage;