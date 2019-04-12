
process.env.TZ = 'UTC'
const {expect} = require('chai')
const app = require('../src/app')
const knex = require('knex')
const {makeBookmarkArrays}=require('./bookmarks.fixtures')


describe('Bookmarks Endpoints',function(){

  let db
  before('make knex instance',()=>{
    db=knex({
      client:'pg',
      connection:process.env.TEST_DB_URL
    })
    app.set('db',db)
  })
  before('clean the table',()=>db('bookmarks').truncate())
  after('disconnect from db',()=>db.destroy())
  
  afterEach('cleanup',()=>db('bookmarks').truncate())
 
  describe('Get /bookmarks',()=>{
  
   context('Given no bookmarks',() => {  
     it('GET /bookmarks response with 200 and an empty array',()=>{return supertest(app)
    .get('/bookmarks')
    .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
    .expect(200,[])})})
  

  
  context('Given there are bookmarks in the database',()=>{
    const testBookmarks = makeBookmarkArrays()
    beforeEach('insert bookmarks',()=>{
      return db
      .into('bookmarks')
      .insert(testBookmarks)

      
    })
    it('GET /bookmarks response with 200 and all the bookmarks',()=>{
      return supertest(app)
      .get('/bookmarks')
      .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
      .expect(200,testBookmarks)
    })



  })
})
describe.only(`POST Bookmarks`,()=>{
context('create a bookmark',()=>{
  it(`respond with 201 and return the new article `,()=>{
    const newBookmark ={
      title: "title5",
      url: "http://www.google.com",
      description: "desc5",
      rating: 2
    }
    return supertest(app)
      .post('/bookmarks')
      .send(newBookmark)
      .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
      .expect(201)
      .expect(res=>{
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`bookmarks/${res.body.id}`)
      })
      .then(postRes=>{
        supertest(app)
          .get(`/bookmarks/${postRes.body.id}`)
          .expect(postRes.body)
      })

  })
  const requireField = ['title','url','description','rating']
  requireField.forEach(field=>{
    const newBookmark ={
      title: "title",
      url: "http://www.google.com",
      description: "desc",
      rating: 2
    }
    it(`responds with 400 and an error message when the '${field}' is missing`,()=>{
      delete newBookmark[field]
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
        .expect(400,{error:{message:`Missing '${field}' in request body`}})
    })

  })

  const maliciousBookmark = {    
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: 'http://google.com',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating:3
  }
  it(`responds with 201 and posted malicious content`,()=>{
    return supertest(app)
      .post('/bookmarks')
      .send(maliciousBookmark)
      .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
      .expect(201)
      .expect(res=>{
        expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
        expect(res.body.description).to.eql('Bad image <img src=\"https://url.to.file.which/does-not.exist\">. But not <strong>all</strong> bad.')
      })
  })


})  


})

  describe('GET /bookmarks/bookId',()=>{
    context('Given there are no bookmarks in the database',()=>{
      it(`respond with 404`,()=>{
        const bookId = 12345
        return supertest(app)
        .get(`/bookmarks/${bookId}`)
        .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
        .expect(404,{ error: { message: `Bookmark doesn't exist`}})
      })
    })

    context('Given there are bookmarks in the database',()=>{
      const testBookmarks = makeBookmarkArrays()
      beforeEach('insert bookmarks',()=>{
        return db
        .into('bookmarks')
        .insert(testBookmarks)})

      it(`respond with 200,and bookmark with id return`,()=>{
        
        const bookId = 3
        const expectedBookmark = testBookmarks[bookId-1]
        return supertest(app)
        .get(`/bookmarks/${bookId}`)
        .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
        .expect(200,expectedBookmark)
      })
      
    })



  })


})