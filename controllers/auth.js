let mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const ticket = require("./ticket");
const { Session } = require("express-session");

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = function (req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM registration WHERE email=?",
    [email],
    async function (error, results) {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "password do not match",
        });
      }

      let hashedpassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO registration SET ?",
        { name: name, email: email, password: hashedpassword },
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            res.render("register", {
              message: "User Register",
            });
          }
        }
      );
    }
  );
};

exports.login = function (req, res) {
  const { email, password } = req.body;
  db.query(
    "SELECT name,email,password FROM registration WHERE email=?",
    [email],
    function (errors, results) {
      if (errors) {
        console.log(error);
      }
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            return res.render("login", {
              message: "Auth Failed",
            });
          } else {
            ticket.get_ticket_redirect(function (ticket) {
              console.log(ticket);
              req.session.ticket = ticket;
              req.session.loggedinUser = true;
              req.session.emailAddress = email;
              req.session.name = results[0].name;
              res.render("main", {name: req.session.name});
            });
          }
        });
      }
    }
  );
};

exports.adduser = function (req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM registration WHERE email=?",
    [email],
    async function (error, results) {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("adduser", {
          message: "email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("adduser", {
          message: "password do not match",
        });
      }

      let hashedpassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO registration SET ?",
        { name: name, email: email, password: hashedpassword },
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            res.render("adduser", {
              message: "User Register",
            });
          }
        }
      );
    }
  );
};

exports.listuser = function (req, res) {
  db.query("SELECT MAX(id) AS max from registration", function (error, result) {
    if (error) {
      console.log(error);
    } else {
      var string = JSON.stringify(result);
      var json = JSON.parse(string);
      let array = [];
      for (let i = 0; i <= json[0].max; i++) {
        db.query(
          "SELECT id,name,email FROM registration WHERE ?=id",
          [i],
          async function (error, result) {
            if (error) {
              console.log(error);
            } else {
              var string = await JSON.stringify(result);
              var json = JSON.parse(string);
              if (json[0]) {
                console.log(json[0].id);
                array.push(json[0]);
              }
            }
          }
        );
      }

      setTimeout(()=>{
        console.log(array);
        res.render("listuser", {
          user: array,
        });
      },2000)
    }
  });
};

exports.ticket = function (req, res) {
  ticket.get_ticket_redirect(function (ticket) {
    res.render("mashup", {
      ticket: ticket,
    });
  });
};
