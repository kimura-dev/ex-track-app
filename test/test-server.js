"use strict";
const DATABASE_URL = 'mongodb://localhost:27017/jwt-auth-demo-test';
const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require("../server.js");

const expect = chai.expect;

chai.use(chaiHttp);

before(function () {
  return runServer(DATABASE_URL);
});

after(function () {
  return closeServer();
});

describe("index page", function() {
  it("should exist", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});


