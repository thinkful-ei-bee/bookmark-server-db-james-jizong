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
  insertBookmark(knex,newBookmark){
    return knex
    .insert(newBookmark)
    .into('bookmarks')
    .returning('*')

    .then(row=>{
      console.log(row)
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
