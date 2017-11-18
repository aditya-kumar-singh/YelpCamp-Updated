////All the middleware goes here 

var Campground=require("../models/campground")
var Comment=require("../models/comment")
var middlewareobj={}
middlewareobj.checkCampgroundOwnership=function(req,res,next)
    {
        if(req.isAuthenticated())
        {
                   
                        Campground.findById(req.params.id,function(err,foundCampground){
                        if(err){
                            req.flash("error","Campground not found")
                            res.redirect("back")
                        }
                        else{
                             //does user own the campground
                            
                             if(foundCampground.author.id.equals(req.user._id)){
                           // res.render("campgrounds/edit",{campground:foundCampground}
                           next()
                             }
                        
                            else{
                                req.flash("error","Campground not found")
                                //res.send("You don't have permission to edit this")
                                res.redirect("back")
                            }
                        }
                        
                    })
                        
                    }
                    else{
                       // console.log("Log in FIrst")
                       req.flash("error","You need to be logged in to do that!")
                        res.redirect("back")
                    }
            }
    
        

middlewareobj.checkCommentOwnership=function (req,res,next){
    
   if(req.isAuthenticated()){
               
            Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back")
            }
            else{
                 //does user own the comment
                
                 if(foundComment.author.id.equals(req.user._id)){
               
               next()
                 }
            
                else{
                    req.flash("error","You don't have permission to edit this")
                    //res.send("You don't have permission to edit this")
                    res.redirect("back")
                }
            }
            
        })
            
        }
        else{
           // console.log("Log in FIrst")
           req.flash("error","You need to be logged in to do that!")
            res.redirect("back")
        }
}


    
middlewareobj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next()
        
    }
    req.flash("error","You need to be logged in to do that!")
    res.redirect("/login")
}

   

module.exports=middlewareobj
