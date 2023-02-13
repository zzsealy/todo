const mongoose = require('mongoose')


// notes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Note'
//     }
//   ],


const TodoListSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    child_todo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ] 
})


TodoListSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
    }
  })
  
  const TodoList = mongoose.model('TodoList', TodoListSchema)
  
  module.exports = TodoList


