const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim : true,

    }, age:{
        type: Number,
        default: 20,
        validate(value) {
            if (value < 1){
                throw new Error ('age must be above 0')
            }
        }
    }, email : {
        type: String,
        unique:true,
        required: true,
        validator(value){
            if (!validator.isEmail(value)) {
                throw new Error('email must be valid')
            }
        },
        trim : true,
        lowercase: true
    }, password: {
        type: String,
        trim : true,
        required: true,
        minlength: 6,
        validate(value){
            //why is it that can't run postman when .toLowerCase()
            if (validator.contains(value, 'password')){
                throw new Error('password cannot contain "password" ')
            }
        }
    }, tokens : [{
        token : {
            type: String,
            required:true
        }
    }], avatar: {
        type:Buffer
    }
},{
    //specify schema options 
    timestamps:true
})
// virtual field 
userSchema.virtual('tasks',{
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

//prevent user from seeing own password / tokens
userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//methods --> instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}
//statics --> model methods
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('unable to log in')
    }
    return user
}

//use middleware to act on schema and hash pw
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    //call next to tell that it is done
    next()
})

//delete user tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner : user._id})
    next ()
})

//create user model
const User = mongoose.model('User', userSchema )

module.exports = User