var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware")

// COMMENT ROUTES
// NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('comments/new', {campground_id: req.params.id})	
})

// CREATE
router.post('/', middleware.isLoggedIn, function(req, res) { 
	var comment = req.body.comments
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			Comment.create(comment, function(err, addedComment) {
					if(err) {
						req.flash("error", err)
						console.log(err)
					} else {
						addedComment.author.username = req.user.username
						addedComment.author.id = req.user._id
						addedComment.save()
						foundCampground.comments.push(addedComment)
						foundCampground.save()
						req.flash("success", "Thanks for adding your comment!")
						res.redirect('/campgrounds/'+foundCampground._id)
				}
			})			
		}
	})
})

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	//var comment = req.body.comments
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment) {
				if(err) {
					console.log(err)
				} else {
					res.render('comments/edit', {comment: foundComment, campground: foundCampground})
				}
			})
		}
	})
})

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			//console.log("Comment: ", req.body.comments.text)
			var data = {
				text: req.body.comments.text
			}
			Comment.findByIdAndUpdate(req.params.comment_id, data, function(err, foundComment) {
				if(err) {
					console.log(err)
				} else {
					res.redirect('/campgrounds/'+foundCampground._id)
				}
			})
		}
	})
})

							 

// DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err)
		} else {
			Comment.findByIdAndDelete(req.params.comment_id, function(err, foundComment) {
				if(err) {
					console.log(err)
				} else {
					//console.log("Comment deleted")
					res.redirect('/campgrounds/'+foundCampground._id)
				}
			})
		}
	})
})

module.exports = router
