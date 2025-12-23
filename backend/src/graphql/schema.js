import { buildSchema } from 'graphql';

export default buildSchema(`
  type User { id: ID, name: String, email: String, role: String, hospitalId: String, aiAccessLevel: Int, status: String, allergies: [String] }
  type Vitals { bp: String, hr: Int, weight: Float, temp: Float, spO2: Int }
  type SOAP { subjective: String, objective: String, assessment: String, plan: String }
  type AIAnalysis { summaryDraft: String, confidenceScore: Int, interactionAlert: String, modelUsed: String }
  
  type Appointment { 
    id: ID, patient: User, doctor: User, date: String, timeSlot: String, 
    symptomsRaw: String, status: String, department: String, urgency: String 
  }

  type MedicalRecord { 
    id: ID, soapNotes: SOAP, vitals: Vitals, aiAnalysis: AIAnalysis, 
    approvedByDoctor: Boolean, blockchainHash: String, prescriptions: [Prescription] 
  }

  type Prescription { name: String, dosage: String, frequency: String }
  type AiLog { id: ID, timestamp: String, role: String, model: String, promptSnippet: String, latency: Int }

  type Query {
    # Patient Screens
    patientDashboard(id: ID!): MedicalRecord
    myAppointments: [Appointment]
    
    # Doctor Screens
    doctorDashboard(id: ID!): [Appointment]
    appointmentList: [Appointment]
    patientConsultation(recordId: ID!): MedicalRecord
    
    # Admin Screens
    systemStats: String
    userManagement: [User]
    aiAuditLogs: [AiLog]
  }

  type Mutation {
    bookAppointment(doctorId: ID!, symptoms: String!, date: String!, slot: String!): Appointment
    saveConsultation(recordId: ID!, soap: SOAPInput, vitals: VitalsInput, rx: [RxInput]): MedicalRecord
    approveRecord(recordId: ID!): MedicalRecord # Triggers Blockchain
    toggleAiKillSwitch(status: Boolean!): Boolean
  }

  input SOAPInput { subjective: String, objective: String, assessment: String, plan: String }
  input VitalsInput { bp: String, hr: Int, weight: Float, temp: Float, spO2: Int }
  input RxInput { name: String, dosage: String, frequency: String }
`);