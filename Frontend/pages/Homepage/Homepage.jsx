import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css'

function Homepage () {


    return (
        <div className="homepage">
            <Sidebar />
            <ItemContainer />
        </div>
    )
}

export default Homepage;