const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
require('dotenv').config();

// Enable CORS for the Next.js frontend
fastify.register(require('fastify-cors'), { 
  origin: '*' // In production, change this to your actual frontend URL
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- MODELS ---
const Service = mongoose.model('Service', new mongoose.Schema({
  title: String,
  description: String,
  image: String
}));

const Inquiry = mongoose.model('Inquiry', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
}));

// --- ROUTES ---

// Get all services (For Frontend)
fastify.get('/api/services', async (request, reply) => {
  const services = await Service.find();
  return services;
});

// Add a service (For Admin Panel)
fastify.post('/api/services', async (request, reply) => {
  const newService = new Service(request.body);
  await newService.save();
  return reply.code(201).send(newService);
});

// Submit an inquiry (For Frontend)
fastify.post('/api/contact', async (request, reply) => {
  const newInquiry = new Inquiry(request.body);
  await newInquiry.save();
  return reply.code(201).send({ message: 'Inquiry received' });
});

// Get all inquiries (For Admin Panel)
fastify.get('/api/inquiries', async (request, reply) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return inquiries;
});

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 5000 });
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();