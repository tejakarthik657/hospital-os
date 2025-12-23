import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  timeSlot: String,
  symptomsRaw: String, // Image 4 (Describe Symptoms)
  aiTriage: {
    department: String, // e.g., "Neurology"
    urgency: String,    // "Standard" or "Emergency" (Image 4)
    logId: String
  },
  status: { type: String, enum: ['Scheduled', 'Checked-In', 'Confirmed', 'Cancelled', 'Completed'] },
  reasonForVisit: String // Image 9
});

export default mongoose.model('Appointment', AppointmentSchema);