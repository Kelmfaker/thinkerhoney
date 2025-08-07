const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/users"); // تأكدي من المسار حسب ملفك

dotenv.config();

// Register (Signup)
exports.signup = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      phone,
      passwordHash: hashedPassword,
      role: "client", // تثبيت الدور
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // تسجيل دخول المشرف مباشرة من .env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminToken = jwt.sign(
        { id: "admin", name: "Administrator", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        token: adminToken,
        role: "admin",
        message: "Admin logged in successfully"
      });
    }

    // المستخدم العادي
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, fullName: user.fullName, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      role: user.role,
      message: "User logged in successfully"
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};