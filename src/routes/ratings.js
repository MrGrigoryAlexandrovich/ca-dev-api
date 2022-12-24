const express = require("express");
const { verification } = require("../utils");
const ratingController = require("../controlers/ratings");

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", ratingController.create);
router.get("/", verification, ratingController.find);

module.exports = router;
