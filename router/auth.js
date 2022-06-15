const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');
const route = express.Router();
const User = require('../models/user');
const authController = require('../controllers/authController');

route.get('/',authController.index)

route.get('/signup',authController.getSignup);

route.post('/signup',
    [
        check( 'id' ,'Trường id này không được trống!!!')
            .exists()
            .isAlphanumeric()
            .isLength({ min: 4,max:16 })
            .withMessage('id có độ dài từ 4-16 ký tự !!!')
            .matches(/\d/)
            .withMessage('id phải bao gồm cả số và chữ thường !!!')
            .custom( ( value, { req } ) => {
                return User.findOne( { id: value } ).then( userDoc => {
                    if ( userDoc ) {
                        return Promise.reject(
                            'Id đã tồn tại, vui lòng chọn Id khác.'
                        );
                    }
                } );
            } )
            .trim(),
        check( 'password' , 'Trường password này không được trống!!!' )
            .exists()
            .isAlphanumeric()
            .isLength({ min: 4,max:16 })
            .withMessage('password có độ dài từ 4-16 ký tự !!!')
            .matches(/\d/)
            .withMessage('password phải bao gồm cả số và chữ thường !!!')
            .trim(),
        check( 'name' , 'Trường name này không được trống!!!' )
            .exists()
            .isAlphanumeric()
            .isLength({max:16 })
            .withMessage('name có độ dài tối đa 16 ký tự !!!')
            .trim(),
        check( 'email' , 'Trường email này không được trống!!!' )
            .exists()
            .isEmail()
            .custom( ( value, { req } ) => {
                return User.findOne( { email: value } ).then( userDoc => {
                    if ( userDoc ) {
                        return Promise.reject(
                            'E-Mail đã tồn tại, vui lòng chọn E-Mail khác.'
                        );
                    }
                } );
            } )
            .trim()

    ], authController.postSignup);


// Login
route.post('/login',
    [
        check( 'id' ,'Trường id này không được trống!!!')
            .exists()
            .isAlphanumeric()
            .isLength({ min: 4,max:16 })
            .withMessage('id có độ dài từ 4-16 ký tự !!!')
            .matches(/\d/)
            .withMessage('id phải bao gồm cả số và chữ thường !!!')
            .trim(),
        check( 'password' , 'Trường password này không được trống!!!' )
            .exists()
            .isAlphanumeric()
            .isLength({ min: 4,max:16 })
            .withMessage('password có độ dài từ 4-16 ký tự !!!')
            .matches(/\d/)
            .withMessage('password phải bao gồm cả số và chữ thường !!!')
            .trim()
    ],
    authController.postLogin);


// Change info user
route.put('/account',[
    check( 'password' , 'Trường password này không được trống!!!' )
        .exists()
        .isAlphanumeric()
        .isLength({ min: 4,max:16 })
        .withMessage('password có độ dài từ 4-16 ký tự !!!')
        .matches(/\d/)
        .withMessage('password phải bao gồm cả số và chữ thường !!!')
        .trim(),
    check( 'name' , 'Trường name này không được trống!!!' )
        .exists()
        .isAlphanumeric()
        .isLength({max:16 })
        .withMessage('name có độ dài tối đa 16 ký tự !!!')
        .trim(),
    check( 'email' , 'Trường email này không được trống!!!' )
        .exists()
        .isEmail()
        .trim()

],authController.postInforUser);


// Delete Account
route.delete('/delete',authController.deleteAccount);
module.exports = route;
