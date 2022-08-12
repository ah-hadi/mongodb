var express = require("express");
const controller = require("../controller/controller");
const { user, onlyuser } = require("../middleware/middleware");
const multer = require("multer");
const { dirname } = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

var route = express.Router();

route.post("/signup", controller.signup);
route.post("/login", controller.login);
route.post("/createuser", user, controller.createuser);
route.get("/viewusers", user, controller.viewusers);
route.delete("/deleteuser/:id", user, controller.deleteuser);
route.patch("/userupdate/:id", user, controller.update);
route.patch("/update/:id", onlyuser, controller.userupdate);
//----------------------multer route
route.post(
  "/upload",
  upload.single("image"),
  (req, res, next) => {
    var path = require("path");
    var root = path.dirname(require.main.filename);
    var absolutePath = path.resolve(root + "/" + req.file.path);
    res.path = absolutePath;
    next();
    //   res.send(absolutePath);
  },
  controller.upload
);
module.exports = route;
