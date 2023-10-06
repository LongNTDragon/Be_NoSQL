const jwt = require("jsonwebtoken")
require("dotenv").config()

class JWTService {
    generateAccessToken(data) {
        const token = jwt.sign(
            { data },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES })
        return token
    }

    decodeAccessToken(token) {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )
        return payload
    }

    generateRefreshToken(id) {
        const token = jwt.sign(
            { id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        )
        return token
    }

    decodeRefreshToken(token) {
        const payload = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        )
        return payload
    }
}

module.exports = new JWTService