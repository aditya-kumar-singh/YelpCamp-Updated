var express=require("express")
var router=express.Router({mergeParams: true})
var Campground =   require("../models/campground")
var Comment    =   require("../models/comment")
var middleware = require("../middleware");
//===========================================Comments ROUTE=======================================//

//comments new
router.get("/new",middleware.isLoggedIn, function(req, res) {
    // find campground by id
    console.log(req.user)
    Campground.findById(req.params.id, function(err, campground)     
    {
        if(err){
          console.log(err);
        } 
        else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//comments create
  router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Something Went Wrong!")
               console.log(err);
           } else {
               //add username 
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
              // console.log("new user" + req.user.username)
               //save comment
               comment.save();
               console.log(comment)
               req.flash("success","Successfully added the comment!!")
               
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    //res.send("!!!!!!!!!!!!!Edit route!!!!!!!!!!!!!!!!!")
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if (err){
            res.redirect("back")
        }
        else{
            res.render("comment/edit",{campground_id:req.params.id, comment:foundComment})
        }
    })
    
    //res.render("comments/edit",{campground_id:req.params.id})
})


// comments update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
          req.flash("success","Comment Deleted")
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});




//Middleware



///another middleware 

module.exports=router