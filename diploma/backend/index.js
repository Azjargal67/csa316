const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./users");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret123";

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Login failed" });
  }

  const token = jwt.sign({ role: user.role }, SECRET);

  res.json({
    token,
    user: { role: user.role },
  });
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
