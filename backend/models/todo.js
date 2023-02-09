const mongoose = require('mongoose')




const TodoSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        is_finish: Boolean
    }
})