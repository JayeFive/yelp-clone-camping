var express = require("express"),
    app = express();
   
app.set("view engine", "ejs");
   
   
    
app.get("/", function(req, res) {
  res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
  var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c80f31bb4040015d51db663252fbd30&auto=format&fit=crop&w=500&q=60"},  
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=500&q=60"},  
    {name: "Goat Haunt", image: "https://images.unsplash.com/photo-1465695954255-a262b0f57b40?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=06d92f647a2937af54f658e199c3d990&auto=format&fit=crop&w=500&q=60"}    
  ];
  
  res.render("campgrounds", {campgrounds: campgrounds});
});
    
    
    
    
app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server has started!");
});