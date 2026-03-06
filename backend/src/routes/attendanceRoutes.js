const express = require("express");
const {
  markAttendance,
  listAttendanceByEmployee,
  getAttendanceSummary,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/", markAttendance);
router.get("/:employeeId/summary", getAttendanceSummary);
router.get("/:employeeId", listAttendanceByEmployee);

module.exports = router;