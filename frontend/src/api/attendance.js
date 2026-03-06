import { http } from "./http";

export async function markAttendance(payload) {
  const { data } = await http.post("/api/attendance", payload);
  return data;
}

export async function fetchAttendance(employeeId) {
  const { data } = await http.get(`/api/attendance/${employeeId}`);
  return data;
}

export async function fetchAttendanceSummary(employeeId) {
  const { data } = await http.get(`/api/attendance/${employeeId}/summary`);
  return data;
}