const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors') 
//const bcrypt = require ('bcryptjs') a it is already setup in model

//const jwt = require('jsonwebtoken')
const register = async (req,res) => {
//const {name, email, password} = req.body
//const salt = await bcrypt.genSalt(10); // generate random bytes for encrypting the password 
//const hashedPassword = await bcrypt.hash(password, salt)  
//const tempUser = {name, email, password:hashedPassword}
// You can either use this or the presave function in User.js
    //const {name, email, password} = req.body
    //if (!name || !email || !password ) {
    //    throw new BadRequestError('please provide name, email, password')        
    //} validation from controller 
    //const user = await User.create({...tempUser}) ; //replacing tempuser with req.body 
    const user = await User.create({...req.body})// create user
    const token = user.createJWT()
    //const token =jwt.sign({userId:user._id, name:user.name}, 'jwtSecret', {expiresIn: '30d'}) // use this while importing jsonwebtoken 
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})// need to send the token as it will allow the user to access the resources 
}

//notes
// Spread Operator (...): When you use { ...req.body }, the spread operator takes all key-value pairs from req.body and creates a new object with the same properties. It is effectively equivalent to:

//User.create({
//    username: req.body.username,
//    email: req.body.email,
//    password: req.body.password
//});

const login = async (req,res) => {
    const {email, password} = req.body
if (!email || !password ) {
    throw new BadRequestError('please provide name, email, password')
}
const user = await User.findOne({email})
if (!user) {
    throw new UnauthenticatedError('invalid credentials')    
}
const isPasswordCorrect = await user.comparePassword(password)
if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')    
} // if the comparePassword function returns false then the invalid credentials error is thrown  

const token = user.createJWT() 
res.status(StatusCodes.OK).json({user:{name: user.name}, token})
} 

module.exports = {
    register, login,
}

