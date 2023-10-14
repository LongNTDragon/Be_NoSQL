const { mongoose, Types } = require("mongoose")
const JWTService = require("../services/jwt.service")
const db = mongoose.connection

const create = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid proId'
        })
    }

    const productArr = await db.collection('products').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (productArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid proId'
        })
    }

    const { data } = JWTService.decodeAccessToken(req.session.userToken.accessToken)

    const userArr = await db.collection('roles').aggregate([
        { $unwind: '$users' },
        { $match: { 'users.userId': new Types.ObjectId(data.id) } }
    ]).toArray()

    const user = userArr[0].users
    Reflect.deleteProperty(user, 'password')
    const review = {
        rvId: new Types.ObjectId,
        content: req.body.content,
        star: req.body.star,
        createdAt: new Date(Date.now()),
        customer: user
    }

    const reviewArr = await db.collection('products').find({
        _id: new Types.ObjectId(req.params.id),
        'reviews.customer.userId': user.userId
    }).toArray()

    if (reviewArr.length != 0) {
        return res.status(400).json({
            success: false,
            message: 'You have reviewed this product'
        })
    }

    await db.collection('products').updateOne(
        { _id: new Types.ObjectId(req.params.id) },
        { $push: { 'reviews': review } })

    return res.status(201).json({
        success: true
    })
}

const remove = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid rvId'
        })
    }
    const { data } = JWTService.decodeAccessToken(req.session.userToken.accessToken)
    const reviewArr = await db.collection('products').aggregate([
        { $unwind: '$reviews' },
        { $match: { 'reviews.rvId': new Types.ObjectId(req.params.id) } }
    ]).toArray()

    if (reviewArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid rvId'
        })
    }

    await db.collection('products').updateOne(
        { 'reviews.rvId': new Types.ObjectId(req.params.id) },
        { $pull: { 'reviews': { 'rvId': new Types.ObjectId(req.params.id) } } }
    )

    return res.status(200).json({
        success: true
    })
}

module.exports = {
    create,
    remove
}