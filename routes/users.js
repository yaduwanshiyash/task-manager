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
   posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
   }],
   secret: {
    type: String
   },
   picture: {
    type: String,
   },
   


})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema)


// username:String,
// password:String,
// secret:String,
// picture: String 