import { useState } from "react";

import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Searchbar from "../../Components/Searchbar/Searchbar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css'

function Homepage () {

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    return (
        <div className="homepage">
            <Sidebar />
            <div className="items-search">
                <Searchbar setSearchQuery={setSearchQuery} onSearch={handleSearch}/>
                <ItemContainer searchQuery={searchResult}/>
            </div>
        </div>
    )
}

export default Homepage;