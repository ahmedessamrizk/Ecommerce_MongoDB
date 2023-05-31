import joi from 'joi'

export const addComment = {
    body: joi.object().required().keys({
        commentBody: joi.string().required(),
        productID: joi.string().min(24).max(24).required()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
}

export const updateComment = {
    body: joi.object().required().keys({
        commentBody: joi.string().required(),
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24).required()
    })
}

export const softDeleteComment = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({allowUnknown: true}),
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24).required()
    })
}