const mongoose = require('mongoose')

const JobSchema =new mongoose.Schema({
company:{
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 70
}, 
position:{
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
},
status:{
    type: String, 
    enum: ['interview','declined', 'pending'],
    default: 'pending',
},
createdBy:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide user']
}
}, {timestamps:true }

)

module.exports =mongoose.model('Job', JobSchema)

//notes 

//type: mongoose.Types.ObjectId: This sets the type of the createdBy field to be an ObjectId, which is the unique identifier used by MongoDB for documents. It indicates that this field will store an ObjectId.

//ref: 'User': The ref property tells Mongoose which model to reference. In this case, it references the User model. This creates a relationship between the document containing the createdBy field and a document in the User collection.
