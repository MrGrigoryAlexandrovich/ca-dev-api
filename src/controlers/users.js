const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UsersDB = require("../models/users");
const { paginateQuery } = require("../utils");

exports.create = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Content can not be emtpy!" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new UsersDB({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    date_of_birth: req.body.date_of_birth,
  });
  try {
    const data = await user.save(user);
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
    const data = UsersDB.find().sort(sort);
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
    const data = await UsersDB.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });

    if (!data) {
      return res.status(404).json({
        message: `User with id ${id} not exist`,
      });
    }
    return res.json(data);
  } catch (err) {
    return res.status(404).json({
      message: `Cannot update user with id ${id}`,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await UsersDB.findByIdAndDelete(id);
    if (data) {
      return res.json({ message: "User was deleted successfully" });
    }
    return res.status(404).json({
      message: `User with id ${id} not exist`,
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UsersDB.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: `Cannot find user`,
      });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      if (result) {
        const token = jwt.sign(user.toJSON(), process.env.TOKEN);
        if (!user.admin_level) {
          return res.status(403).json({
            message:
              "You are not allowed. Contact your administrator for more information",
          });
        }
        return res.json({
          token,
        });
      }
      return res.status(400).json({
        message: "Incorrect password",
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
