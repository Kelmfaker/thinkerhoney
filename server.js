const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

const path = require("path");

const authRouter = require("./routes/auth");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require('./routes/category.routes');



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// static files from public directory
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "static")));

// Routes

// Authentication Routes signup and login
app.use("/auth", authRouter);

app.use("/api/users", userRoutes);
app.use('/api/categories', categoryRoutes);




// Default route to test server status
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "/public", "index.html"));
});

// Error handling middleware
app.use((error, request, response, next) => {
  console.error("Error:", error.message);
  response.status(500).json({ error: "Internal Server Error" });
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
