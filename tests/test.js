const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");
var expect = require('chai').expect;
var request = require('supertest');
chai.use(chaiHttp);
chai.should();


describe("Activities", () => {

    describe("post //api/v1/auth/login", () => {
        it("should login an existing user", (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'user@user.com', password: 'test!!!!' })
                .end((err, res) => {
                    res.should.have.status(200);
                    done()
                })

        })
    })

    describe("post //api/v1/auth/login", () => {
        it("should not be able to login if they have not registered", (done) => {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'Wronguser@wrongone.com', password: 'wrong!!!!' })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        })
    })

    describe("post /api/v1/activities", () => {
        it("should not create an user without an email", (done) => {
            chai
                .request(app)
                .post("/api/v1/auth/register")
                .send({ name: 'testUser1', password: 'test!!!!' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.eql({ msg: "Please provide email" });
                    done();
                });
        });
    })
    })

    //things I've tried 
   /*
    1. this returns an 401 which makes sense.

    it("should create an activity entry with valid input", (done) => {
        chai
            .request(app)
            .post("/api/v1/activities")
            .send({ activityName: "Lift Test", liftType: 'Core', weight: 1, reps: 1 })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    })
-----------------------------------------------------------
2. the tests won't run with this- I think I'm using the before wrong?

    const userCredentials = {
    email: 'user@user.com', 
    password: 'user!!!!'
}
  var authenticatedUser = request.agent(app);before(function(done){
    authenticatedUser
      .post('/api/v1/auth/login')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
------------------------------------------------------------------------
3. this returns an error of undefined agent

var agent = chai.request.agent(app)
agent
  .post('api/v1/login')
  .send({ username: 'user@user.com', password: 'user!!!!' })
  .then(function (res) {
    expect(res).to.have.cookie('sessionid');
    return agent
    .post('/api/v1/activities')
    .sent({activityName: 'Lift Test', liftType: 'Core'}, weight: 1, reps: 1})
      .then(function (res) {
         expect(res).to.have.status(201);
      });
  });

*/
