const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/emailValidator");
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
      description,
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
            description,
            req.body.last_log_date,
            req.file.filename,
          ];
          let sql = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password, description, last_log_date, user_img)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
                  res.status(500).json(errPrac);
                } else {
                  const token = jwt.sign(
                    { id: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "14d" }
                  );
                  sendMail(email,user_name,token)
                  res.status(201).json(resPrac2);
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
            description,
            req.body.last_log_date,
          ];
          let sql2 = `INSERT INTO user (user_name, last_name,birth_date, gender, user_city, email, password,description, last_log_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
                  const token = jwt.sign(
                    { id: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "14d" }
                  );
                  sendMail(email,user_name,token)
                  res.status(201).json(resPrac2);
                }
              });
            }
          });
        }
      }
    });
  };

  validationUser = (req,res) =>{
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      console.log("*********", decoded);
      let sql = `UPDATE user SET is_validated = 1 WHERE email = "${decoded.id}"`
      connection.query(sql,(err,dbres)=>{
        if(err){
          console.log("rompe aqui",decoded.id)
          res.status(500).json(err)
        }else{
          res.status(200).json({ message: "Token validado", data: decoded });
        }
      })
    } catch (err) {
      console.error("Error al verificar el token:", err.message);
      res.status(400).json({ message: "Token inválido" });
    }
  }

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

  getPracticeSports = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.decode(token);
    let sql = `SELECT sport.sport_name, sport.sport_id FROM sport JOIN practice ON sport.sport_id = practice.sport_id WHERE practice.user_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  editUser = (req, res) => {
    console.log("editUser", req.body);
    const { user_id, user_name, last_name, birth_date, gender, user_city, description, sports } =
      req.body;

    let data = [
      user_name,
      last_name,
      birth_date,
      gender,
      user_city,
      description,
    ];

    let sqlEditUser = `UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, user_city = ?, description = ? WHERE user_id = ${user_id}`;

    connection.query(sqlEditUser, data, (errEditUser, resultEditUser)=>{
      if(errEditUser){
        res.status(500).json(errEditUser);
      }else{
        let sqlDBSports = "SELECT sport_id FROM practice WHERE user_id = ?";
        connection.query(sqlDBSports, [user_id], (err, results) => {
          if (err) {
            res.status(500).json(errDel);
          } else {
            const currentSportIds = results.map((e) => e.sport_id);
            console.log("req.body-----------------",req.body)
            console.log("sports-----------------",sports)
            // Paso 2: Eliminar deportes desmarcados
            const toRemove = currentSportIds.filter(
              (id) => !sports.includes(id)
            );
            if (toRemove.length > 0) {
              let sqlDelSports =
                "DELETE FROM practice WHERE user_id = ? AND sport_id IN (?)";
              connection.query(
                sqlDelSports,
                [user_id, toRemove],
                (errDel, resultDel) => {
                  if (err) {
                    res.status(500).json(errDel);
                  } else {
                    // Paso 3: Añadir nuevos deportes
                    const toAdd = sports.filter(
                      (id) => !currentSportIds.includes(id)
                    );
                    if (toAdd.length > 0) {
                      const values = toAdd.map((id) => [user_id, id]);
                      let sqlAddSports =
                        "INSERT INTO practice (user_id, sport_id) VALUES ?";
                      connection.query(sqlAddSports, [values], (errAdd, resAdd) => {
                        if (err) {
                          res.status(500).json(errAdd);
                        } else {
                          res.status(201).json(resAdd);
                        }
                      });
                    } else {
                      connection.end();
                    }
                  }
                }
              );
            } else {
              // Solo añadir si no hay deportes a eliminar
              const toAdd = sports.filter(
                (id) => !currentSportIds.includes(id)
              );
              if (toAdd.length > 0) {
                const values = toAdd.map((id) => [user_id, id]);
                let sqlAddSports2 =
                  "INSERT INTO practice (user_id, sport_id) VALUES ?";
                connection.query(sqlAddSports2, [values], (errAdd2, resAdd2) => {
                  if (errAdd2) {
                    res.status(500).json(errAdd2);
                  } else {
                    res.status(201).json(resAdd2);
                  }
                });
              } else {
                res.status(201).json(resultEditUser);
              }
            }
          }
        });
      }
    })
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
        console.log("****************",error);
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
  
    // Modificación de la consulta SQL para hacer un JOIN con la tabla 'sport'
    let sql = `
      SELECT 
        activity.*, 
        sport.sport_name, 
        sport.sport_img 
      FROM 
        activity 
      JOIN 
        sport 
      ON 
        activity.sport_id = sport.sport_id 
      WHERE 
        activity.user_id = ${id}
    `;
  
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

  recoverPassword = (req, res) => {
    const { email } = req.body;
    let sql = `SELECT id FROM user WHERE email = "${email}"`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(401).json("Email incorrecto");
      } else {
        if (!result || result.length === 0) {
          res.status(401).json("Email incorrecto");
        } else {
          const recoverToken = jwt.sign(
            { id: result },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          const link = `http://localhost:4000/api/users/recoverPassword/${result}/${recoverToken}`
          console.log(link);
          
          res.status(200).json(recoverToken);
        }
      }
    });
  };

  editPassword = (req, res) => {
    const {password} = req.body
    const {token} = req.params
  }

}

module.exports = new userController();
