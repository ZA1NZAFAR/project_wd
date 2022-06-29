
// *** USERS CRÉES *** : root@gmail.com & Projectwd2022
// ADMIN : 
const db = require("./db");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const require_Auth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("nothing");
  let message;
  if (token) {
    message = "just before";
    console.log(message);
    jwt.verify(
      token,
      "sljkfkectirerupâzaklndncwckvmàyutgri",
      (err, decoded) => {
        if (err) {
          message = "prbl1";
          console.log(err.message);
          res.redirect("/LoginUser");
        } else {
          console.log(decoded);
          message = "okaaaay";
          console.log(message);
          next();
        }
      }
    );
  } else {
    message = "prbl2";
    console.log(message);
    res.redirect("/LoginUser");
  }
};

const remove = async (id) => {
  const result = await db.query(
    `DELETE FROM Customer WHERE IdCustomer ="${id}"`
  );

  let message = "Error while deleting a User";

  if (result.affectedRows) {
    message = "User has been removed successfully";
  }

  return { message };
};

//permet de update les valeurs du current user : PROBLEME
const modify = async (id, prenom, nom, mail) => {
  const result = await db.query(
    `UPDATE Customer SET FirstName="${prenom}", LastName="${nom}", Email=${mail} WHERE idCustomer="${id}"`
  );

  let message = "Error while updating a user";

  if (result.affectedRows) {
    message = "User has been updated successfully";
  }

  return { message };
};

//permet de renvoyer les infos générales sur le current user (no use) :
const editUser = async (nom, prenom, id) => {
  console.log("dans le auth " + nom);
  console.log("dans le auth " + prenom);
  const rows = await db.query(
    `UPDATE Customer SET FirstName = "${prenom}" LastName = "${nom}" WHERE idCustomer= "${id}"`
  );
  console.log(rows);
  (err, rows) => {
    // une fois la requête réalisée, on libère la connexion :
    // When done with the connection, release it
    if (!err) {
      console.log("The data from the management table : \n", rows);
    } else {
      console.log(err);
    }

    return rows[0].prenom;
  };
};

//permet de renvoyer les infos générales sur le current user (no use) :
const getId = async (id) => {
  const rows = await db.query(`SELECT * FROM Customer WHERE id= "${id}"`);
  console.log(rows);
  (err, rows) => {
    // une fois la requête réalisée, on libère la connexion :
    // When done with the connection, release it
    if (!err) {
      console.log("The data from the management table : \n", rows);
    } else {
      console.log(err);
    }

    return rows[0].prenom;
  };
};

const getAdmin = async (Id_Admin, password) => {
  const rows = await db.query(
    `SELECT IdAdmin, Password FROM Admin WHERE IdAdmin="${Id_Admin}" AND Password="${password}"`
  );

  let message;

  if (rows[0]) {
    message = "Admin has been logged successfully";
  } else {
    message = "Access denied";
  }

  return {
    message,
  };
};

const getUser = async (email, password) => {
  const rows = await db.query(`SELECT * FROM Customer WHERE Email="${email}"`);
  console.log("email value dans auth: "+email);
  console.log("password value dans auth: "+password);

  let message;

  if (!rows.length || !(await bcrypt.compare(password, rows[0].Password))) {
    message = "Email/password incorrect";

    return {
      message,
    };
  } else {
    /*const user = JSON.parse(JSON.stringify(email));
    const token = jwt.sign({ username: user }, "secret", { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      //maxAge: maxAge * 1000,
    });
    console.log(token);*/

    message = "User has been logged in";
    return {
      user_id: rows[0].IdCustomer,
      user_first_name: rows[0].FirstName,
      user_last_name: rows[0].LastName,
      user_mail: rows[0].Email,
      message,
    };
  }
};

const createUser = async (email, password_ok, last_name, first_name) => {
  const rows = await db.query(`SELECT * FROM Customer WHERE Email="${email}"`);
  console.log("email: " + email);
  console.log("lastname: " + last_name);
  console.log("firstname: " + first_name);

  let message;

  if (rows[0]) {
    message = "Email has already been registered";

    return {
      message,
    };
  } else {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (email.match(regexEmail) && password_ok.match(regexpassword)) {
      const password = await bcrypt.hash(password_ok, 10);
      const result = await db.query(
        `INSERT INTO Customer SET Email="${email}", Password="${password}", LastName="${last_name}", FirstName="${first_name}"`
      );

      if (result.affectedRows) {
        message = "Registered successfully";
      }
    } else if (!password_ok.match(regexpassword) && !email.match(regexEmail)) {
      message =
        "Please enter a valid email \nAnd a valid password : Minimum six characters, at least one uppercase letter, one lowercase letter and one number:";
    } else if (!email.match(regexEmail)) {
      message = "Please enter a valid email";
    } else if (!password_ok.match(regexpassword)) {
      message =
        "Please enter a valid password : Minimum six characters, at least one uppercase letter, one lowercase letter and one number:";
    }
    return {
      message,
    };
  }
};

const verifyUser = async (cookies) => {
  const decoded = jwt.verify(
    cookies.jwt,
    "sljkfkectirerupâzaklndncwckvmàyutgri"
  );

  const rows = await db.query(
    `SELECT * FROM Customer WHERE idCustomer="${decoded.id}"`
  );

  if (rows[0]) return rows[0];
};

/* PROBLEME ==== 
const getToken = async (token) => {
  console.log(token);
  console.log("running");
  if (token) {jwt.verify(token,"sljkfkectirerupâzaklndncwckvmàyutgri",(err, decoded) => {
        if (err) {
          console.log("err");
          console.log(err.message);
          res.send({ message: "erreur" });
        } else {
          console.log("ok : " + token);
          res.send({ message: "yes connected"});
        }
      }
    );
  } else {
    console.log("noooooooo");
    res.send({ message: "no connected" });
  }
}

// 
=====*/

//update/edit profile :

const getPassword = async (user) => {
  const rows = await db.query(
    `SELECT Email, Password from Customer WHERE Email="${user.email}"`
  );

  let message;

  if (rows[0]) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: rows[0].Email,
      subject: "Password recovery from Watchside",
      html:
        "<p><b>Your login details for RSMS</b><br><b>Email: </b>" +
        rows[0].Email +
        "<br><b>For the password, we have the encrypted version of it which is : </b>" +
        rows[0].Password +
        "<br><br>To make sure that you are the owner of this reset request, please contact our help center (<b>715-660-8405</b>) which will ask you to confirm your request certain characters present in this password </p>" +
        "<br><b><i>All member of our Help center team is looking for your call, </i></b></p>" +
        '<br><br><a href="http://localhost:3006/">Click here to be redirected to our website</a></p>',
    };

    // Gmail account used for sending out emails in case user has forgotten their password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "not.reply.db.project@gmail.com",
        pass: "lvfsdezeaooroikr",
      },
    });

    const wrapedSendMail = async (mailOptions) => {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          message =
            "Your email and password have been sent successfully to your email";

          if (error) {
            console.log(error);
            resolve(false);
          } else {
            console.log("Email sent: " + info.response);
            resolve(true);
          }
        });
      });
    };

    await wrapedSendMail(mailOptions);

    return {
      message,
    };
  } else {
    message =
      "A user with this email doesn't exist, please retry with the correct one";

    return {
      message,
    };
  }
};

module.exports = {
  getAdmin,
  getUser,
  createUser,
  verifyUser,
  getPassword,
  require_Auth,
  getId,
  editUser,
  remove,
  modify,
};
