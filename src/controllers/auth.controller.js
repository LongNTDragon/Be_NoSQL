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
        password: bcrypt.hashSync(req.body.password, salt),
        is_Active: 1
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
    if (user.is_Active == 0) {
        return res.status(404).json({
            success: false,
            message: 'Your account is locked'
        })
    }

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

const logout = async (req, res, next) => {
    await req.session.destroy(err => {
        if (err)
            console.log(err)
    })

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
}

const updateInfo = async (req, res, next) => {
    const { data } = JWTService.decodeAccessToken(req.session.userToken.accessToken)
    const userArr = await db.collection('roles').find({ roleName: 'user' }).toArray()
    let pos
    userArr[0].users.forEach((user, index) => {
        if (user.userId.equals(data.id)) {
            pos = index
        }
    })

    let user = {}

    if (req.body.name)
        user[`users.${pos}.name`] = req.body.name
    if (req.body.gender)
        user[`users.${pos}.gender`] = req.body.gender
    if (req.body.phone)
        user[`users.${pos}.phone`] = req.body.phone
    if (req.body.address)
        user[`users.${pos}.address`] = req.body.address

    await db.collection('roles').updateOne(
        { 'users.userId': new Types.ObjectId(data.id) },
        { $set: user }
    )

    const userN = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.userId': new Types.ObjectId(data.id) } }
    ]).toArray()

    return res.status(200).json({
        success: true,
        data: userN[0].users
    })
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    verify,
    updateInfo
}