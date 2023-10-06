const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
require("dotenv").config()

const sessionStore = new MongoDBStore({
    uri: `${process.env.DB_HOST}/${process.env.DB_NAME}`,
    collection: 'sessions'
})

module.exports = sessionStore