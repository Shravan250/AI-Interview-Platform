"use client";

import { useState } from "react";
import Image from "next/image";

interface SendFeedbackEmailProps {
  userName: string;
  role: string;
  interviewType: string;
  createdAt: string;
  totalScore: number;
  categoryScores: { name: string; score: number; comment: string }[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  interviewId: string;
}

type Status = "idle" | "sending" | "sent" | "error";

const SendFeedbackEmail = (props: SendFeedbackEmailProps) => {
  const [status, setStatus] = useState<Status>("idle");

  const handleSend = async () => {
    if (status === "sending" || status === "sent") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/email/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });

      const json = await res.json();

      if (!res.ok || !json.success) throw new Error("Failed");

      setStatus("sent");
    } catch {
      setStatus("error");
      // reset after 3s so user can retry
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={status === "sending" || status === "sent"}
      className={`send-email-btn ${
        status === "sent"
          ? "send-email-btn--sent"
          : status === "error"
          ? "send-email-btn--error"
          : ""
      }`}
    >
      {status === "sending" && (
        <span className="send-email-btn__spinner" />
      )}

      {status === "idle" && (
        <Image src="/file.svg" alt="" width={16} height={16} className="opacity-70" />
      )}

      <span>
        {status === "idle" && "Email Feedback Report"}
        {status === "sending" && "Sending…"}
        {status === "sent" && "✓ Report Sent"}
        {status === "error" && "✗ Failed — Retry"}
      </span>
    </button>
  );
};

export default SendFeedbackEmail;
