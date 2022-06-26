import { Navigate, Outlet, Router } from "react-router-dom";
import react, { useEffect, useState, useRef } from "react";

const Axios = require("axios");
Axios.defaults.withCredentials = true;

export default function CurrentUser() {
  const getAnswer = async () => {
    try {
      const request = await Axios.get(
        "http://localhost:5000/authentication/validUser"
      ).then((response) => {
        console.log(response.data.message);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAnswer();
    console.log(getAnswer());
  }, []);

  return (
    <div>
      <h1>currentuser</h1>
    </div>
  );
}
