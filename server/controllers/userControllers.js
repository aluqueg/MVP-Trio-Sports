class userController {
  createUser = (req,res) =>{
    res.send("createUser")

  }

  login = (req, res) =>{
    res.send("login")

  }

  profile = (req, res) =>{
    res.send("profile")

  }

  editUser = (req, res) =>{
    res.send("editUser")

  }
}



module.exports = new userController