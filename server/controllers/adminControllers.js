class adminController {
  getAllUsers = (req, res) =>{
    res.send("getAllUsers")
  }

  disableUser = (req, res) =>{
    res.send("disableUser")
  }

  enableUser = (req, res) =>{
    res.send("enableUser")
  }
}

module.exports = new adminController