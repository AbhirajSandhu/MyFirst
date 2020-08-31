//all the middlewares go here
var middlewareObj = {};

var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is user logged in
	if(req.isAuthenticated()){
		//findById tells info of clicked campground and help in edits
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground Not Found!");
				res.redirect("back");
			} else{
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "Permission Denied!");
					res.redirect("back");
				}
			}
		})
	}	else{
		req.flash("error", "You are not logged in!");
		res.redirect("back")
	}
} 

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in
	if(req.isAuthenticated()){
		//findById tells info of clicked comment and help in edits
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You need to be logged!");
					res.redirect("back");
				}
			}
		})
	}	else{
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "You are not logged in!");
	res.redirect("/login");
};


module.exports = middlewareObj;