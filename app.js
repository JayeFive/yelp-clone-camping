var express          =   require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
       
    User             = require("./models/user"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    
    //Requiring Routes
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index"),

    seedDB           = require("./seeds");

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

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Listener //
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server has started!");
});