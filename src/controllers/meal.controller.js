const assert = require('assert');
const dbPools = require('../../database/dbtest');

let controller = {
  validateMeal:(req, res, next) => {
    next();
  },
  validateSignup:(req, res, next) => {
    const mealId = parseInt(req.params.mealId);
    const userId = res.locals.userid;

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT * FROM meal_participants_user WHERE mealId = ? AND userId = ?', [mealId, userId], function (error, results, fields) {
        connection.release()
        if (error) throw error;
        
        try{
          assert(results.length == 0, "The user is already signed up")
          assert(typeof mealId === 'number','mealId must be present and an integer');
          assert(typeof userId === 'number','UserId must be present and an integer');
          next();
        } catch(err){
          let error;
          if(err.message == 'The user is already signed up'){
            error ={
              status: 409,
              result: err.message
            }
          } else if(err.message == 'mealId must be present and an integer'){
            error ={
              status: 404,
              result: err.message
            }
          } else {
            error ={
              status: 401,
              result: err.message
            }
          }
          next(error);
        }

      });
    });
  },

  addMeal:(req, res) => {
    let mealData = req.body;
    let meal = [mealData.isActive, mealData.isVega,
    mealData.isVegan, mealData.isToTakeHome, mealData.dateTime,
    mealData.maxAmountOfParticipants, mealData.price, mealData.imageUrl,
     mealData.cookId, mealData.name, mealData.description, mealData.allergenes];
    
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query(`INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, name, description, allergenes) VALUES
       (?,?,?,?,?,?,?,?,?,?,?,?)`, meal, function (error, results, fields) {
        connection.release()
        if (error) throw error;

        if(results.affectedRows > 0){

          dbPools.getConnection(function(err, connection){
            if (err) throw err;
            connection.query(`SELECT * FROM meal ORDER BY id DESC LIMIT 1`, function (error, results, fields) {
              connection.release()
              if (error) throw error;
              res.status(201).json({
                status: 201,
                message: "meal added with values:",
                result: results,
              });
            })
          })
          
        };
      });
    });
  },
  getAllMeals:(req, res) => {
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      
      connection.query('SELECT * FROM meal;', function (error, results, fields) {
        connection.release();
        
        if (error) throw error;
        
        res.status(200).json({
          status: 200,
          result: results,
        });
      });
    });
  },
  getMealById:(req, res, next) => {
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      
      connection.query('SELECT * FROM meal WHERE id = ?', [req.params.mealId], function (error, results, fields) {

        connection.release();
        if (error) throw error;

        if (results.length != 1){
          const error ={
            status: 404,
            result: `meal by id ${req.params.mealId} does not exist`
          }
          next(error);
        } else{
          res.status(200).json({
            status: 200,
            result: results,
          });
        }
      });
    });
  },
  updateMealById:(req, res, next) => {
    const mealId = req.params.mealId;
    let mealData = req.body;
    let meal = [mealData.isActive, mealData.isVega,
    mealData.isVegan, mealData.isToTakeHome, mealData.dateTime,
    mealData.maxAmountOfParticipants, mealData.price, mealData.imageUrl,
     mealData.cookId, mealData.name, mealData.description, mealData.allergenes, parseInt(mealId)];
    
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query(`UPDATE meal SET isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?,
        dateTime = ?, maxAmountOfParticipants = ?,
        price = ?, imageUrl = ?, cookId = ?,
        name = ?, description = ?, allergenes = ? 
        WHERE id = ?`,
       meal, function (error, results, fields) {
        connection.release()
        if (error) throw error;

        if(results.warningCount > 0){
          const error ={
            status: 400,
            result: `Some input is wrong`
          }
          next(error);
        } else if(results.affectedRows > 0){
          dbPools.getConnection(function(err, connection){
            connection.query('SELECT * FROM meal WHERE id = ?', [mealId], function (error, results, fields) {
              connection.release();
              if (error) throw error;
              res.status(200).json({
                status: 200,
                message: `meal ${mealId} updated to values:`,
                result: results,
              });
            });
          }); 
        }else{
          const error ={
            status: 400,
            result: `meal by id ${req.params.mealId} does not exist`
          }
          next(error);
        }

      });
    });
  },
  deleteMealById:(req, res, next) => {
    const mealId = req.params.mealId;

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT * FROM meal WHERE id = ?', [mealId], function (error, results, fields) {
        connection.release()
        if (error) throw error;
        if(results != null && results.length == 1){
          res.status(200).json({
            status: 200,
            result: results,
          });
          dbPools.getConnection(function(err, connection){
            connection.query('DELETE FROM meal WHERE id = ?', [mealId], function (error, results, fields) {
              connection.release();
              if (error) throw error;
              console.log('meal removed')
            });
          });
        } else{
          const error ={
            status: 400,
            result: `meal by id ${req.params.mealId} does not exist`
          }
          next(error);
        }
      });
    });
  },

  signupToMealById:(req, res, next) => {
    const mealId_UserId = [req.params.mealId, res.locals.userid];
    
    dbPools.getConnection(function(err, connection){
      if (err) throw err;

      connection.query(`INSERT INTO meal_participants_user (mealId, userId)
      Values (?,?)`, mealId_UserId, function (error, results, fields) {
        connection.release()
        if (error) throw error;
        res.status(201).json({
          status: 201,
          message: "signed up to meal",
          result: {
            "mealId": mealId_UserId[0],
            "userId": mealId_UserId[1],
          },
        });
       });
    })
  },
  signoutToMealById:(req, res, next) => {
    
  },
}

module.exports = controller;