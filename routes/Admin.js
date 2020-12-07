const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getAddRoom,
  postAddRoom,
  getEditRoom,
  putEditRoom
} = require("../controllers/Admin");

router.get("/dashboard", getDashboard);
router.get("/add", getAddRoom);
router.post("/add", postAddRoom);
router.get("/edit/:id", getEditRoom);
router.put("/edit/:id", putEditRoom);

module.exports = router;
