// EN COURS : Logout ok, test de edit user :
import React from "react";
import axios from "axios";
import { Navigate, Outlet, Router } from "react-router-dom";
import { Link } from "react-router-dom";
const baseUrl = "http://localhost:5000/authentication";

const Logout = () => {
  const request = () => {
    axios.get(baseUrl + "/logout").then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        alert(response.data.message);
        Navigate("/LoginUser");
      } else {
        alert("Something went wrong... Please try later.");
      }
    });
  };

  return (
    <div>
      <button onClick={request} type="button" className="button">
        Logout
      </button>
      <button type="button" className="button">
        <Link to={"/ModifyUser"}>Modify user</Link>
      </button>
    </div>
  );
};

export default Logout;
