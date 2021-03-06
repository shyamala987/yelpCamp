var express = require("express")
var router = express.Router({mergeParams: true})
var passport = require("passport")

var User = require("../models/user")

router.get('/', function(req, res) {
	res.render('home')
})

// USER ROUTES
router.get('/register', function(req, res) {
	res.render('users/register')
})
//handling user sign up
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.render('users/register');
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success", "Welcome to YelpCamp, "+req.body.username + "!")
           res.redirect('/campgrounds')
        });
    });
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
	res.render("users/login"); 
});
//login logic
//middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

router.get("/logout", function(req, res){
	req.flash("success", "See you around. Come visit us again!")
    req.logout();
    res.redirect("/");
});

module.exports = router
