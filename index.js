const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const fileupload = require("express-fileupload");
const methodOverride = require("method-override");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require("dotenv").config({path:'./config/keys.env'});

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
app.use(session({ 
  secret: 'hpt123456789',
  resave: true,
  saveUninitialized: true }));
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


mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Database is connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Something went wrong: ${err}`);
  });
