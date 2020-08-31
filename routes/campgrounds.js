var express = require("express");
var router 	= express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware"); //index.js is special name no need to mention

router.get("/",function(req, res){
	//get all campgrounds from db and then render
	Campground.find({},function(err, allcampgd){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", { campgrounds : allcampgd, currentUser: req.user});
		}
	})
	//without databases
	// res.render("campgrounds", { campgrounds : campgrounds });
})

//CREATE add campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// res.send("working") //to check in postman
	var name  = req.body.name
	var image = req.body.image
	var desc  = req.body.description
	var price = req.body.price
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name : name, image : image,price:price, description : desc, author : author}
	//create a new campground and save it in DB
	Campground.create(newCampground,function(err, newcampgd){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
}	
	})
	//this pushes new campground into array
	// campgrounds.push(newCampground)
	
})

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
})

router.get("/:id", function(req, res){
	//find the campground with provided provided
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){//.id can be .anything
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show", {campground : foundCampground});
		}
	})
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		//findById tells info of clicked campground and help in edits
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		})
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// rather than doing var data = { name = req.body.name, 
	//nest all together in array in edit.ejs using name=campground[name]
	// here down then u have to use data instead req.body.campground
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, UpdatedCamp){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id )
			//instead of re.params.id UpdatedCamp.id can be used
		}
	})
	//redirect somewhere
})

//DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		} else{
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router;