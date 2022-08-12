var express = require("express");
// const multer = require("multer");
// import morgan from "morgan";
// const upload = multer({ dest: "/uploads" });
var app = express();
var port = 8080;
const route = require("./router/router");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/superadmin", {
  useUnifiedTopology: true,
  useNewurlParser: true,
});
//----------------multer
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(morgan('dev'));

// app.use(express.static(__dirname, 'public'));
// const storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, 'Downloads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.Screenshot102002.png);
//   }
// });
// const host = req.host;
// const filePath = req.protocol + "://" + host + '/' + req.file.path;

//-----------------------
app.use(bodyParser.json());
app.use("/", route);
app.listen(port || 8080, function () {
  var datetime = new Date();
  var message = "Server running on port:-" + port + "Started at:-" + datetime;
  console.log(message);
});
