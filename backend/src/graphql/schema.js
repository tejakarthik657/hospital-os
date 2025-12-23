// GraphQL Schema - Type definitions for the 14 pages
// Defines the API contract for frontend-backend communication

const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    role: String!
    allergies: [String]
    medicalHistory: String
  }

  type Appointment {
    id: ID!
    patient: User!
    doctor: User
    symptoms: [String]
    triageData: TriageData
    status: String!
    appointmentTime: String!
    notes: String
  }

  type TriageData {
    severity: String
    aiAssessment: String
  }

  type MedicalRecord {
    id: ID!
    patient: User!
    appointment: Appointment
    soap: SoapNote
    vitals: Vitals
    aiSummary: String
    signedAt: String
    signedBy: User
  }

  type SoapNote {
    subjective: String
    objective: String
    assessment: String
    plan: String
  }

  type Vitals {
    temperature: Float
    bloodPressure: String
    heartRate: Int
    respiratoryRate: Int
  }

  type AiLog {
    id: ID!
    action: String!
    latency: Int!
    status: String!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    appointments(patientId: ID): [Appointment]
    medicalRecords(patientId: ID): [MedicalRecord]
    aiLogs(limit: Int): [AiLog]
  }

  type Mutation {
    createUser(email: String!, password: String!, role: String!): User
    createAppointment(patientId: ID!, symptoms: [String]): Appointment
    createMedicalRecord(patientId: ID!, appointmentId: ID!): MedicalRecord
    signMedicalRecord(recordId: ID!, doctorId: ID!): MedicalRecord
  }
`);

module.exports = schema;
