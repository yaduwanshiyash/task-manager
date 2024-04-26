var mongoose = require('mongoose')


const taskSchema = mongoose.Schema({
    title: {
        type:String,
        required: true,
        unique: true
    },
    task: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    createAt: {
        type: Date,
        default: Date.now,
    },
    deadline: {
        type: Date,
        required: true
      }
})


module.exports = mongoose.model("task",taskSchema)
