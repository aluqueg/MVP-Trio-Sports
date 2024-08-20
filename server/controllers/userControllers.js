const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class userController {
  createUser = (req, res) => {
    console.log(req.file,"***** file")
    let user = JSON.parse(req.body.userRegister);
    const {
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      email,
      password,
      sports,
    } = user;
    console.log("user", user);
    let saltRounds = 8;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("error create user 1");
      } else {
        let userId = null;
        if (req.file) {
          let data = [user_name,last_name,birth_date,gender,user_city,email,hash,req.body.last_log_date,req.file.filename]
          let sql = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, last_log_date, user_img)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          
          connection.query(sql,data, (errIns, result) => {
            if (errIns) {
              res.status(500).json(errIns);
            } else {
              res.status(201).json(result);
              userId = result.insertId;
              
                let sql1v2 = `INSERT INTO practice (sport_id, user_id) VALUES (?, ?)`
                connection.query(sql1v2, [sports], (errIns1v2, result1v2) => {
                  if (errIns1v2) {
                    res.status(500).json(errIns1v2);
                  } else {
                    res.status(201).json(result1v2);
                  }
                })

            }
          });
        }else{
          let data2 = [user_name,last_name,birth_date,gender,user_city,email,hash,req.body.last_log_date]
          let sql2 = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, last_log_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          connection.query(sql2,data2, (errIns2, result2) => {
            if (errIns2) {
              res.status(500).json(errIns2);
            } else {
              res.status(201).json(result2);
              userId = result2.insertId;
              
              sports.forEach(e => {
                let data2v2 = [e.sport_id, userId]
                let sql2v2 = `INSERT INTO practice (sport_id, user_id) VALUES (?, ?)`
                connection.query(sql2v2, data2v2, (errIns2v2, result2v2) => {
                  if (errIns2v2) {
                    res.status(500).json(errIns2v2);
                  } else {
                    res.status(201).json(result2v2);
                  }
                })
              });
            }
          });
        }
      }
    });
  };

  login = (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email="${email}" AND is_validated = 1 AND is_disabled = 0`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(401).json("Credenciales incorrectas");
      } else {
        if (!result || result.length === 0) {
          res.status(401).json("Credenciales incorrectas");
        } else {
          const hash = result[0].password;
          bcrypt.compare(password, hash, (err2, response) => {
            if (err2) {
              res.status(500).json(err2);
            } else {
              if (response) {
                const token = jwt.sign(
                  { id: result[0].user_id },
                  process.env.SECRET_KEY,
                  { expiresIn: "14d" }
                );
                res.status(200).json(token);
              } else {
                res.status(401).json("Credenciales incorrectas");
              }
            }
          });
        }
      }
    });
  };

  profile = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT * FROM user WHERE user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result[0]);
      }
    });
  };

  editUser = (req, res) => {
    res.send("editUser");
  };

  emailValidation = (req, res) => {
    const { email } = req.body;
    let sql = `SELECT * FROM user WHERE email = "${email}"`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  prueba = (req, res) => {
    console.log(req.file);
  };

  getUserActivities = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT * FROM activity WHERE user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  }

  getUserParticipatedActivities = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT activity.* FROM activity JOIN participate
    ON activity.activity_id = participate.activity_id
    JOIN user ON participate.user_id = user.user_id
    where user.user_id = ${id} ORDER BY date_time_activity DESC`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  }
}

module.exports = new userController();
