const db = require("../models");
const express = require("express");
const router = express.Router();
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const passport = require("../config/passport");

router.get("/", (req, res) => res.render("index"));

router.get("/signup", (req, res) => {
  // If the user already has an account send them to the login page
  if (req.user) {
    res.redirect("login");
  }
  res.render("signup");
});

router.get("/login", (req, res) => {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect("members");
  }
  res.render("login");
});

// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
router.get("/members", isAuthenticated, (req, res) => {
  res.render("members");
});

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), (req, res) => {
  // Sending back a password, even a hashed password, isn't a good idea
  res.json({
    email: req.user.email,
    id: req.user.id,
  });
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", (req, res) => {
  db.User.create({
    email: req.body.email,
    password: req.body.password,
  })
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

// Route for logging user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Route for getting some data about our user to be used client side
router.get("/api/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  }
});

// Route for inserting ingredient to Ingredients table with specific user
router.post("/api/ingredients", (req, res) => {
  console.log(req.body);
  db.Ingredient.create(req.body).then((dbIngredient) => res.json(dbIngredient));
});

// Route for inserting recipeID, title to Recipe table with specific user
router.post("/api/recipes", (req, res) => {
  console.log(req.body);
  db.Recipe.create(req.body).then((dbRecipe) => res.json(dbRecipe));
});

// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
router.get("/account", isAuthenticated, (req, res) => {
  res.render("account");
});

// GET route for getting all of the Ingredients
router.get("/api/ingredients", async (req, res) => {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.User
  const ingredients = await db.Ingredient.findAll({
    where: {
      UserId: req.user.id,
    },
    include: [{ model: db.User, attributes: ["id", "email"] }],
  });
  res.json(ingredients);
});

// GET route for getting all of the recipes
router.get("/api/recipes", async (req, res) => {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.User
  const recipes = await db.Recipe.findAll({
    where: {
      UserId: req.user.id,
    },
    include: [{ model: db.User, attributes: ["id", "email"] }],
  });
  res.json(recipes);
});
module.exports = router;
