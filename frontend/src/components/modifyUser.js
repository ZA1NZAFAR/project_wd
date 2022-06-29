//EN COURS :
import axios from "axios";
import React, { useState, useEffect } from "react";

const ModifyUser = () => {
  const baseUrl = "http://localhost:5000/authentication";
  const [prenom, setprenom] = useState("");
  const [nom, setnom] = useState("");
  const [mail, setmail] = useState("");
  const [id, setid] = useState("");

  //display the current User info :
  const currentUser = () => {
    axios.get(baseUrl + "/validUser").then((response) => {
      if (response.data) {
        const first_name = response.data.element1;
        const last_name = response.data.element2;
        const email = response.data.element3;
        const id = response.data.id;
        //alert(last_name);
        setprenom(first_name);
        console.log("first_name dans modifyuser : " + first_name);
        setnom(last_name);
        console.log("last_name dans modifyuser : " + last_name);
        setmail(email);
        console.log("email dans modifyuser : " + email);
        setid(id);
        console.log("id dans modifyuser : " + id);
      } else {
        alert("Something went wrong... Please try later.");
      }
    });
  };

  //app.put("/authentication/updateUser74", { id: "74", user_last_name: "abc" });

  // JSON.stringify permet de convertir un objet en string
  // {} : représente un objet
  // Si on met axios.get(la méthode à exécuter, les paramètres).then(renvoie le return de la méthode exécutée)
  const deleteUser = () => {
    axios.delete(baseUrl + "/deleteUser" + "/" + id).then((response) => {
      if (response.data) {
        alert("okay");
      } else {
        alert("Something went wrong... Please try later.");
      }
    });
  };

  // FONCTION UPDATE PROBLEMATIQUE :
  const updateUser = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("dans le front : ");
    console.log(id);
    console.log(prenom);
    console.log(nom);
    console.log(mail);
    axios
      .put(baseUrl + "/uptadeUser" + "/" + id, {
        mail: mail,
        prenom: prenom,
        nom: nom,
      }, config)
      .then((response) => {
        if (response.data) {
          alert("okay");
        } else {
          alert("Something went wrong... Please try later.");
        }
      });
  };
  ///////

  useEffect(() => {
    currentUser();
    //updateUser();
    //deleteUser();
  }, []);

  return (
    <div>
      <div class="col-6">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="prenom"
            class="form-control"
            id="floatingInput"
            placeholder="First Name"
            value={prenom}
            onChange={(e) => {
              setprenom(e.target.value);
            }}
          ></input>
        </div>
      </div>
      <div class="col-6">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="nom"
            class="form-control"
            id="floatingInput"
            placeholder="Last Name"
            value={nom}
            onChange={(e) => {
              setnom(e.target.value);
            }}
          ></input>
        </div>
      </div>
      <div class="col-6">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="mail"
            class="form-control"
            id="floatingInput"
            placeholder="email"
            value={mail}
            onChange={(e) => {
              setmail(e.target.value);
            }}
          ></input>
        </div>
      </div>

      <div class="col-6 d-grid">
        <button onClick={deleteUser} class="btn btn-primary" type="submit">
          Delete
        </button>
      </div>
      <div class="col-6 d-grid">
        <button onClick={updateUser} class="btn btn-primary" type="submit">
          Update
        </button>
      </div>
    </div>
  );
};
export default ModifyUser;
