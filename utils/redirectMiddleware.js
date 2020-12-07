exports.redirectAuthenticatedUser = (req, res, next) => {
  if (req.session.userInfo) {
    if (req.session.userInfo.isAdmin) {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/user/dashboard");
    }
  } else {
    next();
  }
};

exports.redirectProtected = (req, res, next) => {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

exports.redirectAdminRoutes = (req, res, next) => {
  if (req.session.userInfo && req.session.userInfo.isAdmin) {
    next();
  } else {
    res.redirect("/user/dashboard");
  }
};
