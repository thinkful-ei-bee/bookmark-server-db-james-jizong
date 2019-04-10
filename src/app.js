require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const app = express()
const uuid = require('uuid/v4')
const winston = require('winston')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(express.json())

const books=[]

// set up winston logger 
const logger = winston.createLogger({
  level:'info',
  format:winston.format.json(),
  transpports:[
    new winston.transports.File({filename:'info.log'})
  ]
});

if(NODE_ENV !=='production'){
  logger.add(new winston.transports.Console({
    format:winston.format.simple()
  }))
}

app.use(function validateBearerToken(req,res,next){
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if(!authToken ||authToken.split(' ')[1]!==apiToken){
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({error:'Unautherized request'})
  }
  next()
})


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
  })

app.get('/bookmarks/:bookId',(req,res)=>{
  const {bookId}=req.params;
  bookFound = books.filter(book=>book.id===bookId)
  if(!bookFound){
    res.status(404).json({error:"book not found"})
  }
  res.json(bookFound)

})




app.get('/bookmarks',(req,res)=>{
  res.status(200).json(books)
})

app.post('/bookmarks',(req,res)=>{
  const {title,url,desc=null,rating=null}=req.body
 
  if(!url || !title){
    return res.status(400).json({ "message": "Attributes `title` and `url` required"})
  }
  

  if(url.length<=5||url.substring(0,4)!=='http'){
    return res.status(400).json({"message": "Attribute `url` must be min length 5 and begin http(s)://"})
  }

  if(Number(rating) <1 || Number(rating) >5){
    return res.status(400).json({ "message": "Attribute `rating` (optional) must be number between 1 and 5"})
  }
  const id=uuid()
  books.push({id,title,url,desc,rating})
  res.json(books)
})

app.delete('/bookmarks/:bookId',(req,res)=>{
  const {bookId} = req.params;
  const index = books.findIndex(book => book.id===bookId)
  if(index===-1){
    return res
    .status(404)
    .send("Book not found")
  }
  books.splice(index,1)
  res.send('Deleted')
})

app.patch('/bookmarks/:bookId',(req,res)=>{
  const {bookId} = req.params;
  const {title,url,desc=null,rating=null}=req.body
})

module.exports = app