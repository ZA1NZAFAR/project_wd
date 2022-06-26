import React from "react";
import Navbar from "./Navbar";
import FerrisWheelVideo from "./FerrisWheelVideo";

const Home = () => {
  return (
    <div>
      <Navbar alternativeStyling={false} />
      <FerrisWheelVideo />
    </div>
  );
};

export default Home;