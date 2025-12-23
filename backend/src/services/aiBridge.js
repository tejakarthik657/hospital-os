import fetch from 'node-fetch';

/**
 * Connects the Backend to the AI-Service (Phase 2)
 * Ensures every AI call is logged for the Admin Dashboard
 */
export async function callAiService(task, input, context = {}) {
  try {
    const response = await fetch(process.env.AI_SERVICE_URL + '/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, input, context })
    });

    const data = await response.json();
    return data; // Returns { text, confidence, model, latency, status }
  } catch (error) {
    console.error("AI Bridge Error:", error);
    return { text: "AI Service Offline", status: "Error" };
  }
}