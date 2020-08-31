const express = require("express");
const router = express.Router();
const request = require("request");
const apiKey = process.env.API_KEY;

// eslint-disable-next-line no-unused-vars
router.get("/recipes/findByIngredients", (req, res) => {
  const query = req.query.search;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&apiKey=${apiKey}`;
  request(url, (err, resp, body) => {
    body = JSON.parse(body);
    res.json(body);
  });
});

router.get("/recipes/analyzedInstructions", (req, res) => {
  const id = req.query.search;
  const url = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?&apiKey=${apiKey}`;
  request(url, (err, resp, body) => {
    body = JSON.parse(body);
    res.json(body);
  });
});

module.exports = router;
