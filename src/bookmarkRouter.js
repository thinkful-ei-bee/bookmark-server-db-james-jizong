const express = require('express')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
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
    }
    
  }
    if(rating>5||rating<1){
      return res.status(400).json({
        error:{message:`rating must be between 1 and 5`}
      })
    }
  
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



.delete((req,res,next)=>{
  BookmarkService.deleteBookmark(
    req.app.get('db'),req.params.bookId)
    .then(()=>{
      res.status(204)
      .send('deleted')
      .end()
    })
    .catch(next)
})

module.exports = bookmarkRouter