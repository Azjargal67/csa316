const bcrypt = require("bcryptjs");

module.exports = [
  {
    email: "admin@test.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
  },
  {
    email: "counselor@test.com",
    password: bcrypt.hashSync("123456", 10),
    role: "counselor",
  },
  {
    email: "student@test.com",
    password: bcrypt.hashSync("123456", 10),
    role: "student",
  },
];
