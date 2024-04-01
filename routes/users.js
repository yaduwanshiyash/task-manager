var mongoose = require('mongoose')
var plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/taskManagedrgit")
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