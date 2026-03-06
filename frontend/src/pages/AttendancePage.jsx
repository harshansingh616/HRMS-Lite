// frontend/src/pages/AttendancePage.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchEmployees } from "../api/employees";
import {
  fetchAttendance,
  fetchAttendanceSummary,
  markAttendance,
} from "../api/attendance";
import { Field } from "../components/Field";
import { StatusPill } from "../components/StatusPill";

function normalizeError(err) {
  const msg =
    err?.response?.data?.error || err?.response?.data?.message || err?.message;
  const details = err?.response?.data?.details;

  if (details?.fieldErrors) {
    const first = Object.values(details.fieldErrors).flat()[0];
    return first || msg || "Something went wrong";
  }
  return msg || "Something went wrong";
}

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const inputClass =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-black outline-none " +
  "focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(todayYYYYMMDD());
  const [status, setStatus] = useState("Present");

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const hasEmployees = useMemo(() => employees.length > 0, [employees]);

  async function loadEmployees() {
    setError("");
    setLoadingEmployees(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      if (!employeeId && data.length > 0) setEmployeeId(data[0].employeeId);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoadingEmployees(false);
    }
  }

  async function loadAttendance(targetEmployeeId) {
    if (!targetEmployeeId) return;
    setError("");
    setLoadingRecords(true);
    try {
      const [att, sum] = await Promise.all([
        fetchAttendance(targetEmployeeId),
        fetchAttendanceSummary(targetEmployeeId),
      ]);
      setRecords(att);
      setSummary(sum);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoadingRecords(false);
    }
  }

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAttendance(employeeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  async function onMark(e) {
    e.preventDefault();
    if (!employeeId) return;

    setError("");
    setBusy(true);
    try {
      await markAttendance({ employeeId, date, status });
      await loadAttendance(employeeId);
    } catch (e2) {
      setError(normalizeError(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white border rounded-2xl p-5 shadow-sm min-h-[620px]">
        
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Attendance</div>
          <div className="text-sm text-slate-600 mt-1">
            Select an employee, choose date + status, then mark attendance.
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form
            onSubmit={onMark}
            className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Field label="Employee">
              <select
                className={inputClass}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={loadingEmployees || !hasEmployees}
              >
                {loadingEmployees ? <option>Loading...</option> : null}
                {!loadingEmployees && employees.length === 0 ? (
                  <option value="">No employees</option>
                ) : null}
                {employees.map((e) => (
                  <option key={e._id} value={e.employeeId}>
                    {e.employeeId} — {e.fullName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date" hint="Format: DD-MM-YYYY">
              <input
                className={inputClass}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>

            <Field label="Status">
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </Field>

            <div className="md:col-span-3 flex justify-end">
              <button
                disabled={busy || !employeeId}
                className="rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {busy ? "Saving..." : "Mark Attendance"}
              </button>
            </div>
          </form>

          <div className="mt-6 grid w-full grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border rounded-2xl p-4">
              <div className="text-sm text-slate-600">Total Records</div>
              <div className="text-2xl font-semibold text-slate-900">
                {summary?.totalRecords ?? "-"}
              </div>
            </div>
            <div className="bg-slate-50 border rounded-2xl p-4">
              <div className="text-sm text-slate-600">Total Present</div>
              <div className="text-2xl font-semibold text-slate-900">
                {summary?.totalPresent ?? "-"}
              </div>
            </div>
            <div className="bg-slate-50 border rounded-2xl p-4">
              <div className="text-sm text-slate-600">Total Absent</div>
              <div className="text-2xl font-semibold text-slate-900">
                {summary?.totalAbsent ?? "-"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Records */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm min-h-[620px]">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Records</div>
            <button
              className="text-sm px-3 py-2 rounded-xl border hover:bg-slate-50"
              onClick={() => loadAttendance(employeeId)}
              disabled={loadingRecords || !employeeId}
            >
              Refresh
            </button>
          </div>

          {loadingRecords ? (
            <div className="mt-4 text-sm text-slate-600">Loading...</div>
          ) : null}

          {!loadingRecords && employeeId && records.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">
              No attendance records yet.
            </div>
          ) : null}

          {!loadingRecords && records.length > 0 ? (
            <div className="mt-4 w-full overflow-x-auto">
              <table className="w-full table-fixed text-sm">
                <thead className="text-left text-slate-600">
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 w-[180px]">Date</th>
                    <th className="px-4 py-3 w-[180px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium whitespace-nowrap overflow-hidden text-ellipsis text-black">
                        {r.date}
                      </td>
                      <td className="px-4 py-3 text-black">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}