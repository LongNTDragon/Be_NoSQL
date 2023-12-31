const { Router } = require("express")
const {
    create,
    getByProId,
    remove
} = require("../controllers/review.controller")
const validateBody = require("../middlewares/validate.middleware")
const { validateReview } = require("../utils/validation")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const { authenticate } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/getByProId/:id', authenticate, asyncHandle(getByProId))
router.post('/create/:id', authenticate, validateBody(validateReview), asyncHandle(create))
router.delete('/:id', authenticate, asyncHandle(remove))

module.exports = router