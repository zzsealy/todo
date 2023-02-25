const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const TodoSchema = new Schema({
    content: String,
    isFinish: Boolean,
    createDateTime: Date,
})


TodoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
    }
  })
  
  const Todo = mongoose.model('Todo', TodoSchema)
  
  module.exports = Todo