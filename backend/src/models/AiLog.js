import mongoose from 'mongoose';

const AiLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: String,
  model: String,
  promptSnippet: String,
  responseSnippet: String,
  latency: Number, // ms
  status: String // "Stable" or "Flagged"
});

export default mongoose.model('AiLog', AiLogSchema);