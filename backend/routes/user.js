// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {protect} = require("../middleware/authmiddleware");

// GET /api/user?search=query
router.get("/", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" },
      }
    : {};

  try {
    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
