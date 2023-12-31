const { mongoose, Types } = require("mongoose")
const fs = require("fs")
const db = mongoose.connection

const getAll = async (req, res, next) => {
    const products = await db.collection('products').find().toArray()
    return res.status(200).json({
        success: true,
        data: products
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

    return res.status(200).json({
        success: true,
        data: productArr[0]
    })
}

const create = async (req, res, next) => {
    const product = {
        proName: req.body.proName,
        quantity: req.body.quantity,
        price: req.body.price,
        image: `/images/${req.files[0].filename}`
    }

    await db.collection('products').insertOne(product)
    return res.status(201).json({
        success: true,
        data: product
    })
}

const update = async (req, res, next) => {
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

    await db.collection('products').updateOne({ _id: new Types.ObjectId(req.params.id) }, { $set: { ...req.body } })

    return getByProId(req, res, next)
}

const updateImg = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid proId'
        })
    }

    const proArr = await db.collection('products').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (proArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid proId'
        })
    }

    const imgDes = `/images/${req.files[0].filename}`
    await db.collection('products').updateOne({ _id: new Types.ObjectId(req.params.id) }, { $set: { image: imgDes } })

    fs.unlinkSync(`./public${proArr[0].image}`)
    return getByProId(req, res, next)
}

const remove = async (req, res, next) => {
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

    fs.unlinkSync(`./public${productArr[0].image}`)
    await db.collection('products').deleteOne({ _id: new Types.ObjectId(req.params.id) })

    return res.status(200).json({
        success: true
    })
}

const search = async (req, res, next) => {
    const proArr = await db.collection('products').find({ proName: { $regex: req.body.content } }).toArray()

    if (proArr.length == 0) {
        return res.status(404).json({
            success: false,
            message: 'No product found'
        })
    }

    return res.status(200).json({
        success: true,
        data: proArr
    })
}

module.exports = {
    getAll,
    getByProId,
    create,
    update,
    remove,
    updateImg,
    search
}