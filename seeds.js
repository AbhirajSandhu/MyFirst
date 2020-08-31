var mongoose 	= require("mongoose"),
	Campground 	= require("./models/campgrounds"),
	Comment 	= require("./models/comments");//

var data = [
	{
		name: "Flower Beach",
		image: "https://i.pinimg.com/originals/1b/82/aa/1b82aa324247b3b4d5d0833c3a264e94.jpg",
		description: "Be aware of breeze!"
	},
	{
		name: "Flower Beach",
		image: "https://cdn.wallpapersafari.com/40/46/ew1LoM.jpg",
		description: "Be aware of breeze!"
	},
	{
		name: "Flower Beach",
		image: "https://wallpaperaccess.com/full/1241154.jpg",
		description: "Be aware of breeze!"
	}
]

function seedDB(){
	//Remove Campgrounds
	Campground.deleteMany({}, function(err){ //Campground.remove()
		if(err){
			console.log(err);
		}
		console.log("All Campgrounds Removed");
	});
	//Add Campgrounds
	data.forEach(function(seed){
		Campground.create(seed, function(err, Campground){
			if(err){
				console.log(err);
			} else{
				console.log("Campround Added");
				//create a comment
				Comment.create({
					text: "Breeze got me high on weed.",
					author: "Homie"
				}, function(err, comment){
					if(err){
						console.log(err);
					} else{
						Campground.comments.push(comment);
						Campground.save();
						console.log("Comment added");
					}
				});
			}
		})
	});
	
	//Add Comments
};

module.exports = seedDB;