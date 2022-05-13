const assert = require('assert');
const dbPools = require('../../database/dbtest');
const jwt = require('jsonwebtoken');

let controller = {
  login:(req, res) => {

    const { emailAdress, password } = req.body;
    //TODO: ASSERT voor validatie

    //TODO: Set query to meal columns
    // let whereQuery;
    // if(name || isActive) {
    //   whereQuery = ' WHERE '
    //   whereValues = [];
    //   if(name){
    //     whereQuery += `Firstname = ? && `
    //     whereValues.push(name);
    //   }
    //   if(isActive){ 
    //     whereQuery += `isActive = ? && `
    //     whereValues.push(isActive);
    //   }

    //   whereQuery = whereQuery.slice(0, -4);
    //   console.log(whereQuery);
    //   console.log(whereValues);
    // }

    dbPools.getConnection(function(err, connection){
      if (err) throw err;
      
      connection.query('SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress = ?', emailAdress, function (error, results, fields) {
        connection.release();
        
        if (error) throw error;
        

        if(results && results.length == 1){
          //user met email gevonden
          //check of password klopt
          const user = results[0];
          if(user.password === password){

            jwt.sign({ userid: user.id },
            'process.env.JWT_SECRET',
            { expiresIn: '7d' },
            { algorithm: 'HS256' },
            function(err, token) {
              if(err) console.error(err);
              if(token){
                res.status(200).json({ 
                  status: 200,
                  result: token,
                })
              }
            });
          } else{
            res.status(404).json({
              status: 404,
              result: `Email and password not matching`,
            });
          }
          
        } else{
          res.status(404).json({
            status: 404,
            result: `No user with email: ${emailAdress}`,
          });
        }      

        // res.status(200).json({
        //   status: 200,
        //   result: results,
        // });
      });
    });
  },

  validate:(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      //error
    } else{
      //substring 7 chars substring(7, authHeader.length)
      //jwt.verify
    }
  
  },
}
module.exports = controller;