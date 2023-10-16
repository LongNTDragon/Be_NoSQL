const { mongoose, Types } = require("mongoose")
const bcrypt = require("bcrypt")
const db = mongoose.connection

const getAll = async (req, res, next) => {
    const userArr = await db.collection('roles').find({ roleName: 'user' }).toArray()
    const users = []
    userArr[0].users.forEach(user => {
        if (user.is_Active == 1) {
            users.push(user)
        }
    })
    return res.status(200).json({
        success: true,
        data: users
    })
}

const getBlackList = async (req, res, next) => {
    const userArr = await db.collection('roles').find({ roleName: 'user' }).toArray()
    const users = []
    userArr[0].users.forEach(user => {
        if (user.is_Active == 0) {
            users.push(user)
        }
    })
    return res.status(200).json({
        success: true,
        data: users
    })
}

const getById = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId'
        })
    }

    const userArr = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.userId': new Types.ObjectId(req.params.id) } }
    ]).toArray()

    if (userArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId'
        })
    }

    return res.status(200).json({
        success: true,
        data: userArr[0].users
    })
}

const create = async (req, res, next) => {
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

const update = async (req, res, next) => {
    const userArr = await db.collection('roles').find({ roleName: 'user' }).toArray()
    let pos
    userArr[0].users.forEach((user, index) => {
        if (user.userId == req.params.id) {
            pos = index
        }
    })

    if (!pos) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId'
        })
    }

    let user = {}

    if (req.body.name)
        user[`users.${pos}.name`] = req.body.name
    if (req.body.email)
        user[`users.${pos}.email`] = req.body.email
    if (req.body.gender)
        user[`users.${pos}.gender`] = req.body.gender
    if (req.body.phone)
        user[`users.${pos}.phone`] = req.body.phone
    if (req.body.address)
        user[`users.${pos}.address`] = req.body.address
    if (req.body.password) {
        const salt = bcrypt.genSaltSync()
        const passHash = bcrypt.hashSync(req.body.password, salt)
        user[`users.${pos}.password`] = passHash
    }
    if (req.body.is_Active == 0 || req.body.is_Active == 1)
        user[`users.${pos}.is_Active`] = req.body.is_Active

    await db.collection('roles').updateOne(
        { 'users.userId': new Types.ObjectId(req.params.id) },
        { $set: user }
    )

    return getById(req, res, next)
}

const remove = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId'
        })
    }

    const userArr = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.userId': new Types.ObjectId(req.params.id) } }
    ]).toArray()

    if (userArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid userId'
        })
    }

    await db.collection('roles').updateOne(
        { 'users.userId': new Types.ObjectId(req.params.id) },
        { $pull: { 'users': { 'userId': new Types.ObjectId(req.params.id) } } }
    )

    return res.status(200).json({
        success: true
    })
}

module.exports = {
    getAll,
    getBlackList,
    getById,
    create,
    update,
    remove
}