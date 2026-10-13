const STEPS = ["CREATED", "PAID", "INVENTORY_RESERVED", "COMPLETED"];

export default function StatusTimeline({ status }) {
  if (status === "FAILED") {
    return (
      <div className="timeline">
        <span className="step failed">FAILED</span>
      </div>
    );
  }
  const current = STEPS.indexOf(status);
  return (
    <div className="timeline">
      {STEPS.map((s, i) => (
        <span key={s} className={"step" + (i <= current ? " done" : "")}>
          {s}
        </span>
      ))}
    </div>
  );
}
