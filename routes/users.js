var mongoose = require('mongoose')
var plm = require('passport-local-mongoose')

mongoose.connect("mongodb+srv://yash123:yash12@cluster0.qdqpirv.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log('Connected!'));

const userSchema = mongoose.Schema({
   username: {
    type: String,
    required: true,
    unique: true,
   },
   password: {
    type: String,
   },
   task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task'
   }],
   picture: {
    type: String,
   },
   fav: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
  }],
  Incomplete: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
  }],
  complete: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
  }],
   


})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema)