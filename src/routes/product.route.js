const { Router } = require("express")
const {
    getAll,
    getByProId,
    create,
    update,
    remove
} = require("../controllers/product.controller")
const validateBody = require("../middlewares/validate.middleware")
const {
    validateInsertProduct,
    validateUpdateProduct
} = require("../utils/validation")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const validateUpload = require("../middlewares/uploadHanle.middleware")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/', asyncHandle(getAll))
router.get('/:id', asyncHandle(getByProId))
router.post('/create', authenticate, isAdmin, validateUpload, validateBody(validateInsertProduct), asyncHandle(create))
router.patch('/:id', authenticate, isAdmin, validateBody(validateUpdateProduct), asyncHandle(update))
router.delete('/:id', authenticate, isAdmin, asyncHandle(remove))

module.exports = router