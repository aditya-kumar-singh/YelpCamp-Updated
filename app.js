var express =     require("express"),
     app    =     express(),
 bodyparser =     require("body-parser"),
  mongoose  =     require("mongoose"),
  flash     =     require("connect-flash"),
  passport  =     require("passport"),  
  
  User      =     require("./models/user"),
  LocalStrategy = require("passport-local"),
  methodOverride= require("method-override"),
  Campground =    require("./models/campground"),
  Comment    =    require("./models/comment"),
  seedDB     =    require("./seeds")
  
  //requiring routes
 
 var commentRoutes=require("./routes/comments"),
  campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes    =require("./routes/index")
   
   
   //mongoose.connect("mongodb://localhost/yelp_camp_v6")
   mongoose.connect("mongodb://Aditya:kumarsingh1234@ds137801.mlab.com:37801/yelpcamp")
   //mongodb://Aditya:kumarsingh1234@ds137801.mlab.com:37801/yelpcamp
   
   app.use(bodyparser.urlencoded({extended:true}))
   
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
//console.log(__dirname)

// seedDB();//seed the database


//flash
app.use(flash())

//Passport configuration
app.use(require("express-session")({
    
    secret:"Once again I am the best",
    resave:false,
    saveUninitialized:false
    
}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    res.locals.currentUser=req.user
    /*res.locals.message=req.flash("error")*/
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//Schema Setup

//////////campground logic moved to models////////////////////////////////////////




/*Campground.create(
    {
    
        name:"Nanda Parbat",
        image:"https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description:"This is a Nanda Parbat have fun"
        
    },
    function(err,campground){
        if(err){
            console.log("Error")
            console.log("Something is Wrong")
        }
        
        else{
            console.log(campground)
            console.log("New Campground Added")
        }
    }
    )
*/


app.use(indexRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp Server has Started")
})