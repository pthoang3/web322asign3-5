const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const methodOverride = require("method-override");
const session = require("express-session");
const clientSessions = require("client-sessions");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require("dotenv").config();

const app = express();
const handlebars = exphbs.create({
  helpers: {
    ifvalue: function(conditional, options) {
      if (conditional === options.hash.value) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clientSessions({
  cookieName: "session",
  secret: "web322_Session",
  duration: 2*60*1000,
  activeDuration: 1000*60
}));

app.use(fileupload());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.user = req.session.userInfo;
  next();
});



const userRouter = require("./routes/User");
const adminRouter = require("./routes/Admin");
const generalRouter = require("./routes/General");
const { redirectAdminRoutes } = require("./utils/redirectMiddleware");
app.use("/admin/", redirectAdminRoutes, adminRouter);
app.use("/user/", userRouter);
app.use("/", generalRouter);

const PORT = process.env.PORT || 3000;

const DBURL = `mongodb+srv://arseyrc:senecapassword@senecaweb.5iwr5.mongodb.net/week10?retryWrites=true&w=majority`;
mongoose
  .connect(DBURL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Database is connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })

  .catch(err => {
    console.log(`Something went wrong: ${err}`);
  });
