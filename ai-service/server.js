import express from 'express';
import fetch from 'node-fetch';
import { SYSTEM_PROMPTS } from './prompts.js';
import { sanitizeOutput } from './guardrails.js';

const app = express();
app.use(express.json());

/**
 * NEW: Conversational Chat Endpoint
 * This allows "Ask anything" real-time interaction
 */
app.post('/chat', async (req, res) => {
  const { messages, role, contextData } = req.body;
  const startTime = Date.now();

  // 1. Build the "Doctor-in-the-loop" Base Instructions
  const baseInstruction = {
    role: "system",
    content: `${SYSTEM_PROMPTS.GENERAL_ASSISTANT} 
              User Role: ${role}. 
              Available Context: ${JSON.stringify(contextData)}.
              INSTRUCTION: Answer questions about this data clearly. If asked for a diagnosis, refuse.`
  };

  try {
    // 2. Call Ollama using the Chat API (Supports history)
    const response = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "mistral-nemo",
        messages: [baseInstruction, ...messages], // Combine System Instructions + Chat History
        stream: false,
        options: { temperature: 0.7 } // Higher temperature for "natural" conversation
      })
    });

    const data = await response.json();
    let aiResponse = data.message.content;

    // 3. Safety Guardrail Check
    aiResponse = sanitizeOutput(aiResponse);

    const latency = Date.now() - startTime;

    // 4. Send back for the UI
    res.json({
      reply: aiResponse,
      latency,
      model: "mistral-nemo",
      status: aiResponse.includes("consult") ? "Flagged" : "Stable"
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ reply: "I'm having trouble connecting to my brain. Please try again." });
  }
});

app.listen(5000, () => console.log("🧠 Conversational AI Service running on 5000"));