const { Router } = require("express")
const {
    register,
    login,
    logout,
    refreshToken,
    verify,
    getInfo,
    updateInfo,
    changePassWord
} = require("../controllers/auth.controller")
const validateBody = require("../middlewares/validate.middleware")
const {
    validateRegister,
    validateLogin,
    validateUserUpdate,
    validateChangePassword
} = require("../utils/validation")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const { authenticate } = require("../middlewares/auth.middleware")

const router = Router()

router.post('/register', validateBody(validateRegister), asyncHandle(register))
router.post('/login', validateBody(validateLogin), asyncHandle(login))
router.post('/logout', authenticate, asyncHandle(logout))
router.post('/refreshToken', asyncHandle(refreshToken))
router.get('/verify', asyncHandle(verify))
router.get('/getInfo', authenticate, asyncHandle(getInfo))
router.post('/changePassword', authenticate, validateBody(validateChangePassword), asyncHandle(changePassWord))
router.post('/updateInfo', authenticate, validateBody(validateUserUpdate), asyncHandle(updateInfo))

module.exports = router