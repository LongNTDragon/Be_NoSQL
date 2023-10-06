const mongoose = require("mongoose")
require("dotenv").config()

async function connect() {
    try {
        await mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`)
        console.log('Connect success')

    } catch (error) {
        console.log({ ErrorConnect: error })
    }
}

module.exports = connect