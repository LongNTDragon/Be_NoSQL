const express = require("express")
require("dotenv").config()
const connectDB = require("./configs/db/mongodb")
const useRouter = require("./routes/index")
const useMiddleware = require("./middlewares/index")
const errorHandle = require("./middlewares/errorHandle.middleware")
const cors = require('cors')
const port = process.env.PORT || 2002
const app = express()

function runApp() {
    app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET,POST,PUT,DELETE,PATCH"],
        credentials: true
    }));
    app.use(express.static('public'))

    connectDB()
    useMiddleware(app)
    useRouter(app)

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    })

    app.use(errorHandle)
}

runApp()