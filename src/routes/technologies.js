const express = require("express");
const { verification } = require("../utils");
const technologiesControler = require("../controlers/technologies");

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/", verification, technologiesControler.create);
router.get("/", technologiesControler.find);
router.put("/:id", verification, technologiesControler.update);
router.delete("/:id", verification, technologiesControler.delete);

module.exports = router;
