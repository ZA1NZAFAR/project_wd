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
const bcrypt = require("bcryptjs");
var methodOverride = require("method-override");
// Logging requestselement1 :
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

app.set("view engine", "ejs");

app.use(methodOverride("/authentication/updateUser/:id"));
//update utilisé now : PROBLEME
app.put("/authentication/updateUser/:id", async (request, response, next) => {
  console.log("dans index update !");
  const nom = request.body.nom;
  const prenom = request.body.prenom;
  const email = request.body.mail;
  const id = request.params.id;

  console.log("nom modifié: " + nom);
  console.log("prenom modifié: " + prenom);
  console.log("mail modifié: " + email);

  const rows = await db.query(
    `SELECT * FROM Customer WHERE IdCustomer = "${id}"`
  );
  var user_id = rows[0].IdCustomer;
  var user_mail = rows[0].Email;
  var user_last_name = rows[0].LastName;
  var user_first_name = rows[0].FirstName;
  console.log("id avant update: " + user_id);
  console.log("email avant update: " + user_mail);
  console.log("lastname avant update: " + user_last_name);
  console.log("firstname avant update: " + user_first_name);

  try {
    const result = await db.query(
      `UPDATE Customer SET FirstName="${prenom}", LastName="${nom}", Email=${email} WHERE idCustomer="${id}"`
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
        expiresIn: "240m",
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
          expiresIn: "240m",
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
  const current_user = {
    email: user.email,
  };
  /*
  const rows = await db.query(
    `SELECT * FROM Customer WHERE Email= "${current_user.email}"`
  );
  const user_id = rows[0].IdCustomer;
  const user_mail = rows[0].Email;
  const user_password = rows[0].Password;
  console.log("***user_mail vaut : " + user_mail);
  console.log("***user_password vaut : " + user_password);
  console.log("***user_id vaut : " + user_id);
  console.log("***email:" + current_user.email);
*/
  if (!user.email) return res.send({ message: "Please enter your email" });
  else {
    try {
      res.json(await authentication.getPassword(user));
      //const element = await authentication.getLink(user);
      //console.log(element);
    } catch (err) {
      console.log(`Error while retreiving user password `, err.message);
      next(err);
    }
  }
  /*
  // Create a one-use link to reset the password :
  const jwt_secret = "sljkfkectirerupâzaklndncwckvmàyutgri" + user_password;

  const user_jwt = {
    mail: user_mail,
    id: user_id,
  };
  //var jsoninfo = JSON.parse(info);
  console.log("id vaut:" + user_id);
  //console.log("idCustomer: " + jsoninfo);
  //const element = authentication.getId(current_user.email);
  const token = jwt.sign(user_jwt, jwt_secret, { expiresIn: "15m" });
  const link = `http://localhost:5000/authentication/resetPassword/${user_id}/${token}`;
  console.log("lien: " + link);
  const message = "the link is: "+ link;
  
  // send the link to reset the password
  //return res.send ({message: "the link to reset password : " + link});
  //console.log("les infos du user :" + element.IdCustomer);
*/
});

/*
app.post("/authentication/getLink", async (req, res, next) => {
  const user = req.body;
  const current_user = {
    email: user.email,
  };
  /*
  const rows = await db.query(
    `SELECT * FROM Customer WHERE Email= "${current_user.email}"`
  );
  const user_id = rows[0].IdCustomer;
  const user_mail = rows[0].Email;
  const user_password = rows[0].Password;
  console.log("***user_mail vaut : " + user_mail);
  console.log("***user_password vaut : " + user_password);
  console.log("***user_id vaut : " + user_id);
  console.log("***email:" + current_user.email);

  if (!user.email) return res.send({ message: "Please enter your email" });
  else {
    try {
      res.json(await authentication.getLink(user));
    } catch (err) {
      console.log(`Error while retreiving user password `, err.message);
      next(err);
    }
  }
});
*/

//When the customer click on the link, the following redirect to the reset password page  :
app.get("/authentication/resetPassword/:id/:token", async (req, res, next) => {
  const user = req.body;
  console.log(user);
  const { id, token } = req.params;
  //typeof(id) = string => need to parse it to be able after to compare it with the user_id :
  const id_int = parseInt(id);
  console.log("id vaut : " + id_int);
  console.log("son type: " + typeof id_int);

  console.log("token : " + token);
  const rows = await db.query(
    `SELECT * FROM Customer WHERE IdCustomer = "${id}"`
  );
  const user_mail = rows[0].Email;
  const user_password = rows[0].Password;
  const user_id = rows[0].IdCustomer;
  console.log("user_mail vaut : " + user_mail);
  console.log("user_password vaut : " + user_password);
  console.log("user_id vaut : " + user_id);
  console.log("son type: " + typeof user_id);
  // Create a one-use link to reset the password :
  const jwt_secret = "sljkfkectirerupâzaklndncwckvmàyutgri" + user_password;
  /*
  const current_user = {
    email: user.email,
  };
  
  console.log("***email:" + current_user.email);
  const rows = await db.query(
    `SELECT * FROM Customer WHERE Email= "${current_user.email}"`
  );
  const user_id = rows[0].IdCustomer;
  //const user_id = rows[0].IdCustomer;
  //var jsoninfo = JSON.parse(info);
  console.log("info vaut:" + user_id);

  const { id, token } = req.params;
  console.log("id vaut : " + id);
  //console.log("user_id vaut : " + user_id);
*/
  /*
  console.log("resetpassword ici");
  //Check if the user id is present or not :
  //user id is not present :
  if (id != user_id) {
    res.send("Error this id doesn't exist");
    return;
  }*/
  //if the user id is present :

  if (id_int !== user_id) {
    res.send("Error this id doesn't exist");
    return;
  }

  try {
    const payload = jwt.verify(token, jwt_secret);
    console.log("payload vaut:");
    console.log(payload);
    res.render("resetPassword", { email: user_mail });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
  //res.send(req.params);
});

//??? :
app.post("/authentication/resetPassword/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  const id_int = parseInt(id);
  console.log("id vaut : " + id_int);
  console.log("son type: " + typeof id_int);
  const { password, password2 } = req.body;
  console.log("id vaut : " + id);
  console.log("token : " + token);
  const rows = await db.query(
    `SELECT * FROM Customer WHERE IdCustomer = "${id}"`
  );
  var user_id = rows[0].IdCustomer;
  var user_mail = rows[0].Email;
  var user_password = rows[0].Password;

  console.log("dans le dernier id : " + user_id);
  console.log("dans le dernier email : " + user_mail);
  console.log("dans le dernier password : " + user_password);
  //Check the user id :
  if (id_int !== user_id) {
    res.send("Id user incorrect...");
    return;
  }

  const jwt_secret = "sljkfkectirerupâzaklndncwckvmàyutgri" + user_password;
  try {
    const payload = jwt.verify(token, jwt_secret);
    //Crypt that password from resetPassword.ejs then update the value of the current user :
    var password_crypted = await bcrypt.hash(password, 10);
    user_password = password_crypted;
    console.log("le mdp modifié: " + user_password);
    const result = await db.query(
      `UPDATE Customer SET Password="${user_password}" WHERE idCustomer="${id}"`
    );
    const rows_f = await db.query(
      `SELECT * FROM Customer WHERE IdCustomer = "${id}"`
    );
    /*
    var user_id = rows_f[0].IdCustomer;
    var user_mail = rows_f[0].Email;
    var user_password = rows_f[0].Password;
    var user_first_name = rows_f[0].FirstName;
    var user_last_name = rows_f[0].LastName;
    console.log("dans le dernier id : " + user_id);
    console.log("dans le dernier email : " + user_mail);
    console.log("dans le dernier password : " + user_password);
    */
    res.send(rows_f);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
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
