const { mongoose, Types } = require("mongoose")
const JWTService = require("../services/jwt.service")
const db = mongoose.connection

const getAll = async (req, res, next) => {
    const bills = await db.collection('bills').find().toArray()
    return res.status(200).json({
        success: true,
        data: bills
    })
}

const getByProId = async (req, res, next) => {
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
    const billArr = await db.collection('bills').find({
        userId: new Types.ObjectId(data.id),
        'products.proId': new Types.ObjectId(req.params.id)
    }).toArray()

    return res.status(200).json({
        success: true,
        data: billArr[0] || billArr
    })
}

const create = async (req, res, next) => {
    const productArr = await db.collection('products').find({ _id: new Types.ObjectId(req.body.proId) }).toArray()
    if (productArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid proId'
        })
    }

    const { data } = JWTService.decodeAccessToken(req.session.userToken.accessToken)
    const product = productArr[0]
    const bill = {
        userId: new Types.ObjectId(data.id),
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        quantity: req.body.quantity,
        total: req.body.quantity * product.price,
        createdAt: new Date(Date.now()),
        products: [{
            proId: product._id,
            proName: product.proName,
            price: product.price
        }]
    }

    await db.collection('bills').insertOne(bill)
    return res.status(201).json({
        success: true,
        data: bill
    })
}

const remove = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid billId'
        })
    }

    const billArr = await db.collection('bills').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (billArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid billId'
        })
    }

    await db.collection('bills').deleteOne({
        _id: new Types.ObjectId(req.params.id)
    })

    return res.status(200).json({
        success: true
    })
}

module.exports = {
    getAll,
    getByProId,
    create,
    remove
}