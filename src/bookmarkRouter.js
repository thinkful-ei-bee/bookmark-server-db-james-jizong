const express = require('express')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')
const books=[]
const uuid = require('uuid/v4')

bookmarkRouter
.route('/bookmarks')
.get((req,res)=>{
  if(books.length===0){
    logger.error(`There is no book in the database`);
    return res.status(200).send('there is no bookmark yet')
  }
  res.status(200).json(books)
})

.post(bodyParser,(req,res)=>{
  const {title,url,desc=null,rating=null}=req.body
 
  if(!url || !title){
    
    url?logger.error('user did not supply url'):logger.error('user did not supply title')
    
    return res.status(400).json({ "message": "Attributes `title` and `url` required"})
  }
  

  if(url.length<=5||url.substring(0,4)!=='http'){
    logger.error('user provided invalid url')
    return res.status(400).json({"message": "Attribute `url` must be min length 5 and begin http(s)://"})
  }

  if(Number(rating) <1 || Number(rating) >5){
    logger.error('user provide invalid rating')
    return res.status(400).json({ "message": "Attribute `rating` (optional) must be number between 1 and 5"})
  }
  const id=uuid()
  books.push({id,title,url,desc,rating})
  res.json(books)
})

bookmarkRouter
.route('/bookmarks/:bookId')
.get((req,res)=>{
  const {bookId}=req.params;
  const bookFound = books.filter(book=>book.id===bookId)
  if(bookFound.length===0){
    logger.error(`book with id ${bookId} not found.`);
    res.status(404).json({error:"book not found"})
  }
  res.json(bookFound)

})


.delete((req,res)=>{
  const {bookId} = req.params;
  const index = books.findIndex(book => book.id===bookId)
  if(index===-1){
    logger.error(`book with id${bookId} not found`)
    return res
    .status(404)
    .send("Book not found")
  }
  books.splice(index,1)
  res.send('Deleted')
})

module.exports = bookmarkRouter