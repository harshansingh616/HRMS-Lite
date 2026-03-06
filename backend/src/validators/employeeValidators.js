const { z } = require("zod");

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  department: z.string().min(1, "Department is required"),
});

module.exports = { createEmployeeSchema };