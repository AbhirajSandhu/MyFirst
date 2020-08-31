var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose"),
	Campground 	= require("./models/campgrounds"),
	Comment 	= require("./models/comments"),
	seedDB		= require("./seeds"),
	flash		= require("connect-flash"),	
methodOverride 	= require("method-override"),
	passport 	= require("passport"),
	User		= require("./models/user"),
  LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose");

var commentRoutes	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes 	 = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended : true})); //yaad kro to use body parser
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "Voldmort is female",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());	
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;//we pass current user to everyone
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// currentUser: req.user di lor ni har kise vich paun lai this will do work for all
// this is used to run the loop in header

// seedDB();

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
//   /campgrounds written here no need to include in routes in routes/campgrounds.js

app.get("/landing",function(req, res){
		res.render("landing");
})

// app.listen(3000, function(){
// 	console.log("Yelpcamp ON");
// })
var port = process.env.PORT || 3000;
app.listen(port, function () {
console.log("Server Has Started!");
});