const fs = require("fs")

const errorHandle = (err, req, res, next) => {
    if (req.files)
        fs.unlinkSync(req.files[0].path)

    return res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err?.message
    })
}

module.exports = errorHandle