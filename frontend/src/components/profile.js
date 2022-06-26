// EN COURS : Va permettre de mettre en place le profil du user :

import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

function Profile() {
  let { id } = useParams();
  return (
    <div>
      <Navbar />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <section id="about-section" class="pt-5 pb-5">
        <div class="container wrapabout">
          <div class="red"></div>
          <div class="row">
            <div class="col-lg-6 align-items-center justify-content-left d-flex mb-5 mb-lg-0">
              <div class="blockabout">
                <div class="blockabout-inner text-center text-sm-start">
                  <div class="title-big pb-3 mb-3">
                    <h3>ABOUT ME</h3>
                  </div>
                  <p class="description-p text-muted pe-0 pe-lg-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Natus quas optio reiciendis deleniti voluptatem facere
                    sequi, quia, est sed dicta aliquid quidem facilis culpa iure
                    perferendis? Dolor ad quia deserunt.
                  </p>
                  <p class="description-p text-muted pe-0 pe-lg-0">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Natus quas optio reiciendis deleniti voluptatem facere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
