const stats = [
  { label: "مجالات التقويم", target: 5, suffix: "" },
  { label: "صف دراسي", target: 12, suffix: "" },
  { label: "العام الدراسي", target: 2026, suffix: "" },
];

export function StatsSection() {
  return (
    <section
      id="stats"
      className="js-stats border-y border-neutral-200 bg-stats-bg py-14 md:py-16"
      aria-labelledby="stats-heading"
    >
      <div className="js-reveal mx-auto max-w-6xl px-4 md:px-6">
        <h2 id="stats-heading" className="sr-only">
          أرقام المدرسة
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="js-stat-num text-4xl font-bold tabular-nums text-school-gold md:text-5xl"
                data-target={s.target}
              >
                0
              </p>
              <p className="mt-2 text-sm font-medium text-school-black/80 md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
