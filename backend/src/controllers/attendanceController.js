const asyncHandler = require("express-async-handler");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { markAttendanceSchema } = require("../validators/attendanceValidators");

const markAttendance = asyncHandler(async (req, res) => {
  const { employeeId, date, status } = markAttendanceSchema.parse(req.body);

  const employeeExists = await Employee.findOne({ employeeId });
  if (!employeeExists) {
    res.status(404);
    throw new Error("Employee not found");
  }

  
  const saved = await Attendance.findOneAndUpdate(
    { employeeId, date },
    { $set: { status } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(saved);
});

const listAttendanceByEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employeeExists = await Employee.findOne({ employeeId });
  if (!employeeExists) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const records = await Attendance.find({ employeeId }).sort({ date: -1 });
  res.status(200).json(records);
});

const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employeeExists = await Employee.findOne({ employeeId });
  if (!employeeExists) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const [summary] = await Attendance.aggregate([
    { $match: { employeeId } },
    {
      $group: {
        _id: "$employeeId",
        totalRecords: { $sum: 1 },
        totalPresent: {
          $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
        },
        totalAbsent: {
          $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json(
    summary || { employeeId, totalRecords: 0, totalPresent: 0, totalAbsent: 0 }
  );
});

module.exports = { markAttendance, listAttendanceByEmployee, getAttendanceSummary };