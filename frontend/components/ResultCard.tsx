import type { ResumeEvaluation } from "@/lib/types";

function stampColor(score: number) {
  if (score >= 70) return "var(--approved-green)";
  if (score >= 50) return "var(--margin-amber)";
  return "var(--pen-red)";
}

function Section({ mark, title, items }: { mark: string; title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="hairline py-5">
      <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold" style={{ color: "var(--ink)" }}>
        <span className="chip">{mark}</span>
        {title}
      </h3>
      <ul className="space-y-1.5 pl-9 text-sm font-medium" style={{ color: "var(--ink)" }}>
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultCard({ result }: { result: ResumeEvaluation }) {
  const color = stampColor(result.overall_score);

  return (
    <div className="brutal-card p-8">
      <div className="flex items-start gap-5 pb-5">
        <div
          className="font-stamp flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border-[3px] text-2xl"
          style={{ borderColor: "var(--ink)", background: color, color: "#111" }}
        >
          {result.overall_score}
        </div>
        <p className="pt-1.5 text-base font-medium leading-snug" style={{ color: "var(--ink)" }}>
          {result.summary}
        </p>
      </div>

      <Section mark="✓" title="Strengths" items={result.strengths} />
      <Section mark="✗" title="Weaknesses" items={result.weaknesses} />
      <Section mark="⚑" title="Missing keywords" items={result.missing_keywords} />
      <Section mark="→" title="Suggestions" items={result.suggestions} />

      <div className="hairline pt-5">
        <h3 className="mb-1.5 text-sm font-bold" style={{ color: "var(--ink)" }}>ATS notes</h3>
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--ink)" }}>
          {result.ats_compatibility_notes}
        </p>
      </div>
    </div>
  );
}