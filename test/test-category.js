const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");

chai.use(chaiHttp);

describe("Category", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it("should list items on GET", function() {
    return chai
      .request(app)
      .get("/categories")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.have.all.keys(
            "id",
            "title",
            "description",
            "status",
            "username"
          );
        });
      });
  });

  it("should add a category on POST", function() {
    const newCategory = {
      title: "Lorem ip some",
      content: "foo foo foo foo",
      status: "Public",
      videos: [{title:"Video Title", url:"http://example@example.com", videoID:'3452qtyz'}],
      username: "Andrew Dice Clay"
    };
    const expectedKeys = ["id"].concat(Object.keys(newCategory));
    const expectedVideoKeys = ["_id"].concat(Object.keys(newCategory.videos[0]));

    return chai
      .request(app)
      .post("/categories")
      .send(newCategory)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.all.keys(expectedKeys);
        expect(res.body.videos).to.be.a('array');
        expect(res.body.videos).to.have.lengthOf(1);
        expect(res.body.videos[0]).to.have.all.keys(expectedVideoKeys);
        expect(res.body.title).to.equal(newCategory.title);
        expect(res.body.content).to.equal(newCategory.description);
        expect(res.body.author).to.equal(newCategory.status);
      });
  });

  it("should error if POST missing expected values", function() {
    const badRequestData = {};
    return chai
      .request(app)
      .post("/categories")
      .send(badRequestData)
      .then(function(res) {
        expect(res).to.have.status(400);
      });
  });

  it("should update category on PUT", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/categories")
        .then(function(res) {
          const updatedPost = Object.assign(res.body[0], {
            title: "connect the dots",
            description: "la la la la la"
          });
          return chai
            .request(app)
            .put(`/categories/${res.body[0].id}`)
            .send(updatedPost)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });

  it("should delete category on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/categories")
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/categories/${res.body[0].id}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });
});