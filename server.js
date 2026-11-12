const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();
const Service = require("./models/Service");
const Inquiry = require("./models/Inquiry");
const Quote = require("./models/Quote");
const Partner = require("./models/Partner");

// --- CORS CONFIGURATION ---
// Reads from .env (CORS_ORIGINS). Fallback to localhost if not set.
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000"];

fastify.register(require("@fastify/cors"), {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

// --- SERVICES ---

fastify.get("/api/services", async (request, reply) => {
  const services = await Service.find();
  return services;
});

fastify.post("/api/services", async (request, reply) => {
  const newService = new Service(request.body);
  await newService.save();
  return reply.code(201).send(newService);
});

// --- CONTACT INQUIRIES ---

fastify.post("/api/contact", async (request, reply) => {
  const newInquiry = new Inquiry(request.body);
  await newInquiry.save();
  return reply.code(201).send({ message: "Inquiry received" });
});

fastify.get("/api/inquiries", async (request, reply) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return inquiries;
});

// --- SHIPMENT QUOTES ---

fastify.post("/api/quotes", async (request, reply) => {
  try {
    const newQuote = new Quote(request.body);
    await newQuote.save();
    return reply.code(201).send({
      success: true,
      message: "Quote request received",
      quote: newQuote,
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.code(400).send({ success: false, error: err.message });
  }
});

fastify.get("/api/quotes", async (request, reply) => {
  const { status } = request.query || {};
  const filter = status ? { status } : {};
  const quotes = await Quote.find(filter).sort({ createdAt: -1 });
  return quotes;
});

fastify.get("/api/quotes/:id", async (request, reply) => {
  try {
    const quote = await Quote.findById(request.params.id);
    if (!quote) return reply.code(404).send({ error: "Quote not found" });
    return quote;
  } catch (err) {
    return reply.code(400).send({ error: "Invalid quote id" });
  }
});

fastify.patch("/api/quotes/:id", async (request, reply) => {
  try {
    const updated = await Quote.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    if (!updated) return reply.code(404).send({ error: "Quote not found" });
    return updated;
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
});

fastify.delete("/api/quotes/:id", async (request, reply) => {
  try {
    const deleted = await Quote.findByIdAndDelete(request.params.id);
    if (!deleted) return reply.code(404).send({ error: "Quote not found" });
    return { success: true };
  } catch (err) {
    return reply.code(400).send({ error: "Invalid quote id" });
  }
});

// --- SHIPPING PARTNER APPLICATIONS ---

fastify.post("/api/partners", async (request, reply) => {
  try {
    const newPartner = new Partner(request.body);
    await newPartner.save();
    return reply.code(201).send({
      success: true,
      message: "Partner application received",
      partner: newPartner,
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.code(400).send({ success: false, error: err.message });
  }
});

fastify.get("/api/partners", async (request, reply) => {
  const { status } = request.query || {};
  const filter = status ? { status } : {};
  const partners = await Partner.find(filter).sort({ createdAt: -1 });
  return partners;
});

fastify.get("/api/partners/:id", async (request, reply) => {
  try {
    const partner = await Partner.findById(request.params.id);
    if (!partner) return reply.code(404).send({ error: "Partner not found" });
    return partner;
  } catch (err) {
    return reply.code(400).send({ error: "Invalid partner id" });
  }
});

fastify.patch("/api/partners/:id", async (request, reply) => {
  try {
    const updated = await Partner.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    if (!updated) return reply.code(404).send({ error: "Partner not found" });
    return updated;
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
});

fastify.delete("/api/partners/:id", async (request, reply) => {
  try {
    const deleted = await Partner.findByIdAndDelete(request.params.id);
    if (!deleted) return reply.code(404).send({ error: "Partner not found" });
    return { success: true };
  } catch (err) {
    return reply.code(400).send({ error: "Invalid partner id" });
  }
});

// --- START SERVER ---

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