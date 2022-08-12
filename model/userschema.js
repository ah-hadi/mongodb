const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const data = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    default: null,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  role: {
    type: String,
    required: false,
    default: null,
  },
  image: {
    type: String,
    required: false,
    // default: null,
  },
  adminid: {
    type: String,
    required: false,
    default: null,
  },
});
let model = mongoose.model("users", data);

module.exports = { model };
