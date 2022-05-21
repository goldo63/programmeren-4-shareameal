const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

//gets all users UC-202
userRouter.get("/api/user", userController.getAllUsers);
  
//Requests a personal user profile UC-203
userRouter.get("/api/user/profile", authController.validateLogin, userController.requestPersonalProfile);

//gets the user by id UC-204
userRouter.get("/api/user/:userId", userController.getUserById);

//Creates a new user UC-201
userRouter.post("/api/user", userController.validateUser, userController.addUser);

//deletes the user by id UC-206
userRouter.delete("/api/user/:userId", userController.validateUserExistance, authController.validateLogin, userController.deleteUserById);

//updates the user by id UC-205
userRouter.put("/api/user/:userId", userController.validateUserExistance, authController.validateLogin, userController.validateUser, userController.updateUserById);

module.exports = userRouter;