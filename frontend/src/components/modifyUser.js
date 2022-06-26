//EN COURS :
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ModifyUser = () => {
    const baseUrl = "http://localhost:5000/authentication";
    const [prenom, setprenom] = useState('');
    const [nom, setnom] = useState('');
    const [mail, setmail] = useState('');


  const updateUser = () => {
     axios.get(baseUrl + "/validUser").then((response) => {
      if (response.data) {
        const first_name = response.data.element1
        const last_name = response.data.element2
        const email = response.data.element3
        //alert(last_name);
        setprenom(first_name);
        setnom(last_name);
        setmail(email);
      } else {
        alert("Something went wrong... Please try later.");
      }
    });
  };

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="First Name" value = {prenom} name="first_name">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="Last Name" value = {nom} name="last_name">
        </input>
        </div>
    </div>
    <div class="col-6">
        <div class="form-floating mb-3">
        <input type="text" class="form-control" id="floatingInput" placeholder="email" value = {mail} name="last_name">
        </input>
        </div>
    </div>
    
    <div class="col-6 d-grid">
        <button onClick={updateUser} class="btn btn-primary" type="submit">Update</button>
    </div>
    </div>
  );
}

export default ModifyUser;