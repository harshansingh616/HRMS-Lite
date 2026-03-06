const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDb } = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "hrms-lite-backend" });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
    process.exit(1);
  });