"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResumeEvaluation } from "@/lib/types";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = [".pdf", ".docx"];

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(f: File): string | null {
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED.includes(ext)) return "Only PDF and DOCX files are supported.";
    if (f.size > MAX_BYTES) return "File too large (max 5 MB).";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Please select a resume file.");

    const problem = validate(file);
    if (problem) return setError(problem);

    setLoading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("resume", file);
      body.append("job_description", jobDescription);

      const res = await fetch("/api/evaluate", { method: "POST", body });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      sessionStorage.setItem("resume_evaluation", JSON.stringify(data as ResumeEvaluation));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-[640px] space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="font-display title-chip text-4xl text-white">AI Resume Evaluator</h1>
          <p className="title-chip text-sm font-medium text-white/90">
            Upload a resume. Get it marked up like a recruiter would.
          </p>
        </header>

        <div className="brutal-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold" style={{ color: "var(--ink)" }}>
                Resume (PDF or DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="brutal-input block w-full cursor-pointer p-2.5 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-2 file:border-[var(--ink)] file:bg-[var(--blue)] file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold" style={{ color: "var(--ink)" }}>
                Job description (optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the role you're applying for, and the review will weigh fit against it."
                rows={5}
                maxLength={5000}
                className="brutal-input w-full resize-none p-2.5 text-sm placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brutal-btn w-full py-3 text-sm font-bold disabled:opacity-60"
            >
              {loading ? "Reading your resume…" : "Evaluate resume"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm font-bold" style={{ color: "var(--pen-red)" }} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}