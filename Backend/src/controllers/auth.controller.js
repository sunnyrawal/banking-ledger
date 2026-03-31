const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')


/**
 * - User register controller
 * - POST /api/auth/register
 */
async function register(req,res){
    const {email , name , password} = req.body

    const isExist = await userModel.findOne({email : email})
    if(isExist){
        return res.status(422).json({
            message : "User already exists",
            status : "failed"

        })
    }
    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : "1d"})

    res.cookie("token" , token )

    
    
    res.status(201).json({
        user :{
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
    
    await emailService.sendRegistrationEmail(user.email , user.name)


}


/** 
 * - User login controller
 * - POST /api/auth/login
 */
async function login(req,res){
    const {email , password} = req.body

    const user = await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(404).json({
            message : "User not found",
            status : "failed"
        })
    }

    const isValid = await user.comparePassword(password)
    if(!isValid){
        return res.status(401).json({
            message : "Invalid credentials",
            status : "failed"
        })
    }

    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : "1d"})

    res.cookie("token" , token )
    
    res.status(200).json({
        user :{
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
}

module.exports = {
    register ,login
}