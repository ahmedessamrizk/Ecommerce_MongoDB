import joi from 'joi'

export const getUserByID = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    params: joi.object().required().keys({
        id: joi.string().required().min(24).max(24)
    })
}

export const updateProfile = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    body: joi.object().required().keys({
        firstName: joi.string().min(3).max(8),
        lastName: joi.string().min(3).max(8),
        address: joi.string().min(3),
        age: joi.number().min(3),
        phone: joi.string().min(11).max(11)
    }),
}

export const updatePassword = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    body: joi.object().required().keys({
        oldPassword: joi.string().required().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)),
        newPassword: joi.string().required().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)),
        cPassword: joi.string().valid(joi.ref('oldPassword')).required()
    })
}

export const softDeleteProfile = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    body: joi.object().required().keys({
        password: joi.string().required().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)),
    })
}

export const blockUser = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    body: joi.object().required().keys({
        email: joi.string().email().required()
    })
    
}

export const SignOut = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true})
}