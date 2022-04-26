const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index.js')
let database = [];

chai.should();
chai.use(chaiHttp)

describe('Manage users', () => {
    describe('blabla', () => {
        beforeEach((done) =>{
            database = [];
            done();
        });

        it('When required input is missing, return an error', (done) => {
            chai
                .request(server)
                .post('/api/user')
                .send({
                    //"firstName": "John", Firstname mist
                    "lastName":"boop2",
                    "emailAdress": "2016",
                    "email":"test4",
                    "password":"pixar"
                })
                .end((err, res) => {
                    res.should.be.an('object')
                    let { status, result } = res.body;
                    status.should.equal(404);
                    result.should.be.an('string').that.equals("firstName must be a string");
                    done();
                }) 
        });
        //it('When required input is missing, return an error', (done) => {});) //other testcase!
    });
});