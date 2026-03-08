import { useEffect, useMemo, useState } from "react";
import { createEmployee, deleteEmployee, fetchEmployees } from "../api/employees";
import { Field } from "../components/Field";

const emptyForm = { employeeId: "", fullName: "", email: "", department: "" };

function normalizeError(err) {
  const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
  const details = err?.response?.data?.details;
  if (details?.fieldErrors) {
    const first = Object.values(details.fieldErrors).flat()[0];
    return first || msg || "Something went wrong";
  }
  return msg || "Something went wrong";
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isEmpty = useMemo(() => !loading && employees.length === 0, [loading, employees]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createEmployee(form);
      setForm(emptyForm);
      await load();
    } catch (e2) {
      setError(normalizeError(e2));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(employeeId) {
    if (!confirm(`Delete employee ${employeeId}?`)) return;
    setError("");
    setBusy(true);
    try {
      await deleteEmployee(employeeId);
      await load();
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Employee Management</div>
        <div className="text-sm text-slate-600 mt-1">Add employees and manage records.</div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Employee ID">
            <input
              className="w-full rounded-xl border px-3 py-2 text-black"
              value={form.employeeId}
              onChange={(e) => setForm((s) => ({ ...s, employeeId: e.target.value }))}
              placeholder="E001"
            />
          </Field>

          <Field label="Full Name">
            <input
              className="w-full rounded-xl border px-3 py-2 text-black"
              value={form.fullName}
              onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
              placeholder="Full name"
            />
          </Field>

          <Field label="Email Address">
            <input
              className="w-full rounded-xl border px-3 py-2 text-black"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="name@company.com"
            />
          </Field>

          <Field label="Department">
            <input
              className="w-full rounded-xl border px-3 py-2 text-black"
              value={form.department}
              onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))}
              placeholder="Engineering"
            />
          </Field>

          <div className="md:col-span-2 flex justify-end">
            <button
              disabled={busy}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {busy ? "Saving..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Employees</div>
          <button
            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={load}
            disabled={loading || busy}
          >
            Refresh
          </button>
        </div>

        {loading ? <div className="mt-4 text-sm text-slate-600">Loading...</div> : null}
        {isEmpty ? <div className="mt-4 text-sm text-slate-600">No employees yet.</div> : null}

        {!loading && employees.length > 0 ? (
          <div className="w-full mt-4 overflow-x-auto">
            <table className="w-full table-fixed ">
              <thead className="text-left text-slate-600">
                <tr className="border-b text-black">
                  <th className="py-2">Employee ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Department</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e._id} className="border-b last:border-b-0 text-black">
                    <td className="py-2 font-medium">{e.employeeId}</td>
                    <td className="py-2">{e.fullName}</td>
                    <td className="py-2">{e.email}</td>
                    <td className="py-2">{e.department}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onDelete(e.employeeId)}
                        disabled={busy}
                        className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}