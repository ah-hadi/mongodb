const { response } = require("express");
let jwt = require("jsonwebtoken");
const { model } = require("../model/userschema");

function user(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).send("invalid token");
  }
  var token = req.headers.authorization.split(" ")[1];
  var decode = jwt.verify(token, "my super secret key");
  // console.log(token);
  // console.log(req.headers.authorization);
  req.email = decode.email;
  if (decode.role == "admin") {
    next();
  } else {
    return res.status(404).send("unauthorized");
  }
}

function onlyuser(req, res, next) {
  var token = req.headers.authorization.split(" ")[1];
  var decode = jwt.verify(token, "my super secret key");
  req.email = decode.email;
  if (decode.role == "user") {
    next();
  } else {
    return res.status(404).send("unauthorized");
  }
}

module.exports = { user, onlyuser };
