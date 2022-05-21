process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index.js')
const pools = require('../../database/dbtest')

chai.should();
chai.use(chaiHttp)

const CLEAR_MEAL_TABLE = 'DELETE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE FROM `user`';

describe('Meals', () => {


  describe('UC-301 Maaltijd aanmaken', () => {
    beforeEach((done) => {
      pools.getConnection(function (err, connection) {
        connection.query(CLEAR_MEAL_TABLE, function (error, results, fields) {
          if (error) console.log(error);
          connection.query(CLEAR_PARTICIPANTS_TABLE, function (error, results, fields) {
            if (error) console.log(error);
            connection.query(CLEAR_USERS_TABLE, function (error, results, fields) {
              if (error) console.log(error);
              connection.query(`INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES
                      ("test","test",0,"test@email.com","secret","test","guest","test","test")`, function (error, results, fields) {
                if (err) throw err;
                connection.release();
                done();
              });
            });
          });
        });
      })
    });

    it('TC-301-1 Verplicht veld ontbreekt', (done) => {
      done();
    });
    it('TC-301-2 Niet ingelogd', (done) => {
      done();
    });
    it('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
      done();
    });
  });

  
});