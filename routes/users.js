require('dotenv').config();
var mongoose = require('mongoose')
var plm = require('passport-local-mongoose')

mongoose.connect(process.env.MONGO_URL)
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
   email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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