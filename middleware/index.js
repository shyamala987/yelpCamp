var Campground = require("../models/campground"),
	Comment    = require("../models/comment")
var middlewareObj = {
	checkCampgroundOwnership : function(req, res, next) { 
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground) {
				if(err) {
					console.log(err)
				} else {
						if(foundCampground.author.id.equals(req.user._id)) {
							next()
						} else {
							req.flash("error", "You are not authorized to edit this campground!")
							res.redirect("back")
						}
					}
				})
			} else {
				req.flash("error", "Please login first!")
				res.redirect('/login')
			}
	},
	checkCommentOwnership : function(req, res, next) {
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground) {
				if(err) {
					console.log(err)
				} else {
					Comment.findById(req.params.comment_id, function(err, foundComment) {
						if(err) {
							console.log(err)
							} else {
							//console.log("Comment deleted")
							if(foundComment.author.id.equals(req.user._id)) {
								next()
							} else {
								req.flash("error", "You are not authorized to change this comment.")
								res.redirect("back")
								}
							}
					})
				}
			})
		} else {
			res.redirect('/login')
		}
	},
	isLoggedIn : function(req, res, next) {
			if (req.isAuthenticated()) {
				return next()
			} else {
				req.flash("error", "You need to log in first.")
				res.redirect('/login')
			}
		}
	}

module.exports = middlewareObj
