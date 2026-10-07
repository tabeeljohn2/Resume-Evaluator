"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import type { ResumeEvaluation } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResumeEvaluation | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("resume_evaluation");
    if (!stored) {
      setNotFound(true);
      return;
    }
    try {
      setResult(JSON.parse(stored) as ResumeEvaluation);
    } catch {
      setNotFound(true);
    }
  }, []);

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-[640px] space-y-6">
        <button onClick={() => router.push("/")} className="title-chip text-sm font-bold text-white">
          ← Evaluate another resume
        </button>

        {notFound && (
          <div className="brutal-card p-8">
            <p className="font-medium" style={{ color: "var(--ink)" }}>
              No result found. Go back and evaluate a resume first.
            </p>
          </div>
        )}

        {result && <ResultCard result={result} />}
      </div>
    </main>
  );
}