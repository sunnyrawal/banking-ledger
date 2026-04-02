const  express = require('express')

const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())


/**
 * Routes
 */
const authRoute = require('./routes/auth.route')
const accountRoute = require('./routes/account.route')
const transactionRoute = require('./routes/transaction.route')


/**
 * Use Routes
 */
app.use('/api/auth' , authRoute)
app.use('/api/accounts', accountRoute)
app.use('/api/transactions', transactionRoute)

module.exports = app