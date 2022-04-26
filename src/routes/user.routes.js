const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');

//gets all users UC-202
userRouter.get("/api/user", userController.getAllUsers);
  
//gets the user by id UC-204
userRouter.get("/api/user/:userId", userController.getUserById);

//Requests a personal user profile UC-203
userRouter.get("/api/user/:userId", userController.requestPersonalProfile);

//Creates a new user UC-201
userRouter.post("/api/user", userController.validateUser, userController.addUser);

//deletes the user by id UC-206
userRouter.delete("/api/user/:userId", userController.deleteUserById);

//updates the user by id UC-205
userRouter.put("/api/user/:userId", userController.updateUserById);

module.exports = userRouter;