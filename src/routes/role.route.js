const { Router } = require("express")
const {
    getAll,
    getByRoleId,
    create,
    update,
    remove
} = require("../controllers/role.controller")
const validateBody = require("../middlewares/validate.middleware")
const {
    validateInsertRole,
    validateUpdateRole
} = require("../utils/validation")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/', authenticate, isAdmin, asyncHandle(getAll))
router.get('/:id', authenticate, isAdmin, asyncHandle(getByRoleId))
router.post('/create', authenticate, isAdmin, validateBody(validateInsertRole), asyncHandle(create))
router.patch('/:id', authenticate, isAdmin, validateBody(validateUpdateRole), asyncHandle(update))
router.delete('/:id', authenticate, isAdmin, asyncHandle(remove))

module.exports = router