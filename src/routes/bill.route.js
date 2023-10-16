const { Router } = require("express")
const {
    getAll,
    getByProId,
    create,
    remove
} = require("../controllers/bill.controller")
const validateBody = require("../middlewares/validate.middleware")
const { validateBill } = require("../utils/validation")
const asyncHanle = require("../middlewares/asyncHandle.middleware")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/', authenticate, isAdmin, asyncHanle(getAll))
router.get('/getByProId/:id', authenticate, asyncHanle(getByProId))
router.post('/create', authenticate, validateBody(validateBill), asyncHanle(create))
router.delete('/:id', authenticate, isAdmin, asyncHanle(remove))

module.exports = router