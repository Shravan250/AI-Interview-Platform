"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedResume {
  role: string;
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Principal";
  techstack: string[];
  type: "Technical" | "Behavioral" | "Mixed";
  amount: number;
  summary: string;
}

type Step = "upload" | "review" | "generating" | "done";

const LEVELS = ["Junior", "Mid", "Senior", "Lead", "Principal"] as const;
const TYPES = ["Technical", "Behavioral", "Mixed"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const ResumeUpload = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [techInput, setTechInput] = useState("");
  const [generatingMsg, setGeneratingMsg] = useState("Generating your interview...");

  // ── Drag & drop ────────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setParseError(null);
    } else {
      setParseError("Please drop a PDF file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setParseError(null);
    }
  };

  // ── Parse ──────────────────────────────────────────────────────────────────

  const handleParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to parse resume");
      }

      setParsed(json.data);
      setStep("review");
    } catch (err: any) {
      setParseError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  // ── Tech tag helpers ───────────────────────────────────────────────────────

  const addTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed || !parsed) return;
    if (!parsed.techstack.includes(trimmed)) {
      setParsed({ ...parsed, techstack: [...parsed.techstack, trimmed] });
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    if (!parsed) return;
    setParsed({ ...parsed, techstack: parsed.techstack.filter((t) => t !== tech) });
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech();
    }
  };

  // ── Generate ───────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!parsed || !userId) return;
    setStep("generating");

    const msgs = [
      "Crafting tailored questions...",
      "Analysing your tech stack...",
      "Almost ready...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setGeneratingMsg(msgs[i]);
    }, 2200);

    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: parsed.role,
          level: parsed.level,
          techstack: parsed.techstack,
          type: parsed.type,
          amount: parsed.amount,
          userid: userId,
        }),
      });

      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) throw new Error("Generation failed");

      setStep("done");
      router.push(`/interview/${json.interviewId}`);
    } catch {
      clearInterval(interval);
      setParseError("Failed to generate interview. Please try again.");
      setStep("review");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (step === "generating") {
    return (
      <div className="resume-generating">
        <div className="resume-generating__inner">
          <div className="resume-spinner" />
          <p className="resume-generating__msg">{generatingMsg}</p>
        </div>
      </div>
    );
  }

  if (step === "review" && parsed) {
    return (
      <div className="resume-review">
        {/* Summary banner */}
        <div className="resume-review__summary">
          <span className="resume-review__summary-icon">✦</span>
          <p>{parsed.summary}</p>
        </div>

        <p className="resume-review__hint">
          Review and edit the information extracted from your resume before generating the interview.
        </p>

        <div className="resume-review__grid">
          {/* Role */}
          <div className="resume-field">
            <label className="resume-field__label">Job Role</label>
            <input
              className="resume-field__input"
              value={parsed.role}
              onChange={(e) => setParsed({ ...parsed, role: e.target.value })}
            />
          </div>

          {/* Level */}
          <div className="resume-field">
            <label className="resume-field__label">Experience Level</label>
            <div className="resume-field__pills">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setParsed({ ...parsed, level: l })}
                  className={`resume-pill ${parsed.level === l ? "resume-pill--active" : ""}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="resume-field">
            <label className="resume-field__label">Interview Focus</label>
            <div className="resume-field__pills">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setParsed({ ...parsed, type: t })}
                  className={`resume-pill ${parsed.type === t ? "resume-pill--active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="resume-field">
            <label className="resume-field__label">
              Number of Questions: <span className="text-primary-200 font-bold">{parsed.amount}</span>
            </label>
            <input
              type="range"
              min={3}
              max={15}
              value={parsed.amount}
              onChange={(e) => setParsed({ ...parsed, amount: Number(e.target.value) })}
              className="resume-slider"
            />
            <div className="resume-slider__labels">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="resume-field resume-field--full">
            <label className="resume-field__label">Tech Stack</label>
            <div className="resume-techstack">
              {parsed.techstack.map((tech) => (
                <span key={tech} className="resume-tech-tag">
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
                    className="resume-tech-tag__remove"
                    aria-label={`Remove ${tech}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="resume-tech-input"
                placeholder="Add technology…"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                onBlur={addTech}
              />
            </div>
          </div>
        </div>

        {parseError && (
          <p className="resume-error">{parseError}</p>
        )}

        <div className="resume-review__actions">
          <button
            className="btn-secondary"
            onClick={() => { setStep("upload"); setFile(null); setParsed(null); }}
          >
            ← Upload Different Resume
          </button>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={!parsed.role || parsed.techstack.length === 0}
          >
            Generate Interview →
          </button>
        </div>
      </div>
    );
  }

  // ── Upload step ────────────────────────────────────────────────────────────
  return (
    <div className="resume-upload">
      <div
        className={`resume-dropzone ${isDragging ? "resume-dropzone--active" : ""} ${file ? "resume-dropzone--has-file" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="resume-dropzone__content">
          <div className="resume-dropzone__icon-wrap">
            <Image src="/upload.svg" alt="upload" width={32} height={32} className="resume-dropzone__icon" />
          </div>

          {file ? (
            <>
              <p className="resume-dropzone__filename">{file.name}</p>
              <p className="resume-dropzone__sub">
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <p className="resume-dropzone__title">Drop your resume here</p>
              <p className="resume-dropzone__sub">or click to browse · PDF only</p>
            </>
          )}
        </div>
      </div>

      {parseError && <p className="resume-error">{parseError}</p>}

      <button
        className="btn-primary mt-4 w-full"
        onClick={handleParse}
        disabled={!file || isParsing}
      >
        {isParsing ? (
          <span className="resume-upload__parsing">
            <span className="resume-spinner resume-spinner--sm" />
            Analysing resume…
          </span>
        ) : (
          "Analyse Resume"
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;
