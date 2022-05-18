const express = require('express');
const mealRouter = express.Router();
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/auth.controller');

//gets all meals UC-302
mealRouter.get("/api/meal", mealController.getAllMeals);
  
// //gets the meal by id UC-304
mealRouter.get("/api/meal/:mealId", mealController.getMealById);

// //Creates a new meal UC-301
mealRouter.post("/api/meal", authController.validateLogin, mealController.validateMeal, mealController.addMeal);

// //deletes the meal by id UC-306
mealRouter.delete("/api/meal/:mealId", authController.validateLogin, mealController.deleteMealById);

// //updates the meal by id UC-305
mealRouter.put("/api/meal/:mealId", authController.validateLogin, mealController.validateMeal, mealController.updateMealById);

module.exports = mealRouter;