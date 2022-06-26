// A FAIRE : Mettre le logout quand connecté et login quand pas de user connecté :

import React, { useState } from "react";
import "../styles/NavbarStyle.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';


const Navbar = ({ alternativeStyling }) => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const location = useLocation();
  const navigate = useNavigate();

  const navigateToHouseTours = () => {
    const fromWhere = location.state?.fromWhere?.pathname || "/HouseTours";
    navigate(fromWhere, { replace: true });
  }

  const navigateToTransactions = () => {
    const fromWhere = location.state?.fromWhere?.pathname || "/Transactions";
    navigate(fromWhere, { replace: true });
  }

  return (
    <div className={(alternativeStyling) ? "header" : "header fixed"}>
        <h1><a href="/" className={(alternativeStyling) ? "link alternative" : "link"}>ReSTATE.</a></h1>
      <ul className={click ? "Nav-menu active" : "Nav-menu"}>
        <li>   
        <a href="/" className={(alternativeStyling) ? "link alternative" : "link"}>Home</a>
        </li>
        <li>
        <a href="/LoginUser" className={(alternativeStyling) ? "link alternative" : "link"}>Login/Signup</a>        
        </li>
        <li>
        <a href="/profile" className={(alternativeStyling) ? "link alternative" : "link"}>Profile</a>        
        </li>
        <li>
        <a href="/Logout" className={(alternativeStyling) ? "link alternative" : "link"}>Logout</a>        
        </li>
        <li>
        <a href="/Properties" className={(alternativeStyling) ? "link alternative" : "link"}>Properties</a>        
        </li>
        <li>
        <a href="#" onClick={navigateToHouseTours} className={(alternativeStyling) ? "link alternative" : "link"}>Visites</a>        
        </li>
        <li>
        <a href="#" onClick={navigateToTransactions} className={(alternativeStyling) ? "link alternative" : "link"}>Transactions</a>        
        </li>
      </ul>
      <div className="icons" onClick={handleClick}>
        {click ? (
          <FaTimes size={30} style={{ color: "blue" }} />
        ) : (
          <FaBars size={30} style={{ color: "blue" }} />
        )}
      </div>
    </div>
  );
};

export default Navbar;