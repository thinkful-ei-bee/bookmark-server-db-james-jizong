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
  updateBookmark(knex,id,bookmarkToUpdate){
    return knex('bookmarks')
    .where({id})
    .update(bookmarkToUpdate)
  },
  insertBookmark(knex,newBookmark){
    return knex
    .insert(newBookmark)
    .into('bookmarks')
    .returning('*')

    .then(row=>{
      
      return row[0]
    })
  },
  deleteBookmark(knex,id){
    return knex
          .from('bookmarks')
          .where({id}).delete()
  }
}

module.exports = 
  BookmarkService
