const { Router } = require("express")
const {
    getAll,
    getByProId,
    create,
    update,
    remove,
    updateImg,
    search
} = require("../controllers/product.controller")
const validateBody = require("../middlewares/validate.middleware")
const {
    validateInsertProduct,
    validateUpdateProduct,
    validateSearch
} = require("../utils/validation")
const asyncHandle = require("../middlewares/asyncHandle.middleware")
const validateUpload = require("../middlewares/uploadHanle.middleware")
const { authenticate, isAdmin } = require("../middlewares/auth.middleware")

const router = Router()

router.get('/', asyncHandle(getAll))
router.get('/:id', asyncHandle(getByProId))
router.post('/search', validateBody(validateSearch), asyncHandle(search))
router.post('/create', authenticate, isAdmin, validateUpload, validateBody(validateInsertProduct), asyncHandle(create))
router.patch('/:id', authenticate, isAdmin, validateBody(validateUpdateProduct), asyncHandle(update))
router.delete('/:id', authenticate, isAdmin, asyncHandle(remove))
router.patch('/updateImg/:id', authenticate, isAdmin, validateUpload, asyncHandle(updateImg))

module.exports = router