const connection = require("../config/db");

class adminController {
  getAllUsers = (req,res) =>{
    let sql = "SELECT user.user_id, user.user_name, user.last_name, user.user_city, user.is_validated, user.is_disabled, user.type, GROUP_CONCAT(sport.sport_name ORDER BY sport.sport_name SEPARATOR ', ') AS sports FROM user JOIN practice ON user.user_id = practice.user_id JOIN sport ON practice.sport_id = sport.sport_id GROUP BY user.user_id, user.user_name, user.last_name, user.user_city, user.is_validated, user.is_disabled, user.type"
    connection.query(sql,(err,result)=>{
      if(err){
        res.status(500).json(err);
      }else {
        res.status(200).json(result)
      }
    })
  }

  disableUser = (req,res)=>{
    const {user_id,status} = req.body
    console.log(req.body)
    let sql = `UPDATE user SET is_disabled = 1 WHERE user_id = "${user_id}"`

    connection.query(sql,(err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  enableUser = (req,res)=>{
    const {user_id} = req.body
    console.log(req.body)
    let sql = `UPDATE user SET is_disabled = 0 WHERE user_id = "${user_id}"`

    connection.query(sql,(err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  getAllSports = (req, res) => {
    let sql = `select * from sport`
    connection.query(sql, (err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  

  disableSport = (req, res) => {
    let { sport_id, status } = req.body;
    let sql = `UPDATE sport SET is_disabled = 1 WHERE sport_id = ${sport_id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  enableSport = (req, res) => {
    let { sport_id, status } = req.body;
    let sql = `UPDATE sport SET is_disabled = 0 WHERE sport_id = ${sport_id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
}

module.exports = new adminController();
