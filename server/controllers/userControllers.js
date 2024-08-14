const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class userController {
  createUser = (req, res) => {
    res.send("createUser");
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
                )
                res.status(200).json(token)
              }else{
                res.status(401).json("Credenciales incorrectas")
              }
            }
          });
        }
      }
    });
  };

  profile = (req, res) => {
    let token = req.headers.authorization.split(" ")[1]
    let {id} = jwt.decode(token)
    let sql = `SELECT * FROM user WHERE user_id = "${id}"`
    connection.query(sql,(err,result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result[0])
      }
    })
  };

  editUser = (req, res) => {
    res.send("editUser");
  };
}

module.exports = new userController();
