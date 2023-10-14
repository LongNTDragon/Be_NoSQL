const productRouter = require("./product.route")
const roleRouter = require("./role.route")
const authRouter = require("./auth.route")
const reviewRouter = require("./review.route")
const billRouter = require("./bill.route")
const userRouter = require("./user.route")

const useRouter = (app) => {
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/role', roleRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/review', reviewRouter)
    app.use('/api/v1/bill', billRouter)
    app.use('/api/v1/user', userRouter)
}

module.exports = useRouter