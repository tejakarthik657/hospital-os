// GraphQL Resolvers - Logic for Booking, Signing, and Auditing
// Implements the business logic for API endpoints

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const AiLog = require('../models/AiLog');

const resolvers = {
  Query: {
    user: async (args) => {
      return await User.findById(args.id);
    },
    appointments: async (args) => {
      return await Appointment.find({ patientId: args.patientId });
    },
    medicalRecords: async (args) => {
      return await MedicalRecord.find({ patientId: args.patientId });
    },
    aiLogs: async (args) => {
      return await AiLog.find().limit(args.limit || 100);
    },
  },

  Mutation: {
    createUser: async (args) => {
      const user = new User({
        email: args.email,
        password: args.password,
        role: args.role,
      });
      return await user.save();
    },
    createAppointment: async (args) => {
      const appointment = new Appointment({
        patientId: args.patientId,
        symptoms: args.symptoms,
      });
      return await appointment.save();
    },
    createMedicalRecord: async (args) => {
      const record = new MedicalRecord({
        patientId: args.patientId,
        appointmentId: args.appointmentId,
      });
      return await record.save();
    },
    signMedicalRecord: async (args) => {
      return await MedicalRecord.findByIdAndUpdate(
        args.recordId,
        {
          signedAt: new Date(),
          signedBy: args.doctorId,
        },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
