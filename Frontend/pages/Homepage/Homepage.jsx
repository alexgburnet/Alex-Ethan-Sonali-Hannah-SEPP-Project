import Sidebar from "../../Components/Sidebar/Sidebar.jsx";

import './Homepage.css'

function Homepage () {


    return (
        <div className="homepage">
            <Sidebar />
            <div className="item-container">
                <p>items</p>
            </div>
        </div>
    )
}

export default Homepage;