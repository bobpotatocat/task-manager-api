const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    }, owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //set up relationship between models
        ref:'User'
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema )

module.exports = Task