class activityController {
  createActivity = (req, res) =>{
    res.send("createActivity")

  }

  editActivity = (req, res) =>{
    res.send("editActivity")

  }

  getAllActivities = (req, res) =>{
    res.send("getAllActivities")
  }

  getOneActivity = (req, res) =>{
    res.send("getOneActivity")
  }
  
}

module.exports = new activityController