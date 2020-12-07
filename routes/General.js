const express = require("express");
const router = express.Router();
const { redirectProtected } = require("../utils/redirectMiddleware");

const {
  getHomePage,
  getRoom,
  getSingleRoom,
  bookRoom
} = require("../controllers/General");

router.get("/", getHomePage);

router.get("/rooms", getRoom);

router.get("/room/:id", getSingleRoom);

router.get("/book/:id", redirectProtected, bookRoom);

module.exports = router;
