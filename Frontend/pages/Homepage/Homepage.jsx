import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Searchbar from "../../components/Searchbar/Searchbar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css'

function Homepage () {


    return (
        <div className="homepage">
            <Sidebar />
            <div className="items-search">
                <Searchbar />
                <ItemContainer />
            </div>
        </div>
    )
}

export default Homepage;