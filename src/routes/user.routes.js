const express = require('express');
const userRouter = express.Router();

let database = [];
let movieId = 0;
let userId = 0;

//gets all users UC-202
userRouter.get("/api/user", (req, res) => {
    res.status(200).json({
      status: 200,
      result: database.filter((item) => item.type == "user"),
    });
});
  
//gets the user by id UC-204
userRouter.get("/api/user/:userId", (req, res) => {
  const user = database.filter((item) => item.id == req.params.userId && item.type == "user");
  if(user.length == 1){
    res.status(200).json({
      status: 200,
      result: user,
    });
    return;
  }
  res.status(404).json({
    status: 404,
    result: `User by id ${userId} does not exist`
  });
});

//Requests a personal user profile UC-203
userRouter.get("/api/user/:userId", (req, res) => {
  res.status(204).json({
    status: 203,
    result: `This request has not been implemented yet`
  });
});

//Creates a new user UC-201
userRouter.post("/api/user", (req, res) => {
  let user = req.body;
  if(user.email != null && database.filter((item) => item.email == user.email && item.type == "user").length == 0){
    user = {
      type:"user",
      id:userId,
      ...user,
    };
    database.push(user);
    userId++;
    res.status(201).json({
      status: 201,
      result: user,
    });
    return;
  }
  res.status(400).json({
    status: 400,
    result: "An email has not been specified or is already in use.",
  });
});

//deletes the user by id UC-206
userRouter.delete("/api/user/:userId", (req, res) => {
  const removedindex = database.findIndex((item) => item.id == req.params.userId && item.type == "user");
  console.log(removedindex);
  console.log(database);
  if(removedindex != -1){
    database.splice(removedindex, 1);
    res.status(200).json({
      status: 200,
      result: `The user by id ${req.params.userId} has been deleted`,
    });
    return;
  }
  res.status(404).json({
    status: 404,
    result: `User by id ${req.params.userId} does not exist`
  });
});

//updates the user by id UC-205
userRouter.put("/api/user/:userId", (req, res) => {
  let user = req.body;
  const removedindex = database.findIndex((item) => item.id == req.params.userId && item.type == "user");
  
  if(removedindex == -1){
    res.status(404).json({
      status: 404,
      result: `User by id ${req.params.userId} does not exist`
    });
    return;
  } else if(user.email == null || database.filter((item) => item.email == user.email && item.type == "user").length > 0){
    res.status(400).json({
      status: 400,
      result: "An email has not been specified or is already in use.",
    });
    return;
  }   
   
  //removes the user and adds the replacement  
  database.splice(removedindex, 1);

  user = {
    type:"user",
    id:req.params.userId,
    ...user,
  };
  database.push(user) 

  res.status(200).json({
    status: 200,
    result: `The user by id ${req.params.userId} has been updated`,
  });
});
module.exports = userRouter;