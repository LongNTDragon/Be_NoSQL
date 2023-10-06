const multer = require("multer")
const storage = require("../configs/imageStorage")
const { imageFilter } = require("../utils/validation")

const validateUpload = (req, res, next) => {
    let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('upload_file', 8)

    uploadMultipleFiles(req, res, err => {
        let errorMessage

        if (req.fileValidateError) {
            errorMessage = req.fileValidateError
        }
        else if (!req.files || req.files.length == 0) {
            errorMessage = 'Please select an image to upload'
        }
        else if (err instanceof multer.MulterError) {
            errorMessage = 'The number of file exceeds the allowed limit'
        }
        else if (err) {
            errorMessage = err
        }

        if (errorMessage) {
            return res.status(400).json({
                success: false,
                message: errorMessage
            })
        }
        else
            next()
    })
}

module.exports = validateUpload