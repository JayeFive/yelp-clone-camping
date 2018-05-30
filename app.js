var express          = require("express"),
    app              = express(),
    flash            = require("connect-flash"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
       
    User             = require("./models/user"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    
    //Requiring Routes
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index"),

    seedDB           = require("./seeds");

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://johnE:Samsung9009@ds239930.mlab.com:39930/yelp-camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Listener //
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server has started!");
});