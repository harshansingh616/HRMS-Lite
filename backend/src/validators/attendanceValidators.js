const { z } = require("zod");

const markAttendanceSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be DD-MM-YYYY"),
  status: z.enum(["Present", "Absent"]),
});

module.exports = { markAttendanceSchema };