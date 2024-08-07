const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message  || "Something went wrong try again later" // default set to the custom err or intertnal server error and their corresponding messages 
  }

  //if (err instanceof CustomAPIError) {
  //  return res.status(err.statusCode).json({ msg: err.message })
  //}

  // Registration  failure to provide email, password, name while registering  
  if (err.name === 'ValidationError') {
    //console.log(Object.values(err.errors))
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode = 400
  }// this  extracts the items within err.errors object and strings them together so if email, password is missing it will say please provide email, please provide password and so on...  

 // this error handler gets triggered if the syntax of the id is incorrect   
  if (err.code && err.code === 11000) {
    customError.msg = ` Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose correctly`  // err.keyValue is one of the keys stored in Object 
    customError.statusCode = 400 // since this is a bad request   
  } // check if there is an error code (in our example in postman and error code is 11000 and if so trigger the custome error message)

if(err.name ==='CastError'){
  customError.msg =`No item found with id: ${err.value}` // err.value is the property under the err object that gets triggered on the entry of job id with incorrect syntax 
  customError.statusCode = 404
}   
// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })// to be used for seeing the generic error messagge  
  return res.status(customError.statusCode).json({msg:customError.msg}) 

}

module.exports = errorHandlerMiddleware


// Notes 

// The middleware first checks if the error (err) is an instance of CustomAPIError. If it is, it responds with the status code and message defined in the CustomAPIError instance. If it is not, it responds with a generic internal server error status (500) and the error object.
