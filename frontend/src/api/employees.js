import { http } from "./http";

export async function fetchEmployees() {
  const { data } = await http.get("/api/employees");
  return data;
}

export async function createEmployee(payload) {
  const { data } = await http.post("/api/employees", payload);
  return data;
}

export async function deleteEmployee(employeeId) {
  const { data } = await http.delete(`/api/employees/${employeeId}`);
  return data;
}