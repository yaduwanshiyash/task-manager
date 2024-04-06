var express = require('express');
var router = express.Router();
const userModel = require("./users")
const taskModel = require("./task")
const passport = require("passport")
const upload = require("./multer")
const {route} = require('../app')
const cloudinary = require('../utils/cloudnary');

const localStrategy = require("passport-local")

passport.use(new localStrategy(userModel.authenticate()))


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  try{
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    res.render('profile', {user});
  } catch(error){
    next(error);
  }
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/register',function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    picture: req.body.picture
  })

  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/mytask')
    })
  })
})


router.get("/like/task/:id", isLoggedIn, async function(req,res){
  try{
    const user = await userModel.findOne({ username: req.session.passport.user})
    const task = await taskModel.findOne({_id: req.params.id})
  
    if(task.likes.indexOf(task._id) == -1){
      task.likes.push(user._id)
    }
    else{
      task.likes.splice(task.likes.indexOf(user._id), 1)
    }
    if(user.fav.indexOf(task._id) == -1){
      user.fav.push(task._id)
    }
    else{
      user.fav.splice(user.fav.indexOf(task._id), 1)
    }
  
    await task.save();
    await user.save();
    res.redirect('back')
  } catch(error){
    next(error);
  }
})
router.get("/complete/task/:id", isLoggedIn, async function(req,res){
  try{
    const user = await userModel.findOne({ username: req.session.passport.user})
    const task = await taskModel.findOne({_id: req.params.id})
  
    if(user.complete.indexOf(task._id) == -1){
      user.complete.push(task._id)
    }
    else{
      user.complete.splice(user.complete.indexOf(task._id), 1)
    }
  
    await user.save();
    res.redirect('back')
  } catch(error){
    next(error);
  }
})
router.get("/incomplete/task/:id", isLoggedIn, async function(req,res){
  try{
    const user = await userModel.findOne({ username: req.session.passport.user})
    const task = await taskModel.findOne({_id: req.params.id})
  
    if(user.incomplete.indexOf(task._id) == -1){
      user.incomplete.push(task._id)
    }
    else{
      user.incomplete.splice(user.incomplete.indexOf(task._id), 1)
    }
  
    await user.save();
    res.redirect('back')
  } catch(error){
    next(error);
  }
})


router.post('/login',passport.authenticate("local",{
  successRedirect: "/mytask",
  failureRedirect: "/index"
}),function(req,res){})

// router.post('/upload',isLoggedIn, upload.single("file"), async function(req, res, next) {
//   if(!req.file){
//     return res.status(404).send("no files were given")
//   }
//   const user = await userModel.findOne({username: req.session.passport.user});
//     const post = await postModel.create({
//     image: req.file.filename,
//     imageText: req.body.imageText,
//     user: user._id
//   })

//   user.posts.push(post._id);
//   await user.save()
//   res.redirect("/profile")

// });


router.post('/dp', isLoggedIn ,upload.single('image'), async function (req, res, next) {
  try{
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    let imageupload = await userModel.findOne({username:req.session.passport.user})
    imageupload.picture = result.secure_url,
    await imageupload.save()
    res.redirect('/mytask');
  }catch(error){
    next(error);
  }
});


router.post('/createtask', async function(req, res) {
  try{
    const user = await userModel.findOne({username: req.session.passport.user})
    var task = await taskModel.create({
      title: req.body.title,
      task: req.body.task,
      description: req.body.description,
      deadline: new Date(req.body.deadline),
    user: user._id
    })
    user.task.push(task._id)
    await user.save();
  res.redirect('/mytask');
  } catch(error){
    next(error);
  }
});

router.get("/delete/task/:id", isLoggedIn, async function(req, res) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const task = await taskModel.findOne({ _id: req.params.id });

    if (!user || !task) {
      return res.status(404).send("User or post not found");
    }

    // Remove post reference from user's posts array
    const taskIndex = user.task.indexOf(task._id);
    if (taskIndex !== -1) {
      user.task.splice(taskIndex, 1);
    }

    // Save user changes
    await user.save();

   

    // Remove post document
    await taskModel.deleteOne({ _id: req.params.id });

    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


router.get('/mytask',isLoggedIn, async function(req,res,next){
  try{
    const user = await userModel.findOne({
      username: req.session.passport.user
    }).populate('task')
    res.render('alltask',{user}) 
  } catch(error){
    next(error);
  }
})

router.get('/important',isLoggedIn, async function(req,res,next){
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user
    }).populate('fav')
    res.render('important',{user})  
  } catch (error) {
    next(error);
  }
})

router.get('/completed',isLoggedIn, async function(req,res,next){
  try{
    const user = await userModel.findOne({
      username: req.session.passport.user
    }).populate('complete')
    res.render('completed',{user})  
  } catch(error){
    next(error);
  }
})


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
