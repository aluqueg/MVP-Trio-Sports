class adminController {
  getAllUsers = (req, res) => {
    res.send("getAllUsers");
  };

  disableUser = (req, res) => {
    res.send("disableUser");
  };

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
