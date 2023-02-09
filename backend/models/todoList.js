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


