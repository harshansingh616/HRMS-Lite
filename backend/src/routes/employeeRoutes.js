const express = require("express");
const {
  createEmployee,
  listEmployees,
  findEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");


const router = express.Router();

router.post("/", createEmployee);
router.get("/", listEmployees);
router.get("/:employeeId", findEmployee )
router.delete("/:employeeId", deleteEmployee);

module.exports = router;