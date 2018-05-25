var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground");

router.get("/", function(req, res) {
  Campground.find({}, function(err, allCampgrounds){
    if(err) console.log(err);
    else res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
  });
});

// New
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Create 
router.post("/", isLoggedIn, function(req, res) {

  Campground.create(req.body.campground, function(err, newCampground) {
    if(err) {
      console.log(err);
    } else {
      newCampground.author.id = req.user._id;
      newCampground.author.username = req.user.username;
      newCampground.save();
      res.redirect("/campgrounds/" + newCampground.id);
    }
  });
});

// Show
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) console.log(err);
    else res.render("campgrounds/show", {campground: foundCampground});
  });
});

module.exports = router;


//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}