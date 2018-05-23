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
router.get("/new", function(req, res) {
  res.render("campgrounds/new");
});

// Create 
router.post("/", function(req, res) {
  
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};

  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("");
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