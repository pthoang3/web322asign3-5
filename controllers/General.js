const Room = require("../models/Room");
const Booking = require("../models/Booking");

exports.getHomePage = (req, res) => {
  res.render("General/home");
};

exports.getRoom = (req, res) => {
  const query = {};
  if (req.query.city) {
    query.city = req.query.city;
  }
  Room.find(query)
    .then(rooms => {
      res.render("General/rooms", { rooms, city: req.query.city });
    })
    .catch(err => {
      console.log(`Something went wrong:\n${err}`);
      res.redirect("/");
    });
};

exports.getSingleRoom = (req, res) => {
  Room.findById(req.params.id)
    .then(room => {
      if (room) {
        res.render("General/singleRoom", { ...room._doc });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log(`Something went wrong:\n${err}`);
      res.redirect("/");
    });
};

exports.bookRoom = (req, res) => {
  Room.findById(req.params.id)
    .then(room => {
      if (room) {
        const bookingData = {
          roomID: room._id,
          userID: req.session.userInfo._id,
          title: room.title,
          price: room.price,
          city: room.city,
          image: room.image
        };

        const booking = new Booking(bookingData);
        booking.save().then(() => res.redirect("/user/dashboard"));
      } else {
        res.redirect("/rooms");
      }
    })
    .catch(err => {
      console.log(`Something went wrong when booking:\n${err}`);
      res.redirect("/rooms");
    });
};
