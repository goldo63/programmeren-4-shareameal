const express = require('express');
const mealRouter = express.Router();
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/auth.controller');

//gets all meals UC-302
mealRouter.get("/api/meal", mealController.getAllMeals);
  
//gets the meal by id UC-304
mealRouter.get("/api/meal/:mealId", mealController.getMealById);

//Creates a new meal UC-301
mealRouter.post("/api/meal", authController.validateLogin, mealController.validateMeal, mealController.addMeal);

//deletes the meal by id UC-306
mealRouter.delete("/api/meal/:mealId", mealController.validateMealExistance, authController.validateLogin, mealController.validateMealOwner, mealController.deleteMealById);

//updates the meal by id UC-305
mealRouter.put("/api/meal/:mealId", mealController.validateMealExistance, authController.validateLogin, mealController.validateMealOwner, mealController.validateMeal, mealController.updateMealById);

//UC-401 Aanmelden voor maaltijd
mealRouter.post("/api/meal/:mealId/signup", mealController.validateMealExistance, authController.validateLogin, mealController.validateSignup, mealController.signupToMealById);

//UC-402 Afmelden voor maaltijd
mealRouter.delete("/api/meal/:mealId/signout", mealController.validateMealExistance, authController.validateLogin, mealController.signoutToMealById);

module.exports = mealRouter;