var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
   
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
   
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill", 
//     image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c80f31bb4040015d51db663252fbd30&auto=format&fit=crop&w=500&q=60",
//     description: "this place kicks ass"
//   }, function(err, campground){
//     if(err) console.log(err);
//     else console.log("Newly created campground: " + campground);
//   }
// );

// ROUTES //
app.get("/", function(req, res) {
  res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
  
  Campground.find({}, function(err, allCampgrounds){
    if(err) console.log(err);
    else res.render("index", {campgrounds: allCampgrounds});
  })
});
    
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

app.get("/campgrounds/new", function(req, res) {
  res.render("new")
});

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err) console.log(err);
    else res.render("show", {campground: foundCampground});
  });
});

    
// Listener //
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server has started!");
});