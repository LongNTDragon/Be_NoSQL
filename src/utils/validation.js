const joi = require("joi")

const validateInsertProduct = (data) => {
    const dataSchema = joi.object({
        proName: joi.string().required(),
        quantity: joi.number().required(),
        price: joi.number().required()
    })
    return dataSchema.validate(data)
}

const validateUpdateProduct = (data) => {
    const dataSchema = joi.object({
        proName: joi.string(),
        quantity: joi.number(),
        price: joi.number()
    })
    return dataSchema.validate(data)
}

const validateInsertRole = (data) => {
    const dataSchema = joi.object({
        roleName: joi.string().required()
    })
    return dataSchema.validate(data)
}

const validateUpdateRole = (data) => {
    const dataSchema = joi.object({
        roleName: joi.string()
    })
    return dataSchema.validate(data)
}

const validateRegister = (data) => {
    const dataSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().length(5).required(),
        gender: joi.string().required(),
        phone: joi.string().length(10).pattern(/^[0-9]+$/).messages({ 'string.pattern.base': 'The number phone must have to 10 digits' }).required(),
        address: joi.string().required()
    })
    return dataSchema.validate(data)
}

const validateLogin = (data) => {
    const dataSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().length(5).required()
    })
    return dataSchema.validate(data)
}

const validateReview = (data) => {
    const dataSchema = joi.object({
        content: joi.string().required(),
        star: joi.number().min(1).max(5).required()
    })
    return dataSchema.validate(data)
}

const validateBill = (data) => {
    const dataSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().length(10).pattern(/^[0-9]+$/).messages({ 'string.pattern.base': 'The number phone must have 10 digits' }).required(),
        address: joi.string().required(),
        proId: joi.string().length(24).required(),
        quantity: joi.number().min(1).max(5).required()
    })
    return dataSchema.validate(data)
}

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|git|GIF)$/)) {
        req.fileValidateError = 'Only image file are allowed'
        return cb(new Error('Only image file are allowed'), false)
    }
    cb(null, true)
}

module.exports = {
    validateInsertProduct,
    validateUpdateProduct,
    validateInsertRole,
    validateUpdateRole,
    validateRegister,
    validateLogin,
    validateReview,
    validateBill,
    imageFilter
}