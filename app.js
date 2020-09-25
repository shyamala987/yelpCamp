var express 			  	= require("express"),
	app 				  	= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	flash 					= require("connect-flash"),
	seedDb 					= require("./seeds"),
	passport              	= require("passport"),
	LocalStrategy         	= require("passport-local"),
    passportLocalMongoose 	= require("passport-local-mongoose"),
	methodOverride 			= require("method-override")
	

var Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(function() {console.log('Connected to DB!')})
.catch(function(error) {console.log(error.message)});

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname+"/public"))
//seedDb()
app.use(methodOverride("_method"))
app.use(flash())

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Bitlocker phrase longer version",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	res.locals.flashError = req.flash("error")
	res.locals.flashSuccess = req.flash("success")
	next()
})

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)


//Campground.update({name: 'Badavut Beach Turkey'}, {$set: {description: "Turking music? Turkish food? Turkish Thanksgiving? Take my campground!"}})
//var campgrounds = [
		//{name: "Dharmashala", image: "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80"},
        //{name: "Badavut Beach Turkey", image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
        //{name: "Arches National Park", image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"},
        //{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        //{name: "Manolo Fortich", image: "https://images.unsplash.com/photo-1552522060-ab53cefef28e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"},
        //{name: "Hlid Cottages", image: "https://images.unsplash.com/photo-1505735754789-3404132203ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
        //{name: "Korlai", image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
//		{name: "Joshua Tree NP", image: "https://images.unsplash.com/photo-1581294928308-996bf276ed29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"},
//		{name: "Sunset Campground Hume", image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"}
//	]

app.listen(process.env.PORT || 3000, function() {
	console.log('Yelp Camp has now started')
})