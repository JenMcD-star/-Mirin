const Activity = require('../models/activities')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllActivities = async (req, res) => {
    const activities = await Activity.find({ createdBy: req.user.userID }).sort('createdAt')
    res.status(200).json({ activities, count: activities.length })
}

const getActivity = async (req, res) => {
    res.json({ id: req.params.id })
}
const createActivity = async (req, res) => {
    req.body.createdBy = req.user.userId
    const activty = await Activity.create(req.body)
    res.status(StatusCodes.CREATED).json({ activty })
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