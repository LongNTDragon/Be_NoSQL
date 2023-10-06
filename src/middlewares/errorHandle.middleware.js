const errorHandle = (err, req, res, next) => {
    return res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err?.message
    })
}

module.exports = errorHandle