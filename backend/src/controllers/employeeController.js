const asyncHandler = require("express-async-handler");
const Employee = require("../models/Employee");
const { createEmployeeSchema } = require("../validators/employeeValidators");


const createEmployee = asyncHandler(async (req, res) => {
  const { employeeId, fullName, email, department } = createEmployeeSchema.parse(req.body);

  const exists = await Employee.findOne({ $or: [{ employeeId }, { email }] });
  if (exists) {
    res.status(409);
    throw new Error("Employee ID or Email already exists");
  }

  const created = await Employee.create({ employeeId, fullName, email, department });
  res.status(201).json(created);
});

const listEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.status(200).json(employees);
});

const findEmployee = asyncHandler(async (req, res) => {

  const { employeeId } = req.params;
  const employee = await Employee.findOne({ employeeId });
  if(!employee)
    {
        res.status(404);
        throw new Error("Employee not found");
    }
    res.status(200).json(employee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const deleted = await Employee.findOneAndDelete({ employeeId });
  if (!deleted) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.status(200).json({ message: "Employee deleted", employeeId });
});

module.exports = { createEmployee, listEmployees, findEmployee, deleteEmployee };