const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("./db");

async function createAdmin() {
  await User.create({
    email: "admin@test.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
  });
  console.log("Admin created");
  process.exit();
}

createAdmin();
