const assert = require('assert');
const dbPools = require('../../database/dbtest');
const bcrypt = require('bcrypt');

let controller = {
  
  validateUser:(req, res, next) => {
    let user = req.body;
    let{firstName, lastName, emailAdress, password} = user;

    let emailcounters;
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT * FROM user WHERE emailAdress = ?', [emailAdress], function (error, results, fields) {
        if (err) throw err;
        emailcounters = results.length;
        try {
          const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

          assert(emailcounters == 0, 'email already exists');
          assert(typeof firstName === 'string','firstName must be a string');
          assert(typeof lastName === 'string','lastName must be a string');
          assert(typeof emailAdress === 'string','emailAdress must be a string');
          assert(typeof password === 'string','password must be a string');
          assert(emailAdress != "", 'Email can\'t be empty');
          assert(password != "", 'Password can\'t be empty');
          assert(emailRegex.test(emailAdress));
          next();
        } catch (err) {
          let error;
          if(err.message == "email already exists"){
            error ={
              status: 409,
              result: err.message
            }
          } else{
            error ={
              status: 400,
              result: err.message
            }
          }
          
          next(error);
        }
      });
    });
  },
  
  addUser:(req, res) => {
    let userData = req.body;
    bcrypt.hash(userData.password, 10, function(err, hash) {
      if(err) throw err;
      let user = [userData.firstName, userData.lastName,
      userData.isActive, userData.emailAdress, hash, //hashed password
      userData.phoneNumber, userData.roles, userData.street, userData.city];
    
      dbPools.getConnection(function(err, connection){
        if (err) throw err; 
        connection.query(`INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES
         (?,?,?,?,?,?,?,?,?)`, user, function (error, results, fields) {
          connection.release()
          if (error) throw error;
  
          if(results.affectedRows > 0){
  
            dbPools.getConnection(function(err, connection){
              if (err) throw err;
              connection.query(`SELECT * FROM user ORDER BY id DESC LIMIT 1`, user, function (error, results, fields) {
                connection.release()
                if (error) throw error;
                res.status(201).json({
                  status: 201,
                  message: "User added with values:",
                  result: results,
                });
              })
            })
            
          };
        });
      });
    });
  },
  
  getAllUsers:(req, res) => {

    const { name, isActive } = req.query;
    //TODO: Set query to meal columns
    let whereQuery = "";
    if(name || isActive) {
      whereQuery = ' WHERE '
      whereValues = [];
      if(name){
        whereQuery += `Firstname = ? && `
        whereValues.push(name);
      }
      if(isActive){ 
        whereQuery += `isActive = ? && `
        whereValues.push(isActive);
      }

      whereQuery = whereQuery.slice(0, -4);
      console.log(whereQuery);
      console.log(whereValues);
    }

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      
      connection.query('SELECT * FROM user'+ whereQuery + ';', whereValues, function (error, results, fields) {
        connection.release();
        
        if (error) throw error;
        
        res.status(200).json({
          status: 200,
          result: results,
        });
      });
    });
  },
  
  getUserById:(req, res, next) => {
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.userId], function (error, results, fields) {

        connection.release();
        if (error) throw error;

        if (results.length != 1){
          const error ={
            status: 404,
            result: `User by id ${req.params.userId} does not exist`
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
  
  requestPersonalProfile:(req, res) => {
    res.status(204).json({
      status: 204,
      result: `This request has not been implemented yet`
    });
  },
  
  updateUserById:(req, res, next) => {
    let userData = req.body;
    const userId = req.params.userId;
    let user = [userData.firstName, userData.lastName,
    userData.isActive, userData.emailAdress, userData.password,
    userData.phoneNumber, userData.roles, userData.street, userData.city, parseInt(userId)];
    
    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query(`UPDATE user SET firstName = ?, lastName = ?,
       isActive = ?, emailAdress = ?, password = ?,
        phoneNumber = ?, roles = ?,
         street = ?, city = ? WHERE id = ?`,
       user, function (error, results, fields) {
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
            connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
              connection.release();
              if (error) throw error;
              res.status(200).json({
                status: 200,
                message: `User ${userId} updated to values:`,
                result: results,
              });
            });
          }); 
        }else{
          const error ={
            status: 400,
            result: `User by id ${req.params.userId} does not exist`
          }
          next(error);
        }

      });
    });
  },
  
  deleteUserById:(req, res, next) => {
    const userId = req.params.userId;

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
        connection.release()
        if (error) throw error;
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
            status: 400,
            result: `User by id ${req.params.userId} does not exist`
          }
          next(error);
        }
      });
    });  
  }
}
module.exports = controller;