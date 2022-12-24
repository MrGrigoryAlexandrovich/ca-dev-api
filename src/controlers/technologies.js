const TechnologiesDB = require("../models/technologies");
const { paginateQuery } = require("../utils");

exports.create = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Content can not be emtpy!" });
  }

  const technology = new TechnologiesDB({
    name: req.body.name,
    category: req.body.category,
    logo: req.body.logo,
    page: req.body.page,
  });
  try {
    const data = await technology.save(technology);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.find = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const sort = req.query.sort && {
      [req.query.sort]: req.query.direction === "desc" ? -1 : 1,
    };
    const data = TechnologiesDB.find().sort(sort);
    const result = await paginateQuery(data, req.query.page, req.query.limit);
    return res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      results: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Content can not be emtpy!" });
  }

  const id = req.params.id;

  try {
    const data = await TechnologiesDB.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (!data) {
      return res.status(404).json({
        message: `Technology with id ${id} not exist`,
      });
    }
    return res.json(data);
  } catch (err) {
    return res.status(404).json({
      message: `Cannot update Technology with id ${id}`,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await TechnologiesDB.findByIdAndDelete(id);
    if (data) {
      return res.json({ message: "Technology was deleted successfully" });
    }
    return res.status(404).json({
      message: `Technology with id ${id} not exist`,
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};
