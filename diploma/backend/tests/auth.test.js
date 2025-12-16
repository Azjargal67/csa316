const request = require("supertest");
const app = require("../index");

describe("Auth API Test", () => {
  it("Should login admin successfully", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Should fail with wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@test.com",
      password: "wrong",
    });
    // it("INTENTIONAL CI FAILURE", () => {
    //   expect(1).toBe(2); //FAIL shalgah
    // });

    expect(res.statusCode).toBe(401);
  });
});
