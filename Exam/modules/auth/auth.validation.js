import joi from 'joi'

export const SignUp = {
    body: joi.object().required().keys({
        firstName:  joi.string().min(3).max(8).required(), 
        lastName: joi.string().min(3).max(8).required(), 
        email: joi.string().email().required(), 
        password: joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)).required(), 
        cPassword: joi.string().valid(joi.ref('password')).required(),
        age: joi.number().min(10), 
        phone: joi.string().min(11).max(11).pattern(new RegExp(/^01[0125][0-9]{8}$/)), 
        gender: joi.string().pattern(/^(Male|Female)$/), 
        address: joi.string()
    })
}

export const confirmEmail = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })
}

export const SignIn = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)).required(), 
    })
}

export const sendCode = {
    body: joi.object().required().keys({
        email: joi.string().email().required()
    })
}

export const  forgetPassword = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        code: joi.string().required().pattern(new RegExp()),
        newPassword: joi.string().required()
    })
}