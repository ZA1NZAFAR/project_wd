// Using dependencies
const db = require("./services/db");
const util = require("util");
const express = require("express");
const cors = require("cors"); // used to communicate with a backend from another URL
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config({ path: "../.env" });
const properties = require("./services/properties");
const authentication = require("./services/authentication");
const tours = require("./services/tours");
const transactions = require("./services/transactions");
const jwt = require("jsonwebtoken");
//const require_Auth = require("./services/require_Auth");
const env = require("../src/");
// Logging requests
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---------------------");
  next();
};
app.use(requestLogger);
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  console.error(error.message, error.stack);
  response.status(statusCode).json({ message: error.message });
  return;
});

app.delete(
  "/authentication/deleteUser/:id",
  async (request, response, next) => {
    try {
      console.log(request.params.id);

      response.json(await authentication.remove(request.params.id));
      console.log("fait");
    } catch (error) {
      console.error(`Error while removing a user `, error.message);
      next(error);
    }
  }
);

//update utilisé now : PROBLEME
app.put("/authentication/updateUser/:id", async (request, response, next) => {
  const { email, prenom, nom } = request.body;
  console.log("dans index !! ");
  console.log("id dans index: " + request.params.id);
  console.log("prenom dans index : " + prenom);
  try {
    response.json(
      await authentication.modify(
        request.params.id,
        request.body.prenom,
        request.body.nom,
        request.body.mail
      )
    );
  } catch (error) {
    console.error(`Error while modifying user `, error.message);
    next(error);
  }
});
///////

app.get("/authentication/editUser", async (req, res, next) => {
  const { Id_Admin, password } = req.body;
  const idUser = await authentication.getId(Id_Admin, password);
  return res.send({ message: idUser });
});

// permet de maj les infos du current user : EN COURS
app.post("/authentication/update", async (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  console.log("dans le index : " + nom);
  console.log("dans le index : " + prenom);
  const response = await authentication.editUser(nom, prenom, 1);
  console.log(response);
  const token = req.cookies.jwt;
  console.log(token);
  console.log("running validUser");
  if (token) {
    jwt.verify(
      token,
      "sljkfkectirerupâzaklndncwckvmàyutgri",
      (err, decoded) => {
        if (err) {
          console.log("err");
          console.log(err.message);
          res.send({ message: "erreur" });
        } else {
          console.log("dedans");
          //permet d'afficher l'object decoded
          let user = decoded;
          //user_final = util.inspect(user, false, null, true);
          console.log(user);
          const id = user.user_id;
        }
      }
    );
  }
});

// Display the name and allowed logout when a person has succesfully login : OK
app.get("/authentication/validUser", async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  console.log("running validUser");
  if (token) {
    jwt.verify(
      token,
      "sljkfkectirerupâzaklndncwckvmàyutgri",
      (err, decoded) => {
        if (err) {
          console.log("err");
          console.log(err.message);
          res.send({ message: "erreur" });
          res.locals.id = null;
        } else {
          console.log("dedans");
          //permet d'afficher l'object decoded
          let user = decoded;
          //user_final = util.inspect(user, false, null, true);
          console.log(user);
          const id = user.user_id;
          console.log("id : " + id);
          const element1 = user.user_first_name;
          console.log("element1 : " + element1);
          const element2 = user.user_last_name;
          console.log("element2 : " + element2);
          const element3 = user.user_mail;
          console.log("element3 : " + element3);
          res.send({ element1, element2, element3, id });
        }
      }
    );
  } else {
    console.log("noooooooo");
    res.send({ message: "no connected" });
    res.locals.userID = null;
    next();
  }
});

// POST admin credentials. Used to verify admin's access rights
app.post("/authentication/adminLogin", async (req, res, next) => {
  const { Id_Admin, password } = req.body;
  if (!Id_Admin || !password)
    return res.send({ message: "Please enter your id & password" });
  else {
    try {
      const response = await authentication.getAdmin(Id_Admin, password);
      const user = JSON.parse(JSON.stringify(response));
      const token = jwt.sign(user, "sljkfkectirerupâzaklndncwckvmàyutgri", {
        expiresIn: 6000,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        //maxAge: maxAge * 1000,
      });
      console.log(token);
      res.send(response);
    } catch (err) {
      console.log(`Error while checking admin credentials `, err.message);
      next(err);
    }
  }
});
// POST user credentials. Used to verify user's access rights
app.post("/authentication/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.send({ message: "Please enter your email & password" });
  else {
    try {
      console.log("email value dans index: " + email);
      console.log("password value dans index: " + password);

      const response = await authentication.getUser(email, password);
      console.log("apres response");
      if (response.message === "User has been logged in") {
        const user = JSON.parse(JSON.stringify(response));
        const token = jwt.sign(user, "sljkfkectirerupâzaklndncwckvmàyutgri", {
          expiresIn: 6000,
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          //maxAge: maxAge * 1000,
        });
        console.log(token);
      }

      /*const response = await authentication.getUser(email, password);
      //MODIF :
      const token = jwt.sign(response.userID, "secret");
      console.log(token);
      res.cookie("jwt", token, {
        httpOnly: true,
        //maxAge: maxAge * 1000,
      });
      //console.log(req.cookies.jwt);
      /*if (response.cookies)
        res.cookie(
          response.cookies.user,
          response.cookies.token,
          response.cookies.cookies
        );*/

      /*  res.json({
        userID: response.userID,
        message: response.message,
        cookies: response.cookies,
      });*/
      //res.status(201).json({ response: response.userID });
      //res.status(201).json({ user: response.userID });*/
      res.send(response);
    } catch (err) {
      console.log(`Error while checking user credentials `, err.message);
      res.status(400).json({ err });
      //return res.send({ message: "Please check your email & password : one of them is incorrect" });
    }
  }
});

