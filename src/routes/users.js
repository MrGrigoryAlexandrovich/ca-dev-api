const express = require("express");
const { verification } = require("../utils");
const usersController = require("../controlers/users");

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", usersController.create);
router.get("/", verification, usersController.find);
router.put("/:id", verification, usersController.update);
router.delete("/:id", verification, usersController.delete);
router.post("/login", usersController.login);

module.exports = router;
