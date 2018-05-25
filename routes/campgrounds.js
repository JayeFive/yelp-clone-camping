var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");




router.get("/", function(req, res) {
  Campground.find({}, function(err, allCampgrounds){
    if(err) console.log(err);
    else res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
  });
});

// New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Create 
router.post("/", middleware.isLoggedIn, function(req, res) {

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

// Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) console.log(err);
      res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// Update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err) res.redirect("/campgrounds");
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

// Destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) console.log(err);
    else res.redirect("/campgrounds");
  });
});

module.exports = router;