/* TESTS :
app.get("/set-cookie", async (req, res) => {
  res.send("Cookie is foo=bar");
});

app.get("/get-cookie", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});
*/

// POST user credentials for signing up. Used to create new user accounts
app.post("/authentication/signup", async (req, res, next) => {
  const {
    email,
    password: password_ok,
    last_name: last_name,
    first_name: first_name,
  } = req.body;
  if (!email || !password_ok)
    return res.send({ message: "Please enter your email & password" });
  else {
    try {
      const response = await authentication.createUser(
        email,
        password_ok,
        last_name,
        first_name
      );
      if (response.message === "Registered successfully") {
        const user = JSON.parse(JSON.stringify(response));
        const token = jwt.sign(user, "sljkfkectirerupâzaklndncwckvmàyutgri", {
          expiresIn: 6000,
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          //maxAge: maxAge * 1000,
        });
        console.log(token);
      }
      res.send(response);
    } catch (err) {
      console.log(`Error while signing up user `, err.message);
      next(err);
    }
  }
});

// Using to implement protected routes
app.get("/authentication/logOK", (req, res) => {
  const token = req.cookies.jwt;
  console.log(token);
  console.log("running");
  if (token) {
    jwt.verify(
      token,
      "sljkfkectirerupâzaklndncwckvmàyutgri",
      (err, decoded) => {
        if (err) {
          console.log("err");
          console.log(err.message);
          res.send({ message: "erreur" });
        } else {
          console.log("ok : " + token);
          res.send({ message: "yes connected" });
        }
      }
    );
  } else {
    console.log("noooooooo");
    res.send({ message: "no connected" });
  }
});

// POST user credentials. Used in case if the user has forgotten their credentials
app.post("/authentication/forgotPassword", async (req, res, next) => {
  const user = req.body;
  if (!user.email) return res.send({ message: "Please enter your email" });
  else {
    try {
      res.json(await authentication.getPassword(user));
    } catch (err) {
      console.log(`Error while retreiving user password `, err.message);
      next(err);
    }
  }

  // Create a one-use link to reset the password :
  const jwt_secret = "sljkfkectirerupâzaklndncwckvmàyutgri" + user.password;
  const current_user = {
    email: user.email,
  };
  //const element = authentication.getId(current_user.email);
  const token = jwt.sign(current_user, jwt_secret, { expiresIn: "15m" });
  const link = `http://localhost:5000/authentication/resetPassword/${token}`;
  //console.log("les infos du user :" + element.IdCustomer);
});

//allow to access to reset password page :
app.get("/authentication/resetPassword/:token", (req, res, next) => {
  const { token } = req.params;
  console.log("ici");
  res.send(req.params);
});

// GET request to logout. Used to end user session and logout users from the website
app.get("/authentication/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.send({
      message: "Déconnexion avec succès. A une prochaiene fois !",
    });
  } catch (err) {
    return res.send({ message: "erreur" });
  }
});

// Entry page
app.get("/", (request, response) => {
  response.send("<h1>Real estate agency</h1>");
});

// GET total number of properties in db. Used to calculate number of pages
app.get("/api/properties/total", async (request, response, next) => {
  try {
    response.json(await properties.getAll());
  } catch (error) {
    console.log(
      `Error while getting total number of properties `,
      error.message
    );
    next(error);
  }
});

// GET real estate properties. Used to get the list of all properties
app.get(
  "/api/properties",
  authentication.require_Auth,
  async (request, response, next) => {
    try {
      response.json(await properties.getMultiple(request.query.page));
    } catch (error) {
      console.error(`Error while getting properties `, error.message);
      next(error);
    }
  }
);

// POST real estate property. Used to add new property to db
app.post("/api/properties", async (request, response, next) => {
  try {
    response.json(await properties.create(request.body));
  } catch (error) {
    console.error(`Error while creating property `, error.message);
    next(error);
  }
});

// PUT real estate property. Used to update informations of existing property in db
app.put("/api/properties/:id", async (request, response, next) => {
  try {
    response.json(await properties.update(request.params.id, request.body));
  } catch (error) {
    console.error(`Error while updating property `, error.message);
    next(error);
  }
});

// DELETE real estate property. Used to remove an existing property from the list (front) and from the db
app.delete("/api/properties/:id", async (request, response, next) => {
  try {
    response.json(await properties.remove(request.params.id));
  } catch (error) {
    console.error(`Error while deleting property `, error.message);
    next(error);
  }
});

// GET all house tours. Used to retrieve all bookings made by clients
app.get("/api/houseTours", async (request, response, next) => {
  try {
    response.json(await tours.getMultiple(request.query.page));
  } catch (error) {
    console.error(`Error while getting house tours `, error.message);
    next(error);
  }
});

// POST a house tour. Used to book house tours
app.post("/api/houseTours", async (request, response, next) => {
  try {
    response.json(await tours.create(request.body));
  } catch (error) {
    console.error(`Error while creating a house tour `, error.message);
    next(error);
  }
});

// GET all transactions. Used to retrieve all transactions (real estate properties bought by clients)
app.get("/api/transactions", async (request, response, next) => {
  try {
    response.json(await transactions.getMultiple(request.query.page));
  } catch (error) {
    console.error(`Error while getting transactions `, error.message);
    next(error);
  }
});

// POST a transaction. Used to keep record of the properties bought by respective clients
app.post("/api/transactions", async (request, response, next) => {
  try {
    response.json(await transactions.create(request.body));
  } catch (error) {
    console.error(`Error while creating a transaction `, error.message);
    next(error);
  }
});

// sends a json response if no associate route is found e.g: (/something/somewhere)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
