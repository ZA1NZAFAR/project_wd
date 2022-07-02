// *** USERS CRÉES *** :
/*
email : root@gmail.com & mdp: Projectwd2022
email : nasolel469@lankew.com & mdp : 123
*/
// ADMIN CRÉE :
/*
email : super_admin@gmail.com & mdp: $2a$10$A6/Z3lHzS4.w62/jT.ojHewAYU19e.FcgR6dlngTX13xjIVByxSYK
*/

const db = require("./db");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Use to implement authentication protected route :
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

//delete current user :
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

//update current user info : PROBLEME
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

// Use to update/edit profile of the current user (1):
const editUser = async (nom, prenom, id) => {
  console.log("dans le auth " + nom);
  console.log("dans le auth " + prenom);
  const rows = await db.query(
    `UPDATE Customer SET FirstName = "${prenom}" LastName = "${nom}" WHERE idCustomer= "${id}"`
  );
  console.log(rows);
  (err, rows) => {
    if (!err) {
      console.log("The data from the management table : \n", rows);
    } else {
      console.log(err);
    }

    return rows[0].prenom;
  };
};

// Use to update/edit profile of the current user (2):
const getId = async (Email) => {
  const rows = await db.query(`SELECT * FROM Customer WHERE Email= "${Email}"`);
  const user_id = rows[0].IdCustomer;
  console.log(user_id);
  (err, rows) => {
    if (!err) {
      console.log("The data from the management table : \n", rows);
    } else {
      console.log(err);
    }

    return rows[0].IdCustomer;
  };
};

//Check Admin account :
const getAdmin = async (email_Admin, password) => {
  const rows = await db.query(
    `SELECT IdAdmin, Password FROM Admin WHERE Email="${email_Admin}" AND Password="${password}"`
  );
  console.log("id de l'admin:" + email_Admin);
  console.log("mdp de l'admin:" + password);

  console.log(rows);
  const element1 = rows[0].IdAdmin;
  const element2 = rows[0].Password;
  console.log("element1: " + element1);
  console.log("element2: " + element2);

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

//Check user account :
const getUser = async (email, password) => {
  const rows = await db.query(`SELECT * FROM Customer WHERE Email="${email}"`);
  console.log("email value dans auth: " + email);
  console.log("password value dans auth: " + password);

  let message;

  if (!rows.length || !(await bcrypt.compare(password, rows[0].Password))) {
    message = "Email/password incorrect";

    return {
      message,
    };
  } else {
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

//To create a new User with regex checking :
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

//reset password :
const getLink = async (user) => {
  const rows = await db.query(
    `SELECT * from Customer WHERE Email="${user.email}"`
  );
  let message;
  const user_id = rows[0].IdCustomer;
  const user_mail = rows[0].Email;
  const user_password = rows[0].Password;
  console.log("***user_mail vaut : " + user_mail);
  console.log("***user_password vaut : " + user_password);
  console.log("***user_id vaut : " + user_id);

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
  message = "the link is: " + link;
  return message;

  // send the link to reset the password
  //return res.send ({message: "the link to reset password : " + link});
  //console.log("les infos du user :" + element.IdCustomer);
};

const getPassword = async (user) => {
  const rows = await db.query(
    `SELECT * from Customer WHERE Email="${user.email}"`
  );
  let message;
  const user_id = rows[0].IdCustomer;
  const user_mail = rows[0].Email;
  const user_password = rows[0].Password;
  console.log("***user_mail vaut : " + user_mail);
  console.log("***user_password vaut : " + user_password);
  console.log("***user_id vaut : " + user_id);

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
  message = "the link is: " + link;

  if (rows[0]) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: rows[0].Email,
      subject: "Password recovery from Watchside",
      html:
        "<p><b>Your login details for RSMS</b><br><b>Email: </b>" +
        user_mail +
        "<br><b>For the password, we have the encrypted version of it which is : </b>" +
        user_password +
        "<br><b>The link to reset the password is the following : </b>" +
        link +
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
  getLink,
};
