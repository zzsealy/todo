const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// notes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Note'
//     }
//   ],


const TodoListSchema = new Schema({
    userId: String,
    childTodo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ],
    finishRate: String,
    createDateTime: Date,
    closeDateTime: Date,
    canChange: Boolean
})

TodoListSchema.index({ userId: 1 })

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


