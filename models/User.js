const mongoose =require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide email'],        
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email',
    ],
    unique: true, // generates duplicate error message if email is in use
},
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
            },
    
})

UserSchema.pre('save', async function () {
const salt = await bcrypt.genSalt(10) // generate random bytes for encrypting the password 
this.password = await bcrypt.hash(this.password, salt)
//next()
//this.password refers to the password field of the user document being saved.
})// before saving encrypt the password 

UserSchema.methods.createJWT = function () {
    return jwt.sign({userId:this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME}) 
} //When you define a method on UserSchema.methods, it means that each document created from the User model will have access to this method. Methods defined on the schema's methods object are instance methods, meaning they can be called on individual documents (instances of the model). For example, if you have a user document, you can call user.createJWT() to generate a JWT for that user.

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

//UserSchema.methods.getName = function () {
//    return this.name 
//}

module.exports = mongoose.model('User',UserSchema) 