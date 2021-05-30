//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true} );
const userSchema = new mongoose.Schema({
  email : {type: String , required:[true, 'Email Required!'] },
  password: {type: String , required:[true , 'Password Required']}
});

userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",function (req,res) {
  res.render("home");
});
app.get("/login",function (req,res) {
  res.render("login");
});
app.get("/register",function (req,res) {
  res.render("register");
});
app.get("/submit",function (req,res) {
  res.render("submit");
});
app.get("/secrets",function (req,res) {
  res.render("secrets");
});
app.post("/register", function (req,res) {
const newUser = new User( {
  email: req.body.username,
  password: req.body.password
});
newUser.save(function (err) {
  if (!err)
  {
  console.log("Successfully added the new user");
  res.render("secrets");
  }
  else
  {
  console.log(err);
  }

});
});
app.post("/login" , function (req,res) {
  User.findOne({email: req.body.username}, function (err,foundUser) {
    if(!err)
    {
      if(foundUser.password === req.body.password)
      {
        res.render("secrets");
        console.log(foundUser);
        console.log("Password Matched");
      }
      else
      {
        res.write("Wrong Password");
        console.log("Wrong Password");
      }
    }
    else
    {
      console.log(err);
    }
  });
});













app.listen(3000 , function () {
  console.log("Server started at port 3000");
});
