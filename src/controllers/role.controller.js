const { mongoose, Types } = require("mongoose")
const db = mongoose.connection

const getAll = async (req, res, next) => {
    const roles = await db.collection('roles').find().toArray()
    return res.status(200).json({
        success: true,
        data: roles
    })
}

const getByRoleId = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    const roleArr = await db.collection('roles').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (roleArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    return res.status(200).json({
        success: true,
        data: roleArr[0]
    })
}

const create = async (req, res, next) => {
    const roleArr = await db.collection('roles').find({ roleName: req.body.roleName }).toArray()
    if (roleArr.length != 0) {
        return res.status(400).json({
            success: false,
            message: 'roleName already exists'
        })
    }

    await db.collection('roles').insertOne(req.body)

    return res.status(201).json({
        success: true,
        data: req.body
    })
}

const update = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    const roleArr = await db.collection('roles').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (roleArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    if (req.body.roleName != roleArr[0].roleName) {
        const r = await db.collection('roles').find({ roleName: req.body.roleName }).toArray()
        if (r.length != 0) {
            return res.status(400).json({
                success: false,
                message: 'roleName already exists'
            })
        }
    }

    await db.collection('roles').updateOne({ _id: new Types.ObjectId(req.params.id) }, { $set: { ...req.body } })

    return getByRoleId(req, res, next)
}

const remove = async (req, res, next) => {
    if (req.params.id.length != 24) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    const roleArr = await db.collection('roles').find({ _id: new Types.ObjectId(req.params.id) }).toArray()
    if (roleArr.length == 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid roleId'
        })
    }

    await db.collection('roles').deleteOne({ _id: new Types.ObjectId(req.params.id) })

    return res.status(200).json({
        success: true
    })
}

module.exports = {
    getAll,
    getByRoleId,
    create,
    update,
    remove
}