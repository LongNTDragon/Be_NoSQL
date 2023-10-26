const { Router } = require("express")
const {
    getAll,
    getByProIdAndUserId,
    getAllByUserId,
    create,
    remove
} = require("../controllers/bill.controller")
const validateBody = require("../middlewares/validate.middleware")
const { validateBill } = require("../utils/validation")
const asyncHanle = require("../middlewares/asyncHandle.middleware")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/', authenticate, isAdmin, asyncHanle(getAll))
router.get('/getAllByUserId', authenticate, asyncHanle(getAllByUserId))
router.get('/getByProIdAndUserId/:id', authenticate, asyncHanle(getByProIdAndUserId))
router.post('/create', authenticate, validateBody(validateBill), asyncHanle(create))
router.delete('/:id', authenticate, isAdmin, asyncHanle(remove))

module.exports = router