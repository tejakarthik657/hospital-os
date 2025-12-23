import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  name: String,
  hospitalId: { type: String, unique: true }, // Image 1 (Login ID)
  department: String, // Image 13 (User Management)
  aiAccessLevel: { type: Number, default: 0 }, // Tier 0-3 (Image 13)
  status: { type: String, default: 'Active' },
  allergies: [String], // Red alert in Image 10
  avatar: String
});

export default mongoose.model('User', UserSchema);