const bcrypt = require("bcrypt")
const { mongoose, Types } = require("mongoose")
const JWTService = require("../services/jwt.service")
const db = mongoose.connection

const register = async (req, res, next) => {
    const userArr = await db.collection('roles').find({ 'users.email': req.body.email }).toArray()
    if (userArr.length != 0) {
        return res.status(409).json({
            success: false,
            message: 'Email already exists'
        })
    }

    const salt = bcrypt.genSaltSync()
    const user = {
        userId: new Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password, salt)
    }

    await db.collection('roles').updateOne({ roleName: 'user' }, { $push: { users: user } })

    return res.status(201).json({
        success: true,
        data: user
    })
}

const login = async (req, res, next) => {
    const userArr = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.email': req.body.email } }
    ]).toArray()

    if (userArr.length == 0) {
        return res.status(404).json({
            success: false,
            message: 'Email not found'
        })
    }

    const user = userArr[0].users
    const validPW = bcrypt.compareSync(req.body.password, user.password)
    if (!validPW) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password'
        })
    }

    const userToken = {
        accessToken: JWTService.generateAccessToken({
            id: user.userId,
            name: user.name,
            role: userArr[0].roleName
        }),
        refreshToken: JWTService.generateRefreshToken(user.userId)
    }

    req.session.userToken = userToken

    return res.status(200).json({
        success: true,
        message: 'Login success'
    })
}

const logout = (req, res, next) => {
    req.session.destroy(err => console.log(err))

    res.clearCookie('NoSQL_API', { path: '/' })

    return res.status(200).json({
        message: 'Logout success'
    })
}

const refreshToken = async (req, res, next) => {
    const refToken = req.session.userToken?.refreshToken
    if (!refToken) {
        return res.status(404).json({
            success: false,
            message: 'refresh token not found'
        })
    }

    const { id } = JWTService.decodeRefreshToken(refToken)
    const userArr = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.userId': new Types.ObjectId(id) } }
    ]).toArray()

    if (userArr.length == 0) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    const user = userArr[0].users
    const userToken = {
        accessToken: JWTService.generateAccessToken({
            id: user.userId,
            name: user.name,
            role: userArr[0].roleName
        }),
        refreshToken: JWTService.generateRefreshToken(user.userId)
    }

    req.session.userToken = userToken

    return res.status(200).json({
        success: true,
        message: 'Refresh success'
    })
}
const verify = (req, res) => {
    const session = req.session.userToken;
    if (session) {
        const { data } = JWTService.decodeAccessToken(session.accessToken);
        return res.json({
            verify: true,
            data: data
        });
    } else {
        return res.json({
            verify: false
        });
    }
};
module.exports = {
    register,
    login,
    logout,
    refreshToken,
    verify
}