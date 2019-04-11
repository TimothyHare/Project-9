//johnny louifils helped me 
//karen shea helped me 

'use strict';

const express = require('express');
const router = express.Router();
const {User, Course} = require("./models");
const bcrypt = require('bcryptjs');
const authorization = require('basic-auth');

//User Authorization 
router.param("id", function(req, res, next, id){
    Course.findById(id, function(err, doc){
        if (err) return next(err);
        if (!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.Course = doc;
        return next();
    })
    .populate('user');
});

const authorizeUser = (req, res, next) => {
    const creds = authorization(req);
    if (creds) {
      User.findOne({ emailAddress: creds.name }, function(err, user) {
        if (user) {
          const authenticate = bcrypt.compareSync(creds.pass, user.password);
        if (authenticate) {
            console.log(`Authorization successful for user: ${user.firstName} ${user.lastName}!`);
            req.currentUser = user;
            next();
          } else {
            err = new Error("Authorization failure. Username and/or password not valid.");
            err.status = 401;
            next(err);
          }
        } else {
          err = new Error("Authorization failure. Username and/or password not valid.");
          err.status = 401;
          next(err);
        }
      })
    } else {
      res.status(401).json({ message: "Email address and password are required" });
    }
};

// Users

//Get User Route
router.get("/users", authorizeUser, function(req, res, next){
  const users = req.currentUser;
  return res.json(users);
});

//Post User Route 
router.post("/users", function(req, res, next){
  const user = new User(req.body); 
  user.save(user, function(err){
  if (err) return res.status(400).json({error: err.message});
  res.location('/');
  res.status(201).end();
  });
});

//Courses

// Get Course route 
router.get("/courses", function(req, res, next){
  Course.find()
      .populate('user')
      .exec()
      .then((courses) => {
          res.status(200);
          return res.send(courses);
      });
});

// Get Course ID 
router.get("/courses/:id", function(req, res, next){
  res.json(req.Course);
});

//Post Course Route 
router.post("/courses", authorizeUser, function(req, res, next){
  const user = req.currentUser;
  var course = new Course({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded
  });
  course.save(function(err){
      if (err) 
        return next(err);
      res.location("/" + course.id);
      res.status(201).end();
  });
});

// Put Course ID Route(Karen Shea helped me with this) 
router.put("/courses/:id", authorizeUser, function(req, res, next){
// Source: Karen Shea/  https://stackoverflow.com/questions/5024787/update-model-with-mongoose-express-nodejs
  Course.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, course) {
      if (err) return res.status(400).json({error: err.message});
      res.location('/');
      res.status(204);
      return res.json('Course has been updated');
  });
});

// Delete Course ID Route(Johnny Louifils/Karen Shea helped me with this) 
router.delete("/courses/:id", authorizeUser, function(req, res, next){
  Course.remove({_id: req.params.id})
      .exec()
      .then(result =>{
          res.location('/');
          res.status(204);  
          return res.json('Course has been deleted')         
      })
      .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });  
  });
});

module.exports = router;