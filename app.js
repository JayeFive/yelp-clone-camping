var express       =   require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    
    User          = require("./models/user"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    seedDB        = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();
   
//Passport config
app.use(require("express-session")({
  secret: "It doesn't really matter",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// ROUTES //
app.get("/", function(req, res) {
  res.render("landing"); 
});

// Index
app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allCampgrounds){
    if(err) console.log(err);
    else res.render("campgrounds/index", {campgrounds: allCampgrounds});
  })
});

// New
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new")
});

// Create 
app.post("/campgrounds", function(req, res) {
  
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};

  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  })
});

// Show
app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) console.log(err);
    else res.render("campgrounds/show", {campground: foundCampground});
  });
});



// New Comment
app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err) console.log(err);
    else res.render("comments/new", {campground: campground});
  });
});

// Create Comment
app.post("/campgrounds/:id/comments", function(req, res) {
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err) console.log(err);
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});


// Auth routes
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err)
      res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});


// Listener //
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server has started!");
});