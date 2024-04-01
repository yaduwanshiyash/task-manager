var mongoose = require('mongoose')


const taskSchema = mongoose.Schema({
    title: {
        type:String,
    },
    task: {
        type: String
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
})


module.exports = mongoose.model("task",taskSchema)
