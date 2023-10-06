const express = require("express")
const session = require("express-session")
require("dotenv").config()
const sessionStore = require("../configs/db/sessionStore")

const useMiddleware = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
        name: 'NoSQL_API',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 3600 * 24 * 7 * 1000
        }
    }))
}

module.exports = useMiddleware