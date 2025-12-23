import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import schema from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { protect } from './middleware/auth.js';

dotenv.config();
connectDB(); // Connect MongoDB

const app = express();

app.use(cors());
app.use(express.json());

// Protect the GraphQL route with role-based auth middleware
app.use('/graphql', protect, graphqlHTTP((req) => ({
  schema,
  rootValue: resolvers,
  context: { user: req.user }, // Pass user role to resolvers
  graphiql: true,
})));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Hospital-OS Backend running on port ${PORT}`);
  console.log(`📡 AI Service expected at: ${process.env.AI_SERVICE_URL}`);
});