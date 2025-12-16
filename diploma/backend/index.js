const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./db");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret123";

/* ===== LOGIN ===== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: { role: user.role, email: user.email },
  });
});

/* ===== START SERVER ONLY IF NOT TEST ===== */
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

/* ===== EXPORT APP FOR TESTING ===== */
module.exports = app;

/* ===== START SERVER ===== */
// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });
