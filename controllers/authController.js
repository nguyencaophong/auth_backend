const path = require('path');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult, cookie } = require('express-validator');
const fileHelper = require('../utils/file');

// HOME PAGE
exports.index = async (req, res, next) => {
    try {
        res.status(200).json({
            message:'success'
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};


// REGISTER
exports.getSignup = async (req, res, next) => {
    try {
        res.render('register/signup');
        
    } catch (error) {
        
    }
};

exports.postSignup = async (req, res, next) => {
    try {
        const hash = crypto.createHash('sha256');
        const password = req.body.password;
        const hashedPasswd = hash.update(req.body.password).digest('hex');
        const emoji = req.file
        console.log('upload image success!!!');


        // Error when submit form
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                errorMeassage: errors.array()[0].msg
            })
        }

        // Error image not type specific
        if(!emoji){
            return res.status(500).json({
                errorMeassage: 'file ảnh không đúng định dạng yêu cầu (jpg,png)'
                
            })
        }

        // Create new User
        const newUser = await new User({
            id: req.body.id,
            password: hashedPasswd,
            name: req.body.name,
            email: req.body.email,
            emoji: emoji.path
        })

        // Sace newUser to Database
        
        const user = await newUser.save();
        res.status(200).json({
            message:'success'
        });
    } catch (error) {
        res.status(500).json({
            errorMeassage:error.message
        });
    }
};


// LOGIN
exports.postLogin = async(req,res,next) =>{
    try {
        const id = req.body.id;
        const password = req.body.password;
        const hash = crypto.createHash('sha256');
        const hashedPasswd = hash.update(req.body.password).digest('hex');

        const userDetail = await User.findOne({
            id:id,
            password: hashedPasswd
        });
        

        // Check errors form login
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                errorMeassage:errors.array()[0].msg
            })
        }
        
        // Check user exits()
        if(!userDetail){
            return res.status(404).json({
                errorMeassage:'Tai khoản không tồn tại !!!'
            })
        }


        // Success!!!
        if(userDetail){
            req.session.isLoggedIn = true
            req.session.user = userDetail
            await req.session.save()

            res.status(200).json({
                message:'success',
                isLoginIn: true
            })
        }
    } catch (error) {
        res.status(500).json({
            errorMeassage:error.message
        })
    }
}


// Change INFOR USER

exports.postInforUser = async(req,res,next)=>{
    try {
        const userDetail = req.user;
        

        // hashed Password before save
        const hash = crypto.createHash('sha256');
        var hashedPasswd = hash.update(req.body.password).digest('hex');
        

        // // Check error form Info User
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                errorMeassage:errors.array()[0].msg
            })
        }

        fileHelper.deleteFile(userDetail.emoji);

        userDetail.id = userDetail.id;
        userDetail.password = hashedPasswd;
        userDetail.email = req.body.email;
        userDetail.name = req.body.name;
        userDetail.emoji = req.file.path;
        await userDetail.save();

        res.status(200).json({
            errorMeassage:'success'
        })


    } catch (error) {
        res.status(500).json({
            errorMeassage:error.message
        })
    }
}

// Delete Account
exports.deleteAccount = async(req,res,next) =>{
    try {
        
        const userDetail = req.user;

        await User.deleteOne({_id: userDetail._id});
        res.status(200).json({
            errorMeassage:'success'
        })
        console.log('delete user success!');
    } catch (error) {
        res.status(500).json({
            errorMeassage:error.message
        })
    }
}

