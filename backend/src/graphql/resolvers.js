import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import AiLog from '../models/AiLog.js';
import { callAiService } from '../services/aiBridge.js';
import { signOnBlockchain } from '../services/blockchainBridge.js';

export default {
  // Image 4: Patient books and AI performs triage immediately
  bookAppointment: async ({ doctorId, symptoms, date, slot }, context) => {
    // 1. Send symptoms to Local AI for triage (Neurology? Urgency?)
    const aiTriage = await callAiService('triage', symptoms);

    return await Appointment.create({
      patientId: context.user.id,
      doctorId,
      date,
      timeSlot: slot,
      symptomsRaw: symptoms,
      aiTriage: {
        department: aiTriage.department,
        urgency: aiTriage.urgency
      },
      status: 'Confirmed'
    });
  },

  // Image 10: Doctor saves consultation notes
  saveConsultation: async ({ recordId, soap, vitals, rx }, context) => {
    // 1. Check for drug interactions/allergies via AI
    const patient = await User.findById(context.patientId);
    const alert = await callAiService('interaction_check', { rx, allergies: patient.allergies });

    // 2. Generate AI Summary Draft for Image 11
    const summary = await callAiService('summarize_clinical', soap);

    return await MedicalRecord.findByIdAndUpdate(recordId, {
      soapNotes: soap,
      vitals,
      prescriptions: rx,
      aiAnalysis: {
        summaryDraft: summary.text,
        confidenceScore: summary.confidence,
        interactionAlert: alert
      }
    }, { new: true });
  },

  // Image 11: Final Approval + Blockchain Integrity Proof
  approveRecord: async ({ recordId }) => {
    const record = await MedicalRecord.findById(recordId);
    
    // Create Hash (Digital Fingerprint)
    const hash = crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
    
    // Store on Local Blockchain (Phase 3)
    const txHash = await signOnBlockchain(recordId, hash);
    
    record.approvedByDoctor = true;
    record.blockchain = { hash, txHash };
    return await record.save();
  },

  // Image 14: Admin fetches Audit Logs
  aiAuditLogs: async () => {
    return await AiLog.find().sort({ timestamp: -1 });
  }
};