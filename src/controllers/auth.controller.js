const dbPools = require('../../database/dbtest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let controller = {
  login:(req, res) => {

    const { emailAdress, password } = req.body;
    dbPools.getConnection(function(err, connection){
      if (err) console.log("test1");
      
      connection.query('SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress = ?', emailAdress, function (error, results, fields) {
        connection.release();
        
        if (error) console.log(error);
        

        if(results && results.length == 1){
          //user met email gevonden
          //check of password klopt
          const user = results[0];
          console.log(user.id)

          bcrypt.compare(password, user.password, function(err, result) {
            if(err) throw err;
            if(result == true) {
              console.log("test2");
  
              jwt.sign(
              { userid: user.id },
              'process.env.JWT_SECRET',
              { expiresIn: '7d'},
              (err, token) => {
                if(err) console.log(err);
  
                if(token){
                  res.status(200).json({ 
                    status: 200,
                    result: token,
                  })
                } else{
                  res.status(503).json({
                    status: 503,
                    result: `No token made`,
                  });
                }
              });
              
            } else{ 
              res.status(404).json({
                status: 404,
                result: `Email and password not matching`,
              });
            }
          });

          
          
        } else{
          res.status(404).json({
            status: 404,
            result: `No user with email: ${emailAdress}`,
          });
        }      
      });
    });
  },

  validateLogin:(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      //error
      const error ={
        status: 404,
        result: `No key found`
      }
      next(error);
    } else{
      //substring 7 chars substring(7, authHeader.length)
      jwt.verify(authHeader, 'process.env.JWT_SECRET', function(err, decoded) {
        if(err) {
          const error ={
            status: 404,
            result: `This key isn't linked to any users`
          }
          next(error);
        }
        res.locals.userid = decoded.userid;
        next();
      });
    }
  
  },
}
module.exports = controller;