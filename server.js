const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();
const Service = require("./models/Service");
const Inquiry = require("./models/Inquiry");
const Quote = require("./models/Quote");
const Partner = require("./models/Partner");

// --- CORS CONFIGURATION ---
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

// Public submit
fastify.post("/api/contact", async (request, reply) => {
  try {
    const body = request.body || {};

    // Honeypot spam filter
    if (body._gotcha) {
      return reply.code(201).send({ message: "Inquiry received" });
    }

    const newInquiry = new Inquiry({
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      service: body.service,
      message: body.message,
      ipAddress: request.ip || "",
      userAgent: request.headers["user-agent"] || "",
    });
    await newInquiry.save();
    return reply.code(201).send({
      success: true,
      message: "Inquiry received",
      inquiryId: newInquiry._id,
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.code(400).send({ success: false, error: err.message });
  }
});

// Admin list (with filter + search + pagination)
fastify.get("/api/inquiries", async (request, reply) => {
  try {
    const { status, search, page = 1, limit = 50 } = request.query || {};
    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const lim = Math.min(Number(limit) || 50, 200);
    const pg = Math.max(Number(page) || 1, 1);
    const skip = (pg - 1) * lim;

    const [items, total, newCount] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Inquiry.countDocuments(filter),
      Inquiry.countDocuments({ status: "NEW" }),
    ]);

    return reply.send({
      success: true,
      total,
      page: pg,
      pages: Math.ceil(total / lim) || 1,
      newCount,
      inquiries: items,
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ success: false, error: err.message });
  }
});

// Admin single
fastify.get("/api/inquiries/:id", async (request, reply) => {
  try {
    const inquiry = await Inquiry.findById(request.params.id);
    if (!inquiry) return reply.code(404).send({ error: "Inquiry not found" });
    return inquiry;
  } catch (err) {
    return reply.code(400).send({ error: "Invalid inquiry id" });
  }
});

// Admin update (status / notes)
fastify.patch("/api/inquiries/:id", async (request, reply) => {
  try {
    const update = {};
    if (request.body?.status) update.status = request.body.status;
    if (request.body?.notes !== undefined) update.notes = request.body.notes;

    const updated = await Inquiry.findByIdAndUpdate(request.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) return reply.code(404).send({ error: "Inquiry not found" });
    return updated;
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
});

// Admin delete
fastify.delete("/api/inquiries/:id", async (request, reply) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(request.params.id);
    if (!deleted) return reply.code(404).send({ error: "Inquiry not found" });
    return { success: true };
  } catch (err) {
    return reply.code(400).send({ error: "Invalid inquiry id" });
  }
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
