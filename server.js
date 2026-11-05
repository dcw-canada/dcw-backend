const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();
const Service = require("./models/Service");
const Inquiry = require("./models/Inquiry");

// Enable CORS for the Next.js frontend
fastify.register(require("@fastify/cors"), {
  origin: "*", // In production, change this to your actual frontend URL
});

// --- ROUTES ---

fastify.get("/api/services", async (request, reply) => {
  const services = await Service.find();
  return services;
});

fastify.post("/api/services", async (request, reply) => {
  const newService = new Service(request.body);
  await newService.save();
  return reply.code(201).send(newService);
});

fastify.post("/api/contact", async (request, reply) => {
  const newInquiry = new Inquiry(request.body);
  await newInquiry.save();
  return reply.code(201).send({ message: "Inquiry received" });
});

fastify.get("/api/inquiries", async (request, reply) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return inquiries;
});

// Start Server
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    fastify.log.info("MongoDB Connected");

    await fastify.listen({
      port: process.env.PORT || 5000,
      host: "0.0.0.0",
    });
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
