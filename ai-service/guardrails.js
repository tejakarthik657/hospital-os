export function sanitizeOutput(text) {
  const redFlags = [
    { pattern: /you have (a|an) (.*)/i, replacement: "Based on the records, there are indications of $2, but only your doctor can confirm a diagnosis." },
    { pattern: /take (\d+)mg/i, replacement: "[Dosage Redacted] - Please follow the exact dosage on your prescription label." },
    { pattern: /i recommend/i, replacement: "One common approach is..." }
  ];

  let sanitized = text;

  // Scan and replace dangerous phrases
  redFlags.forEach(flag => {
    sanitized = sanitized.replace(flag.pattern, flag.replacement);
  });

  // Always append the medical disclaimer for a "Real-time" convo
  if (!sanitized.includes("medical professional")) {
    sanitized += "\n\n---\n*Note: This is an AI-generated explanation for informational purposes. Always consult your healthcare provider for medical decisions.*";
  }

  return sanitized;
}