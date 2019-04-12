const express = require('express')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')
const books=[]
const BookmarkService = require('./bookmarks-service')
const xss = require('xss')
const serializeBookmark = bookmark => ({
  id: Number(bookmark.id),
  title: xss(bookmark.title),
  url: xss(bookmark.url),
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
})

bookmarkRouter
.route('/')
.get((req,res,next)=>{
  const knexInstance = req.app.get('db')
  BookmarkService.getAllBooks(knexInstance)
  .then(bookmarks=>{
    res.json(bookmarks.map(serializeBookmark))
  }).catch(next)

  // if(books.length===0){
  //   logger.error(`There is no book in the database`);
  //   return res.status(200).send('there is no bookmark yet')
  // }
  // res.status(200).json(books)
})

.post(bodyParser,(req,res,next)=>{
  const {title,url,description=null,rating=null}=req.body
  const newBookmark = {title,url,description,rating}
  // https://repl.it/@JizongL/Objectkeys-and-Objectentries
    // the above link record a mistake that I made when 
  for (const [key,value] of Object.entries(newBookmark))
   { console.log(value,'test value')
    if(!value){
      return res.status(400).json({
        error:{message:`Missing '${key}' in request body`}
      })
      
    }}
  
    BookmarkService.insertBookmark(
      req.app.get('db'),newBookmark
    )
    .then(bookmark=>{
      res.status(201)
      .location(`bookmarks/${bookmark.id}`)
      .json(serializeBookmark(bookmark))
    })
    .catch(next)
  })

  // if(!url || !title){
    
  //   url?logger.error('user did not supply url'):logger.error('user did not supply title')
    
  //   return res.status(400).json({ "message": "Attributes `title` and `url` required"})
  // }
  

  // if(url.length<=5||url.substring(0,4)!=='http'){
  //   logger.error('user provided invalid url')
  //   return res.status(400).json({"message": "Attribute `url` must be min length 5 and begin http(s)://"})
  // }

  // if(Number(rating) <1 || Number(rating) >5){
  //   logger.error('user provide invalid rating')
  //   return res.status(400).json({ "message": "Attribute `rating` (optional) must be number between 1 and 5"})
  // }
  // const id=uuid()
  // books.push({id,title,url,desc,rating})
  // res.json(books)


bookmarkRouter
.route('/:bookId')
.all((req,res,next)=>{
  
  BookmarkService.getById(
    req.app.get('db'),
    req.params.bookId
  )
  .then(bookmark =>{
    
    if(!bookmark){
      return res.status(404).json(
        {error:{message:`bookmark doesn't exist`}}
      )
    }
    res.bookmark = bookmark
    next()
  })
  .catch(next)
})

.get((req,res,next)=>{

    res.json(serializeBookmark(res.bookmark))
  
  })

  
  // const bookFound = books.filter(book=>book.id===bookId)
  // if(bookFound.length===0){
  //   logger.error(`book with id ${bookId} not found.`);
  //   res.status(404).json({error:"book not found"})
  // }
  // res.json(bookFound)




.delete((req,res,next)=>{
  BookmarkService.deleteBookmark(
    req.app.get('db'),req.params.bookId)
    .then(()=>{
      res.status(204)
      .send('deleted')
      .end()
    })
    .catch(next)
  // const index = books.findIndex(book => book.id===bookId)
  // if(index===-1){
  //   logger.error(`book with id${bookId} not found`)
  //   return res
  //   .status(404)
  //   .send("Book not found")
  // }
  // books.splice(index,1)
  // res.send('Deleted')
})

module.exports = bookmarkRouter