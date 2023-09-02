var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    console.log("index.js");
    res.json({ message: "Hello World nodemon" });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
