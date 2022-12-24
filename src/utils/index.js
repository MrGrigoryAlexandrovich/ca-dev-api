const jwt = require("jsonwebtoken");

const paginateQuery = async (mongoQuery, page, limit) => {
  const startIndex = (page - 1) * limit;
  const results = await mongoQuery.find().limit(limit).skip(startIndex).exec();
  return results;
};

const verification = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user.admin_level) {
      if (!user.admin_level) {
        return res.status(403).json({
          message:
            "You are not allowed. Contact your administrator for more information",
        });
      }
    }
    req.user = user;
    next();
  });
};

const roundToDecimals = (value, decimal) => parseFloat(value.toFixed(decimal));

module.exports = {
  paginateQuery,
  verification,
  roundToDecimals,
};
