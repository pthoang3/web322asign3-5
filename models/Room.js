const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const Room = new mongoose.model("Room", RoomSchema);

module.exports = Room;
