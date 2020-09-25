var express = require("express"),
	router = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	middleware = require("../middleware")

router.get('/', function(req, res) {
	Campground.find({}, function(err, camps) {
		if (err) {
			console.log("Error finding any campground")
		}
		else {
			res.render('campgrounds/index', {campgrounds: camps})
		}
	})
})

router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/newCamp')	
})

router.post('/', middleware.isLoggedIn, function(req, res) {
	var campName = req.body.campname,
		campPrice = req.body.campprice,
		campImg = req.body.campimg,
		campDesc = req.body.campdesc,
		newCampground = {name: campName, price: campPrice, image: campImg, description: campDesc}
		
	Campground.create(newCampground, function(err, newCampSite) {
		if (err) {
			console.log("something went wrong")
			console.log(err)
		}
		else {
			// add user details
			newCampSite.author.username = req.user.username
			newCampSite.author.id = req.user._id
			console.log("New camp site was added by" + newCampSite.author.username)
			newCampSite.save()
			res.redirect('/campgrounds')
		}
	})	
})

// SHOW TEMPLATE
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/show', {campground: foundCampground})
		}
	})
})

// EDIT 
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err)
		} else {
				//res.send("You are not authorized to edit this campground.")
				res.render('campgrounds/edit', {campground: foundCampground})
		}
	})
})

// UPDATE 
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//req.body.description.body = req.sanitize(req.body.description.body)
	//console.log("name"+req.body.campground.campname)
	console.log("I am in put method...")
	var data = {
		name: req.body.campground.campname,
		price: req.body.campground.campprice,
		image: req.body.campground.campimg,
		description: req.body.campground.campdesc
			}
	Campground.findByIdAndUpdate(req.params.id, data, function(err, foundCampground) {
		if(err) {
			console.log(err)
		} else {
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

// DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//req.body.description.body = req.sanitize(req.body.description.body)
	//console.log("name"+req.body.campground.campname)
	Campground.findByIdAndDelete(req.params.id, function(err, deletedCampground) {
		if(err) {
			console.log(err)
		} else {
			res.redirect('/campgrounds')
		}
	})
})

module.exports = router