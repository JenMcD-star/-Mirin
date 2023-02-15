const Activity = require('../models/activities')

const getAllActivities = async (req, res) => {
    const activities = await Activity.find({createdBy: req.user.userID}).sort('createdAt')
    res.status(200).json({activities, count: activities.length})
}

const getActivity = async (req, res) => {
    res.json({id:req.params.id})
}
const createActivity = async (req, res) => {
    console.log(req)
    res.json(req.body)
}
const updateActivity = async (req, res) => {
    res.send('update one')
}
const deleteActivity = async (req, res) => {
    res.send('delete one')
}

module.exports = {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
  }