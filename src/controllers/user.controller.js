const assert = require('assert');
const dbPools = require('../../database/dbtest');
let database = [];
let movieId = 0;
let userId = 0;

let controller = {
  
  validateUser:(req, res, next) => {
    let user = req.body;
    let{firstName, lastName, emailAdress, password} = user;
    try {
      assert(typeof firstName === 'string','firstName must be a string');
      assert(typeof lastName === 'string','lastName must be a string');
      assert(typeof emailAdress === 'string','emailAdress must be a string');
      assert(typeof password === 'string','password must be a string');
      next();
    } catch (err) {
      const error ={
        status: 404,
        result: err.message
      }
      next(error);
    }
  },
  
  addUser:(req, res) => {
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
  },
  
  getAllUsers:(req, res) => {
    dbPools.getConnection(function(err, connection){
      if (err) throw err; // not connected!
      
      // Use the connection
      connection.query('SELECT * FROM user', function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
        
        // Handle error after the release.
        if (error) throw error;
        
        // Don't use the connection here, it has been returned to the pool.
        console.log('The solution is: ', results.length)
        res.status(200).json({
          status: 200,
          result: results,
        });
      });
    });
  },
  
  getUserById:(req, res, next) => {
    dbPools.getConnection(function(err, connection){
      if (err) throw err; // not connected!
      
      // Use the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.userId], function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
        
        // Handle error after the release.
        if (error) throw error;
        
        if (results.length != 1){
          const error ={
            status: 404,
            result: `User by id ${userId} does not exist`
          }
          next(error);
        }
        
        // Don't use the connection here, it has been returned to the pool.
        console.log('The solution is: ', results.length)
        res.status(200).json({
          status: 200,
          result: results,
        });
      });
    });
  },
  
  requestPersonalProfile:(req, res) => {
    res.status(204).json({
      status: 204,
      result: `This request has not been implemented yet`
    });
  },
  
  updateUserById:(req, res, next) => {
    let user = req.body;
    //const userId = req.params.userId;
    const removedindex = database.findIndex((item) => item.id == req.params.userId && item.type == "user");
    
    if(removedindex == -1){
      const error ={
        status: 404,
        result: `User by id ${req.params.userId} does not exist`
      }
      next(error);
    } else if(user.email == null || database.filter((item) => item.email == user.email && item.type == "user").length > 0){
      const error ={
        status: 400,
        result: `An email has not been specified or is already in use.`
      }
      next(error);
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
  },
  
  deleteUserById:(req, res, next) => {
    const userId = req.params.userId;

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        connection.release()
        if (error) throw error;
        
        // Don't use the connection here, it has been returned to the pool.
        console.log('Retrieved users: ', results);
        if(results != null && results.length == 1){
          res.status(200).json({
            status: 200,
            result: results,
          });
          dbPools.getConnection(function(err, connection){
            connection.query('DELETE FROM user WHERE id = ?', [userId], function (error, results, fields) {
              connection.release();
              if (error) throw error;
              console.log('User removed')
            });
          });
        } else{
          const error ={
            status: 404,
            result: `User by id ${req.params.userId} does not exist`
          }
          next(error);
        }
      });
    });  
  }
}
module.exports = controller;