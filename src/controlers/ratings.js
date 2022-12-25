const moment = require("moment");
const RatingsDB = require("../models/ratings");
const { roundToDecimals, paginateQuery } = require("../utils");

exports.create = async (req, res) => {
  const validValue = req.body.value > 0 && req.body.value < 6;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Content can not be emtpy!" });
  }

  if (!validValue) {
    return res
      .status(400)
      .json({ message: "Allowed rating is between 1 and 5!" });
  }

  const ratings = ["Very Bad", "Bad", "Good", "Very Good", "Excellent"];

  const rating = new RatingsDB({
    value: req.body.value,
    rating: ratings[req.body.value - 1],
  });
  try {
    const data = await rating.save(rating);
    req.io.emit("vote");
    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.find = async (req, res) => {
  const query = [
    {
      $group: {
        _id: {
          rating: "$rating",
          value: "$value",
        },
        number: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        rating: "$_id.rating",
        value: "$_id.value",
        number: "$number",
      },
    },
  ];

  const ratingByDatesQuery = [
    {
      $project: {
        value: 1,
        created_at: 1,
        month: {
          $month: "$created_at",
        },
        year: {
          $year: "$created_at",
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        created_at: {
          $first: "$created_at",
        },
        votes: {
          $push: "$value",
        },
      },
    },
    {
      $project: {
        _id: 0,
        average: {
          $avg: "$votes",
        },
        created_at: "$created_at",
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
  try {
    const data = await RatingsDB.aggregate(query);
    const ratingByDate = await RatingsDB.aggregate(ratingByDatesQuery);
    const getAllVotes = RatingsDB.find().sort({
      _id: -1,
    });
    const allVotes = await paginateQuery(
      getAllVotes,
      req.query.page,
      req.query.limit
    );

    const ratings = [
      {
        rating: "Very Bad",
        value: 1,
      },
      {
        rating: "Bad",
        value: 2,
      },
      {
        rating: "Good",
        value: 3,
      },
      {
        rating: "Very Good",
        value: 4,
      },
      {
        rating: "Excellent",
        value: 5,
      },
    ];

    const existRatings = data.map((item) => item.rating);
    const difference = ratings.filter(
      (item) => !existRatings.includes(item.rating)
    );
    difference.forEach((item) => {
      data.push({
        ...item,
        number: 0,
      });
    });

    data.sort((a, b) => b.value - a.value);

    const votes = data.reduce((memo, item) => memo + item.number, 0);
    const total = data.reduce(
      (memo, item) => memo + item.number * item.value,
      0
    );

    const categories = data.map((item) => item.rating);
    const series = data.map((item) => item.number);
    const dates = ratingByDate.map(
      (
        item // eslint-disable-line
      ) => moment(item.created_at).format("MMM Y")
      // eslint-disable-line
    );
    const averages = ratingByDate.map(
      (
        item // eslint-disable-line
      ) => roundToDecimals(item.average, 2) // eslint-disable-line
    );

    return res.json({
      categories,
      series,
      total,
      votes,
      average: roundToDecimals(total / votes, 2),
      allVotes,
      dates: dates.reverse(),
      averages: averages.reverse(),
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
