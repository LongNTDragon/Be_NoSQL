const fs = require("fs")
const validateBody = (validate) => {
    function middleware(req, res, next) {
        const valid = validate(req.body)
        if (valid.error) {
            if (req.files)
                fs.unlinkSync(req.files[0].path)

            return res.status(400).json({
                success: false,
                message: valid.error.details[0].message
            })
        }
        next()
    }
    return middleware
}

module.exports = validateBody