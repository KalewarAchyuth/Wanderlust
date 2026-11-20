const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(session({
    secret: process.env.SESSION_SECRET || "replace-this-wanderlust-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => res.render("users/signup"));

app.post("/signup", async (req, res) => {
    try {
        const { displayName, email, password } = req.body;
        if (!displayName || !email || !password || password.length < 8) {
            req.flash("error", "Please complete every field and use a password with at least 8 characters.");
            return res.redirect("/signup");
        }
        const user = new User({ displayName, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return res.redirect("/login");
            req.flash("success", `Welcome to Wanderlust, ${registeredUser.displayName}!`);
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message || "We couldn't create your account. Please try again.");
        res.redirect("/signup");
    }
});

app.get("/login", (req, res) => res.render("users/login"));
app.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
    req.flash("success", `Welcome back, ${req.user.displayName}!`);
    res.redirect("/listings");
});

app.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have been logged out.");
        res.redirect("/");
    });
});

//INDEX route
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });    
});


//NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//SHOW route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});

//CREATE route
app.post("/listings", async(req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
});

// EDIT route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});

//UPDATE route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});

//DELETE route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


app.listen(8080, () => {
    console.log("Server listening on port 8080");
});




// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         image: {
//             filename: "listingimage",
//             url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"
//         },
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");

//     res.send("successful testing");
// });
