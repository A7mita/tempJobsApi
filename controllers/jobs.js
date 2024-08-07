
const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

// get all jobs
const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count:jobs.lenght})
}

//get a single job 
const getJob = async (req,res) => {
    const {user: {userId}, params:{id:jobId}} = req // userId from the middleware since we have access to the token and id from the params in the url
    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    }) 
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)        
    }
    res.status(StatusCodes.OK).json({job})
}

// create a job
const createJob = async (req,res) => {
    //res.json(req.body)
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

//update a job
const updateJob = async (req,res) => {
    const {
        body:{company, position}, //this will be coming from the body in the postman  
        user: {userId}, // from the middle ware 
        params:{id:jobId} // from the url 
    } = req
    //res.send('update job ')
    if (company === '' || position === '') {
        throw new BadRequestError(' company or position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators: true}) // update using req.body 
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)        
    }
    res.status(StatusCodes.OK).json({job})

}

//delete a job 
const deleteJob = async (req,res) => {
    const {
        user: {userId}, // coming from the auth middle ware 
        params:{id:jobId} // from the url 
    } = req
    const job = await Job.findByIdAndDelete({_id:jobId, createdBy:userId})
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)        
    }
    res.status(StatusCodes.OK).send()

}

module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJob}

