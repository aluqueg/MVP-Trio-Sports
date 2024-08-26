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

  prueba = (req,res)=>{
    res.send("funciona")
  }

  disableUser = (req,res)=>{
    const {user_id,status} = req.body
    console.log(req.body)
    let sql = `UPDATE user SET is_disabled = 1 WHERE user_id = "${user_id}"`
    if(status == 1){
      sql = `UPDATE user SET is_disabled = 0 WHERE user_id = "${user_id}"`
    }

    connection.query(sql,(err, result)=>{
      if(err){
        res.status(500).json(err)
      }else{
        res.status(200).json(result)
      }
    })
  }

  enableUser = (req, res) => {
    res.send("enableUser");
  };

  

  disableSport = (req, res) => {
    let { sport_id } = req.params;
    let sql = `UPDATE sport SET is_deleted = 1 WHERE sport_id = ${sport_id}`;
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
