const express = require("express");
const router = express.Router();

const userController = require("../controllers/User");
const {
  redirectAuthenticatedUser,
  redirectProtected
} = require("../utils/redirectMiddleware");

router.get("/signup", redirectAuthenticatedUser, userController.getSignup);

router.post("/signup", redirectAuthenticatedUser, userController.postSignup);

router.get("/login", redirectAuthenticatedUser, userController.getLogin);

router.post("/login", redirectAuthenticatedUser, userController.postLogin);

router.get("/dashboard", redirectProtected, userController.getDashboard);

router.get("/logout", userController.logout);

module.exports = router;
