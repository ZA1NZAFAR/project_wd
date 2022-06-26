import { Navigate, Outlet, Router } from "react-router-dom";
import react, { useEffect, useState, useRef } from "react";

const Axios = require("axios");
Axios.defaults.withCredentials = true;

/*const useAuth = () => {
  var logged = false;
  let result;
  const request = Axios.get("http://localhost:5000/authentication/logOK");*/
/* .then((response) => {
        console.log(response.data.message);
      result = response.data.message;
      console.log("Rquest : " + result);
      if (result === "yes connected") {
        console.log("oooooooo");
        logged = true;
        console.log("celui de yes");
        console.log(logged);
        return logged;
      } else {
        //console.log(Promise);
        console.log("oooooooopp");
        logged = false;
        console.log("celui de no");
        console.log(logged);
        return logged;
      }
    });
  console.log("celui de fin");
  console.log(logged);*/
/* return request.then(response => response.data.message);
};*/
/*Promise.then((response) => {
    console.log(response.data.message);
    if (response.data.message === "yes connected") {
      console.log("oooooooo");
      logged = true;
      console.log("celui de yes");
      console.log(logged);
      return logged;
    } else {
      console.log(response.data.message);
      console.log("oooooooopp");
      logged = false;
      console.log("celui de no");
      console.log(logged);
      return logged;
    }
  });
  console.log("celui de fin");
  console.log(logged);
  return logged;
};*/

var result = "texte";
var resultat = false;
export default function Reserved() {
  const [loggedIn, setloggedIn] = useState("");
  const getAnswer = async () => {
    try {
      const request = await Axios.get(
        "http://localhost:5000/authentication/logOK"
      ).then((response) => {
        console.log(response.data.message);
        result = response.data.message;
        console.log("Rquest : " + result);
        resultat = false;
        if (result === "yes connected") {
          console.log("oooooooo");
          setloggedIn(true);
          console.log("celui de yes");
          console.log(loggedIn);
          return loggedIn;
        } else {
          console.log("oooooooopp");
          console.log("celui de no");
          resultat = false;
          setloggedIn(false);
          console.log(loggedIn);
          return loggedIn;
        }
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
    <>
      {loggedIn === true && <Outlet />}
      {loggedIn === false && <Navigate to="/LoginUser" />}
    </>
  );
}
/*Promise.then((response) => {
          console.log(response.data.message);
          if (response.data.message === "yes connected") {
            console.log("oooooooo");
            logged = true;
            console.log("celui de yes");
            console.log(logged);
            return logged;
          } else {
            console.log(response.data.message);
            console.log("oooooooopp");
            logged = false;
            console.log("celui de no");
            console.log(logged);
            return logged;
          }
        });
        console.log("celui de fin");
        console.log(logged);
        return logged;
      };*/

/*const auth = useAuth();
  console.log(auth);*/
/* auth.then(result => {
      console.log("Result: " + result);
    if (result) 
    return <Outlet />;
  .catch(error => console.log(error));*/
