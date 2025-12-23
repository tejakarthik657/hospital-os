// AI Bridge Service - Connects Backend to AI Service
// Handles communication with the local LLM (Ollama)

const axios = require('axios');
const AiLog = require('../models/AiLog');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

class AiBridge {
  static async generateInsight(prompt, userId) {
    const startTime = Date.now();
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/generate`, {
        prompt,
      });

      const latency = Date.now() - startTime;

      // Log the AI call
      await AiLog.create({
        userId,
        action: 'generate_insight',
        prompt,
        response: response.data.result,
        latency,
        model: response.data.model,
        status: 'success',
      });

      return response.data.result;
    } catch (error) {
      const latency = Date.now() - startTime;

      await AiLog.create({
        userId,
        action: 'generate_insight',
        prompt,
        latency,
        status: 'failed',
        reason: error.message,
      });

      throw error;
    }
  }

  static async validateDiagnosis(diagnosis, userId) {
    const startTime = Date.now();
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/validate`, {
        diagnosis,
      });

      const latency = Date.now() - startTime;

      await AiLog.create({
        userId,
        action: 'validate_diagnosis',
        response: JSON.stringify(response.data),
        latency,
        status: response.data.isValid ? 'success' : 'blocked',
        reason: response.data.reason,
      });

      return response.data;
    } catch (error) {
      const latency = Date.now() - startTime;

      await AiLog.create({
        userId,
        action: 'validate_diagnosis',
        latency,
        status: 'failed',
        reason: error.message,
      });

      throw error;
    }
  }
}

module.exports = AiBridge;
