export function StatusPill({ status }) {
  const cls =
    status === "Present"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}