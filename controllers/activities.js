const Activity = require('../models/activities')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllActivities = async (req, res) => {

    const activities = await Activity.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ activities, count: activities.length })
}


const getActivity = async (req, res) => {
    const {
        user: { userId },
        params: { id: activityId },
    } = req

    const activity = await Activity.findOne({
        _id: activityId,
        createdBy: userId,
    })
    if (!activity) {
        throw new NotFoundError(`No activity with id ${activityId}`)
    }
    res.status(StatusCodes.OK).json({ activity })
}


const createActivity = async (req, res) => {
    req.body.createdBy = req.user.userId
    const activity = await Activity.create(req.body)
    res.status(StatusCodes.CREATED).json({ activity })
}

const updateActivity = async (req, res) => {
    const {
        user: { userId },
        params: { id: activityId },
    } = req


    const activity = await Activity.findByIdAndUpdate(
        { _id: activityId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!activity) {
        throw new NotFoundError(`No activity with id ${activityId}`)
    }
    res.status(StatusCodes.OK).json({ activity })
}

const deleteActivity = async (req, res) => {
    const {
        user: { userId },
        params: { id: activityId },
    } = req

    const activity = await Activity.findByIdAndRemove({
        _id: activityId,
        createdBy: userId,
    })
    if (!activity) {
        throw new NotFoundError(`No activity with id ${activityId}`)
    }
    res.status(StatusCodes.OK).json({msg: "The entry was deleted."})

}

module.exports = {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
}