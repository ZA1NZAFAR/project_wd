import React from "react";
import "../styles/FerrisWheelVideoStyle.css";
import video from "../resources/videos/wheel.mp4";
import { Link } from "react-router-dom";

const FerrisWheelVideo = () => {
  return (
    <div className="video">
      <video autoPlay loop muted id="videoElement">
        <source src={video} type="video/mp4" />
      </video>
      <div className="content">
        <h1>Be a part of the life wheel.</h1>
        <p>Becoming an owner is now possible</p>
        <div>
          <Link to="/LoginAdmin" className="btn">
            {" "}
            Are you an Agent ?{" "}
          </Link>
          <Link to="/LoginUser" className="btn">
            {" "}
            Are you a client ?{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FerrisWheelVideo;