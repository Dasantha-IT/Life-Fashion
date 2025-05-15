import React from 'react'
import "./nav.css"; 
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div>
      <ul className="home-ul">
        <li className="home ll">
            <Link to="/mainhome" className="active home-a">
           <h1>Home</h1></Link>
        </li>
        <li className="home ll">
        <Link to="/adddelivery" className="active home-a">
           <h1>ADD Delivery</h1></Link>
        </li>
        <li className="home ll">
        <Link to="/deliverydetails" className="active home-a">
           <h1>Delivery details</h1></Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav
