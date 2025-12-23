import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // SOAP Notes (Image 10)
  soapNotes: {
    subjective: String,
    objective: String,
    assessment: String,
    plan: String
  },
  vitals: { // Image 3 & Image 8
    bp: String,
    hr: Number,
    weight: Number,
    temp: Number,
    spO2: Number
  },
  diagnosisCode: String, // ICD-10 (Image 10)
  prescriptions: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  aiAnalysis: {
    summaryDraft: String, // Image 11
    confidenceScore: Number, // Image 11 (e.g., 98%)
    interactionAlert: String, // Allergy/Drug warning (Image 10)
    modelUsed: String // e.g., "BioMistral-7B"
  },
  approvedByDoctor: { type: Boolean, default: false },
  blockchain: {
    hash: String,
    txHash: String // Proof of integrity
  }
}, { timestamps: true });

export default mongoose.model('MedicalRecord', MedicalRecordSchema);