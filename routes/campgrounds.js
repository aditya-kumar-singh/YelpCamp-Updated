var express=require("express")
var router=express.Router()
//Show all capgrounds
var Campground =   require("../models/campground")
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err)
            console.log("Something Wrong")
            
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
       
})

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price
    var image=req.body.image;
    var desc=req.body.description;
    
    
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newCampground={name:name,image:image,description:desc,author:author}
    
  //  console.log(req.user)
    
    //create a new campground and save it to  db
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err)
        }
        else{
            //redirect back to campgrounds
            console.log(newlyCreated)
             res.redirect("/campgrounds")
        }
    })
    //campgrounds.push(newCampground)
    
   
    //res.send("You are in post route")
})
//new create campground
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new")
    
})
//shows more info abt campground
router.get("/:id",function(req, res) {
    //find  the campground with provided id
    
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }
        else{
            ///render show
            console.log(foundCampground)
            res.render("campgrounds/show",{campground:foundCampground})
        }
    })
   
    //res.send("This will be show page ")
})

            //EDIT ROUTE
            router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
                //res.send("EDit Campgrounds")
                
                //is user logged in 
               
            Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground:foundCampground})
                
            
                
            })
              })
   
   
   
//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find & update the correcr campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
        res.redirect("/campground")
            
        }
        else{
            res.redirect("/campgrounds/" +req.params.id)
        }
    })
    //redirect somewhere(show page)
    
})



//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   // res.send("Delete that")
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds")
       }
       else{
           res.redirect("/campgrounds")
       }
   })
})

//Middleware



//another middleware

             
            //otherwise redirect
            //if not redirect
 


module.exports=router