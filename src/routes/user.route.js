const { Router } = require("express")
const {
    getAll,
    getById,
    create,
    update,
    remove
} = require("../controllers/user.controller")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const validateBody = require("../middlewares/validate.middleware")
const {
    validateRegister,
    validateUserUpdate
} = require("../utils/validation")

const router = Router()

router.get('/', authenticate, isAdmin, asyncHandle(getAll))
router.get('/:id', authenticate, isAdmin, asyncHandle(getById))
router.post('/create', authenticate, isAdmin, validateBody(validateRegister), asyncHandle(create))
router.patch('/:id', authenticate, isAdmin, validateBody(validateUserUpdate), asyncHandle(update))
router.delete('/:id', authenticate, isAdmin, asyncHandle(remove))

module.exports = router