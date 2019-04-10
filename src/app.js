require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const app = express()
const validateBearerToken = require('./validationHandler')
const errHandler = require('./errHandler')
const bookmarkRouter = require('./bookmarkRouter')
const morganOption = (NODE_ENV === 'production')? 'tiny'
  : 'common';



app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(express.json())


app.use(validateBearerToken)

app.use(errHandler)

app.use(bookmarkRouter)

module.exports = app