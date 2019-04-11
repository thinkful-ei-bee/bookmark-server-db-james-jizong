
process.env.TZ = 'UTC'
const {expect} = require('chai')
const app = require('../src/app')
const knex = require('knex')
const {makeBookmarkArrays}=require('./bookmarks.fixtures')


describe('Bookmarks Endpoints',function(){
  console.log(process.env.TEST_DB_URL)
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
  
   context('Given no bookmarks',() => {  return supertest(app)
    .get('/bookmarks')
    .set('Authorization',`Bearer ${process.env.API_TOKEN}`)
    .expect(200,[])})
  })
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