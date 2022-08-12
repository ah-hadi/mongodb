const { model } = require("../model/userschema");
let jwt = require("jsonwebtoken");
// const sendMail = require("../email");
const nodemailer = require("nodemailer");
const { token } = require("morgan");
// const path = require("path");
// const path = require("../router/router");

function upload(req, res) {
  let path = res.path;
  console.log(path);
  let img = new model({
    image: path,
  });
  img.save();
  res.send("uploaded");
}

//---------------------------register user--------------------//
function signup(req, res) {
  // console.log(res.path);
  // let path = res.path;
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  // let image = req.file.path;
  // console.log(image);
  let value = new model({
    email: email,
    password: password,
    role: role,
    // path: path,
  });
  // value.save();
  // res.send("done");
  if (role == "admin") {
    value.save();
  } else if (email == "" && password == "") {
    return res.status(404).send("please enter valid credentials");
  } else if (role == "user") {
    return res.status(401).send("you are not allowed to sign in");
  } else {
    return res.status(404).send("user not found");
  }

  res.status(200).send("user registered sucessfully");
}

//------------------------login------------------------//

async function login(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  let value = {
    email: email,
    password: password,
    role: role,
  };
  let user = await model.findOne({
    email: email,
    password: password,
    role: role,
  });
  if (email == "" || password == "" || role == "") {
    return res.status(404).send("please enter valid credentials");
  }
  if (!user) {
    return res.status(404).json({
      message: "unauthorize",
    });
  }
  if (
    user.email == email &&
    user.password == password &&
    user.role == "admin"
  ) {
    const token = jwt.sign(value, "my super secret key");
    res.send({ message: "welcome admin", token });
  } else if (
    user.email == email &&
    user.password == password &&
    user.role == "user"
  ) {
    const token = jwt.sign(value, "my super secret key");
    res.send({ message: "welcome user", token });
  } else {
    return res.status(404).json({
      message: "not-found",
    });
  }
}

//---------------------createuser
async function createuser(req, res) {
  let useremail = req.email;
  let dats = await model.findOne({ email: useremail });
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  let value = new model({
    email: email,
    password: password,
    role: role,
    adminid: dats._id,
  });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hadirajpoot63@gmail.com",
      pass: "cwsxxwzfwbxrprqj",
    },
    tls: { rejectUnauthorized: false },
  });
  let message = {
    from: "hadirajpoot63@gmail.com",
    to: "hadirajpoot63@gmail.com",
    subject: "Hello ✔",
    html: "<h1>user created successfully</h1>",
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  if (dats.role == "admin") {
    value.save();
    res.status(200).send("user created");
  } else {
    res.status(404).send("unauthorize");
  }
}

//--------------------deleteuser
async function deleteuser(req, res) {
  let userid = req.params.id;
  let useremail = req.email;
  let data = await model.findOne({ email: useremail });
  if (data.role == "admin") {
    model.findByIdAndDelete(userid, function (err, data) {
      if (err) {
        res.send("", err);
      } else {
        return res.status(200).send("user deleted succesfully");
      }
    });
  } else {
    res.status(401).send("not authorize for this action");
  }
}

//-------------------admin can update user
async function update(req, res) {
  const _id = req.params.id;
  let password = req.body.password;
  let email = req.body.email;
  let updateObj = {
    password: password,
    email: email,
  };
  let useremail = req.email;
  let data = await model.findOne({ email: useremail });
  if (data.role == "admin") {
    model.findByIdAndUpdate(_id, updateObj, function (err, model) {
      if (err) {
        return res.status(401).send("error");
      } else {
        return res.status(200).send("successfully updated" + model);
      }
    });
  } else {
    return res.status(404).send("unauthorize");
  }
}

//-----------------viewusers

async function viewusers(req, res) {
  let useremail = req.email;
  let data = await model.findOne({ email: useremail });
  let users = await model.find({ adminid: data._id });
  if (data.role == "admin") {
    res.send(users);
  } else {
    return res.status(404).send("unauthorize");
  }
}

//------------------userpanel

async function userupdate(req, res) {
  const _id = req.params.id;
  let password = req.body.password;
  let updateObj = {
    password: password,
  };
  let useremail = req.email;
  let data = await model.findOne({ email: useremail });
  if (data.role == "user") {
    model.findByIdAndUpdate(_id, updateObj, function (err, model) {
      if (err) {
        return res.status(401).send("error");
      } else {
        return res.status(200).send("successfully updated" + model);
      }
    });
  } else {
    return res.status(404).send("unautorize");
  }
}
module.exports = {
  signup,
  login,
  createuser,
  update,
  viewusers,
  deleteuser,
  userupdate,
  upload,
};
