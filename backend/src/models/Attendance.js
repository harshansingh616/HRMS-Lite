const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true }, // YYYY-MM-DD
    status: { type: String, required: true, enum: ["Present", "Absent"] },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);