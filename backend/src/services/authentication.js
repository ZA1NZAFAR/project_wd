const db = require("./db");
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

const getAdmin = async (Id_Admin, password) => {
  const rows = await db.query(
    `SELECT Id_Admin, password FROM Admin WHERE Id_admin="${Id_Admin}" AND password="${password}"`
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
  const rows = await db.query(`SELECT * FROM Users WHERE email="${email}"`);

  let message;

  if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
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
      userID: rows[0].email,
      message,
    };
  }
};

const createUser = async (email, password_ok) => {
  const rows = await db.query(`SELECT * FROM Users WHERE email="${email}"`);

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
        `INSERT INTO Users SET email="${email}", password="${password}"`
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

  const rows = await db.query(`SELECT * FROM Users WHERE id="${decoded.id}"`);

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

=====*/

//update/edit profile :

const getPassword = async (user) => {
  const rows = await db.query(
    `SELECT email, password from Users WHERE email="${user.email}"`
  );

  let message;

  if (rows[0]) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: rows[0].email,
      subject: "Password recovery from Real Estate Managment System",
      html:
        "<p><b>Your login details for RSMS</b><br><b>Email: </b>" +
        resultat[0].email +
        "<br><b>For the password, we have the encrypted version of it which is : </b>" +
        resultat[0].password +
        "<br><br>To make sure that you are the owner of this reset request, please contact our help center (<b>715-660-8405</b>) which will ask you to confirm your request certain characters present in this password </p>" +
        "<br><b><i>All member of our Help center team is looking for your call, </i></b></p>" +
        '<br><br><a href="http://localhost:3006/">Click here to be redirected to our website</a></p>',
    };

    // Gmail account used for sending out emails in case user has forgotten their password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASSWORD,
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
};
