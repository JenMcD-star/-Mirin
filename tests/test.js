const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

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
