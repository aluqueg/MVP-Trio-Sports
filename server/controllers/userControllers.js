const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class userController {
  createUser = (req, res) => {
    console.log(req.file, "***** file");
    let user = JSON.parse(req.body.userRegister);
    let sports = req.body.sports.split(",").map(Number);
    const {
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      email,
      password,
      sport_id,
    } = user;
    console.log("user", user);
    let saltRounds = 8;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("error create user 1");
      } else {
        let userId = null;
        if (req.file) {
          let data = [
            user_name,
            last_name,
            birth_date,
            gender,
            user_city,
            email,
            hash,
            req.body.last_log_date,
            req.file.filename,
          ];
          let sql = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, last_log_date, user_img)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          connection.query(sql, data, (errIns, result) => {
            if (errIns) {
              res.status(500).json(errIns);
            } else {
              userId = result.insertId;
              let values = sports.map((sportId) => [sportId, userId]);
              let practiceSql =
                "INSERT INTO practice (sport_id, user_id) VALUES ?";
              connection.query(practiceSql, [values], (errPrac, resPrac) => {
                if (errPrac) {
                  console.log("fdsafdsasdsa2");
                  res.status(500).json(errPrac);
                } else {
                  res.status(201).json(resPrac);
                }
              });
            }
          });
        } else {
          let data2 = [
            user_name,
            last_name,
            birth_date,
            gender,
            user_city,
            email,
            hash,
            req.body.last_log_date,
          ];
          let sql2 = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, last_log_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          connection.query(sql2, data2, (errIns2, result2) => {
            if (errIns2) {
              res.status(500).json(errIns2);
            } else {
              userId = result2.insertId;
              let values = sports.map((sportId) => [sportId, userId]);
              let practiceSql =
                "INSERT INTO practice (sport_id, user_id) VALUES ?";
              connection.query(practiceSql, [values], (errPrac2, resPrac2) => {
                if (errPrac2) {
                  res.status(500).json(errPrac2);
                } else {
                  res.status(201).json(resPrac2);
                }
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

  //revisar
  getAllUsers = (req, res) => {
    // let token = req.headers.authorization.split(" ")[1]    
    let sql = `SELECT user.*, GROUP_CONCAT(sport.sport_name ORDER BY sport.sport_name SEPARATOR ', ') AS sports, TIMESTAMPDIFF(YEAR, user.birth_date, CURDATE()) AS age FROM user JOIN practice ON user.user_id = practice.user_id JOIN sport ON practice.sport_id = sport.sport_id WHERE is_validated = 1 AND user.is_disabled = 0 AND	user.type = 2 GROUP BY user.user_name ORDER BY user.user_name;`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(500).json(error);
        console.log(error);
      } else {
        res.status(200).json(result);
        console.log(result);
      }
    });
  };

  allMessages = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT user.user_id,user.user_name,user.last_name,user.user_img,MAX(message.date_time) AS last_message_date FROM message JOIN user ON message.sender_user_id = user.user_id WHERE message.receiver_user_id = ${id} GROUP BY user.user_id, user.user_name, user.last_name, user.user_img ORDER BY last_message_date DESC`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
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
  };

  viewOneChat = (req, res) => {
    const { user_sender_id: sender, user_receiver_id: receiver } = req.body;

    // Definir la consulta SQL usando parámetros
    const sql = `
      (
    SELECT 
        message.message_id,
        message.text,
        message.date_time,
        message.opened,
        sender.user_id AS sender_user_id,
        sender.user_name AS sender_user_name,
        sender.last_name AS sender_user_last_name,
        sender.user_img AS sender_user_img,
        sender.last_log_date AS sender_user_last_log_date,
        sender.type AS sender_user_type,
        'sent' AS message_type
    FROM 
        message
    JOIN 
        user sender ON message.sender_user_id = sender.user_id
    WHERE 
        message.sender_user_id = ${receiver} AND message.receiver_user_id = ${sender}
      )
    UNION ALL
      (
    SELECT 
        message.message_id,
        message.text,
        message.date_time,
        message.opened,
        sender.user_id AS sender_user_id,
        sender.user_name AS sender_user_name,
        sender.last_name AS sender_user_last_name,
        sender.user_img AS sender_user_img,
        sender.last_log_date AS sender_user_last_log_date,
        sender.type AS sender_user_type,
        'received' AS message_type
    FROM 
        message
    JOIN 
        user sender ON message.sender_user_id = sender.user_id
    WHERE 
        message.sender_user_id = ${sender} AND message.receiver_user_id = ${receiver}
      )
    ORDER BY 
    date_time;
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json({
          error: "Ocurrió un error en la consulta SQL.",
          details: err.message,
        });
      }
      res.status(200).json(result);
    });
  };
  sendMessage = (req, res) => {
    const { message, date, receiver, userID } = req.body;
    let sql = `INSERT INTO message (text,date_time,sender_user_id,receiver_user_id) VALUES (?,?,?,?)`;
    let data = [message, date, userID, receiver];
    connection.query(sql, data, (err, result) => {
      if (err) {
        res.status(500).json({
          error: "Ocurrió un error en la consulta SQL.",
          details: err.message,
        });
      } else {
        res.status(200).json(result);
      }
    });
  };

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
  };
}

module.exports = new userController();
