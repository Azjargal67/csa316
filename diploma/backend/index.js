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

/* ===== ADD COUNSELOR ===== */
app.post("/admin/add-counselor", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const counselor = new User({
    name,
    email,
    phone,
    password: hashed,
    role: "counselor",
  });

  await counselor.save();

  res.json({ message: "Counselor created successfully" });
});

/* ===== GET ALL COUNSELORS ===== */
app.get("/admin/counselors", async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" }).select(
      "-password"
    );
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch counselors" });
  }
});

/* ===== START SERVER ===== */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
