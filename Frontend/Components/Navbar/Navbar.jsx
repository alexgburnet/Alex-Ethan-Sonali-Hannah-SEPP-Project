import { useState, useEffect } from "react";

import "./Navbar.css";
import { Link } from 'react-router-dom';

function Navbar () {

  const [title, setTitle] = useState("Student Smart Homes");

  // Function to check screen size and orientation
  const updateTitle = () => {
    if (window.innerWidth <= 768 || window.innerHeight > window.innerWidth) {
      setTitle("SSH");
    } else {
      setTitle("Student Smart Homes");
    }
  };

  // Add event listener for resize
  useEffect(() => {
    updateTitle(); // Initial check
    window.addEventListener("resize", updateTitle);
    return () => {
      window.removeEventListener("resize", updateTitle); // Cleanup listener
    };
  }, []);


  return (
    <header>
      <div className="SiteNameHeader">
        <Link to="/" className="link">
          <h1>{title}</h1>
        </Link>
      </div>
      {/*cart icon*/}
      <div className="CartIcon">
        <Link to="/cart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;