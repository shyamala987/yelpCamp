var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [
	{
		name: "Dharmashala",
		image: "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80"
	},
	{
		name: "Badavut Beach Turkey",
		image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
		name: "Arches National Park",
		image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
	}
]
function seedDb() {
	// Remove all campgrounds
	Campground.remove({}, (err, camps) => {
	if(err) {
		console.log(err)
	} else {
		console.log("Removed all campgrounds")
		// Add new campgrounds from data
		data.forEach(function(seed) {
			Campground.create(seed, (err, campground) => {
				if(err) {
					console.log(err)
				} else {
					console.log("Campground created")
					Comment.create({
						text: "Great views all around! Hike is difficult but worth it!",
						author: "SV"
					}, (err, cmt) => {
						if(err) {
							console.log(err)
						} else {
							console.log("Added comment")
							campground.comments.push(cmt)
							campground.save((err, ct) => {
								if(err) {
									console.log(err)
								} else {
									console.log("Comment saved")
								}
							})
							}
						})
					}
				})
			})
		}
	})
}

module.exports = seedDb