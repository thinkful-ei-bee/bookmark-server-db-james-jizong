const BookmarkService ={
  getAllBooks(knex){
    return knex
    .select('*')
    .from('bookmarks')
  },

  getById(knex,id){
    return knex
    .select('*')
    .from('bookmarks')
    .where('id',id)
    .first()
    
  },
}

module.exports = 
  BookmarkService
