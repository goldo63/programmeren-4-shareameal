const assert = require('assert');
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
            res.status(404).json({
                status: 404,
                result: err.toString(),
              });
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
        res.status(200).json({
            status: 200,
            result: database.filter((item) => item.type == "user"),
        });
    },

    getUserById:(req, res) => {
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
    },

    requestPersonalProfile:(req, res) => {
        res.status(204).json({
            status: 203,
            result: `This request has not been implemented yet`
          });
    },

    updateUserById:(req, res) => {
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
    },

    deleteUserById:(req, res) => {
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
    }
    
}
module.exports = controller;