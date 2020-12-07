const Room = require("../models/Room");
const { isNullInputField, isImage } = require("../utils/validators");
const uuidv1 = require("uuid/v1");
const path = require("path");
const fs = require("fs");

const validateRoomInfo = data => {
  const errors = {};

  if (isNullInputField(data.title)) {
    errors.titleError = "Title is required";
  }

  if (isNullInputField(data.price)) {
    errors.priceError = "Price is required";
  } else if (isNaN(data.price)) {
    errors.priceError = "Price must be a number";
  }

  if (isNullInputField(data.city) || data.city === "Select city") {
    errors.cityError = "City is required";
  }

  if (isNullInputField(data.description)) {
    errors.descriptionError = "Description is required";
  }

  return errors;
};
exports.getDashboard = (req, res) => {
  Room.find({})
    .then(rooms => {
      res.render("Admin/dashboard", { rooms });
    })
    .catch(err => {
      console.log(`Something went wrong:\n${err}`);
      res.redirect("/");
    });
};

exports.getAddRoom = (req, res) => {
  res.render("Admin/addRoom");
};

exports.postAddRoom = (req, res) => {
  const errors = validateRoomInfo(req.body);

  if (isNullInputField(req.files)) {
    errors.fileError = "Image is required";
  } else if (!isImage(req.files.file)) {
    errors.fileError = "The file needs to be image type";
  }

  if (Object.keys(errors).length > 0) {
    res.render("Admin/addRoom", { ...errors, ...req.body });
  } else {
    const formData = {
      title: req.body.title,
      price: req.body.price,
      city: req.body.city,
      description: req.body.description,
      image: `room-${uuidv1()}${path.parse(req.files.file.name).ext}`
    };
    req.files.file
      .mv(`public/rooms/${formData.image}`)
      .then(() => {
        const newRoom = new Room(formData);
        return newRoom.save();
      })
      .then(room => {
        res.redirect(`/room/${room._id}`);
      })
      .catch(err => {
        console.log(`Something went wrong:\n${err}`);
        res.render("Admin/addRoom", {
          error: "Something went wrong internally",
          ...req.body
        });
      });
  }
};

exports.getEditRoom = (req, res) => {
  Room.findById(req.params.id)
    .then(room => {
      if (room) {
        res.render("Admin/editRoom", { oldImage: room.image, ...room._doc });
      } else {
        res.redirect("Admin/dashboard");
      }
    })
    .catch(err => {
      res.redirect("Admin/dashboard");
    });
};

exports.putEditRoom = (req, res) => {
  const errors = validateRoomInfo(req.body);

  if (req.files && !isImage(req.files.file)) {
    errors.fileError = "The file needs to be image type";
  }
  if (Object.keys(errors).length > 0) {
    res.render("Admin/editRoom", { ...errors, ...req.body });
  } else {
    let oldRoomImage = null;

    Room.findById(req.params.id)
      .then(room => {
        if (room) {
          room.title = req.body.title;
          room.price = req.body.price;
          room.city = req.body.city;
          room.description = req.body.description;

          if (req.files) {
            oldRoomImage = room.image;
            room.image = `room-${uuidv1()}${
              path.parse(req.files.file.name).ext
            }`;
          }
          return room.save();
        } else {
          res.redirect("/Admin/dashboard");
        }
      })
      .then(room => {
        if (req.files) {
          return req.files.file.mv(`public/rooms/${room.image}`);
        } else {
          res.redirect("/Admin/dashboard");
        }
      })
      .then(() => {
        fs.unlink(`public/rooms/${oldRoomImage}`, () => {});
        res.redirect("/Admin/dashboard");
      })
      .catch(err => {
        console.log(err);
        res.redirect("/Admin/dashboard");
      });
  }
};
