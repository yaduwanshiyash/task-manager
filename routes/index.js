var express = require('express');
var router = express.Router();
const userModel = require("./users")
const taskModel = require("./task")
const passport = require("passport")
const upload = require("./multer")
const {route} = require('../app')

const localStrategy = require("passport-local")

passport.use(new localStrategy(userModel.authenticate()))


router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('profile', {user});
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.post('/register',function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
    picture: req.body.picture
  })

  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
})





router.post('/login',passport.authenticate("local",{
  successRedirect: "/mytask",
  failureRedirect: "/index"
}),function(req,res){})

router.post('/upload',isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given")
  }
  const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.imageText,
    user: user._id
  })

  user.posts.push(post._id);
  await user.save()
  res.redirect("/profile")

});


router.post('/dp', isLoggedIn ,upload.single('image'), async function (req, res, next) {
  let imageupload = await userModel.findOne({username:req.session.passport.user})
  imageupload.picture = req.file.filename,
  await imageupload.save()
  res.redirect('/profile');
});



router.post('/createtask', function(req, res) {
    var taskdata = taskModel.create({
      title: req.body.title,
      task: req.body.task
    })
  res.redirect('/alltask',{taskdata});
});

// router.post('/createtask', isLoggedIn, async function(req, res) {
//   const user = await userModel.findOne({username: req.session.passport.user});
//   const taskdata = await taskModel.create({
//     title: req.body.title,
//     task: req.body.task,
//     user: user._id
//   });
//   user.post.push(post._id);
//   await user.save();
//   res.redirect('/alltask',{taskdata});
// });


router.get('/mytask',isLoggedIn, async function(req,res,next){
  var alltask = await taskModel.find()
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('alltask',{alltask,user})  
})



// router.get('/mytask', isLoggedIn, async function(req, res, next){
//   var alltask = await taskModel.find({ user: req.user._id });
//   res.render('alltask', { alltask, user: req.user });
// });


router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err)return next(err);
    res.redirect("/")
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}

module.exports = router;
