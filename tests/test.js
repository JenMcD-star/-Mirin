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


describe('tests with auth', () => {
    let token;
    // this runs before all the tests in this describe block
    before(async () => {
        const response = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'user@user.com', password: 'test!!!!' });
        token = response.body.token
        console.log(token)
    });

    it("should create an activity entry with valid input", (done) => {
        chai
            .request(app)
            .post("/api/v1/activities")
            .auth(token, { type: 'bearer' })
            .send({ activityName: "Lift Test", liftType: 'Core', weight: 1, reps: 1 })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    })
    it("should not create an activity entry without valid input", (done) => {
        chai
            .request(app)
            .post("/api/v1/activities")
            .auth(token, { type: 'bearer' })
            .send({ activityName: "Lift Fail Test" })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            })
    })
})