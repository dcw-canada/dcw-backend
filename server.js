const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();
const multipart = require("@fastify/multipart");

const Service = require("./models/Service");
const Inquiry = require("./models/Inquiry");
const Quote = require("./models/Quote");
const Partner = require("./models/Partner");
const RateSheet = require("./models/RateSheet");
const Booking = require("./models/Booking"); // NEW
const { parseRateSheet } = require("./lib/parseRateSheet");

// --- CORS CONFIGURATION ---
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000"];

fastify.register(require("@fastify/cors"), {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

fastify.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 },
});

// --- SERVICES ---
fastify.get("/api/services", async (request, reply) => await Service.find());
fastify.post("/api/services", async (request, reply) => {
  const newService = new Service(request.body);
  await newService.save();
  return reply.code(201).send(newService);
});

// --- CONTACT INQUIRIES ---
fastify.post("/api/contact", async (request, reply) => {
  try {
    const body = request.body || {};
    if (body._gotcha)
      return reply.code(201).send({ message: "Inquiry received" });
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
    return reply
      .code(201)
      .send({
        success: true,
        message: "Inquiry received",
        inquiryId: newInquiry._id,
      });
  } catch (err) {
    return reply.code(400).send({ success: false, error: err.message });
  }
});

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
    return reply.code(500).send({ success: false, error: err.message });
  }
});

fastify.get("/api/inquiries/:id", async (request, reply) => {
  try {
    const inquiry = await Inquiry.findById(request.params.id);
    if (!inquiry) return reply.code(404).send({ error: "Inquiry not found" });
    return inquiry;
  } catch (err) {
    return reply.code(400).send({ error: "Invalid inquiry id" });
  }
});

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
    return reply
      .code(201)
      .send({
        success: true,
        message: "Quote request received",
        quote: newQuote,
      });
  } catch (err) {
    return reply.code(400).send({ success: false, error: err.message });
  }
});

fastify.get("/api/quotes", async (request, reply) => {
  const { status } = request.query || {};
  const filter = status ? { status } : {};
  return await Quote.find(filter).sort({ createdAt: -1 });
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
  await Quote.findByIdAndDelete(request.params.id);
  return { success: true };
});

// --- SHIPPING PARTNER APPLICATIONS ---
fastify.post("/api/partners", async (request, reply) => {
  try {
    const newPartner = new Partner(request.body);
    await newPartner.save();
    return reply
      .code(201)
      .send({
        success: true,
        message: "Partner application received",
        partner: newPartner,
      });
  } catch (err) {
    return reply.code(400).send({ success: false, error: err.message });
  }
});

fastify.get("/api/partners", async (request, reply) => {
  const { status } = request.query || {};
  const filter = status ? { status } : {};
  return await Partner.find(filter).sort({ createdAt: -1 });
});

fastify.patch("/api/partners/:id", async (request, reply) => {
  try {
    const updated = await Partner.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    return updated;
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
});

fastify.delete("/api/partners/:id", async (request, reply) => {
  await Partner.findByIdAndDelete(request.params.id);
  return { success: true };
});

// ============================================================
// --- RATE SHEET ---
// ============================================================

fastify.post("/api/rates/upload", async (request, reply) => {
  try {
    const data = await request.file();
    if (!data)
      return reply
        .code(400)
        .send({ success: false, error: "No file uploaded" });
    const isExcel =
      /\.(xlsx|xls)$/i.test(data.filename || "") ||
      /spreadsheetml|ms-excel/i.test(data.mimetype || "");
    if (!isExcel)
      return reply
        .code(400)
        .send({
          success: false,
          error: "Only .xlsx / .xls files are accepted",
        });

    const buffer = await data.toBuffer();
    const parsed = parseRateSheet(buffer);

    await RateSheet.deleteMany({});
    const created = await RateSheet.create({
      title: parsed.title,
      companyName: parsed.companyName,
      address: parsed.address || "",
      transitTime: parsed.transitTime || "",
      zones: parsed.zones,
      rates: parsed.rates,
      isActive: true,
    });

    return reply.code(201).send({
      success: true,
      message: "Rate sheet replaced successfully",
      summary: {
        zones: parsed.zones.length,
        rates: parsed.rates.length,
        rateSheetId: created._id.toString(),
      },
    });
  } catch (err) {
    return reply
      .code(400)
      .send({ success: false, error: err.message || "Upload failed" });
  }
});

fastify.get("/api/rates", async (request, reply) => {
  try {
    const doc = await RateSheet.findOne({ isActive: true }).sort({
      uploadedAt: -1,
    });
    if (!doc)
      return reply
        .code(404)
        .send({ success: false, error: "No active rate sheet found" });
    return reply.send({ success: true, rateSheet: doc });
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
});

const ZONE_A_STATES = [
  "PB",
  "HR",
  "RJ",
  "GJ",
  "BOM",
  "UP",
  "PUNJAB",
  "HARYANA",
  "RAJASTHAN",
  "GUJARAT",
  "MAHARASHTRA",
  "UTTAR PRADESH",
];

fastify.post("/api/rates/calculate", async (request, reply) => {
  try {
    const { weight, state } = request.body;
    if (!weight || weight <= 0)
      return reply
        .code(400)
        .send({ success: false, error: "Valid weight is required" });

    const normalizedState = (state || "").toUpperCase().trim();
    const isZoneA =
      ZONE_A_STATES.includes(normalizedState) ||
      ZONE_A_STATES.some((s) => normalizedState.includes(s));
    const targetZone = isZoneA ? "ZONE A" : "ZONE B";

    const rateSheet = await RateSheet.findOne({ isActive: true });
    if (!rateSheet)
      return reply
        .code(404)
        .send({ success: false, error: "No rate sheet available." });

    const ratesForZone = rateSheet.rates.filter(
      (r) => r.zoneName === targetZone,
    );
    ratesForZone.sort((a, b) => a.weightFrom - b.weightFrom);

    const matchedRate = ratesForZone.find((r) => {
      if (r.weightTo === null || r.weightTo === undefined)
        return weight >= r.weightFrom;
      return weight >= r.weightFrom && weight <= r.weightTo;
    });

    if (!matchedRate)
      return reply
        .code(400)
        .send({ success: false, error: "No rate found for this weight." });

    return reply.send({
      success: true,
      data: {
        weight,
        state: normalizedState,
        zone: targetZone,
        slabLabel: matchedRate.slabLabel,
        pricePerKg: matchedRate.pricePerKg,
        totalPrice: weight * matchedRate.pricePerKg,
        currency: "CAD",
        transitTime: rateSheet.transitTime || "10 – 12 Business Days",
      },
    });
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
});

fastify.delete("/api/rates", async (request, reply) => {
  try {
    const res = await RateSheet.deleteMany({});
    return reply.send({ success: true, deleted: res.deletedCount });
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
});

// ============================================================
// --- BOOKINGS (NEW) ---
// ============================================================

fastify.post("/api/bookings", async (request, reply) => {
  try {
    const { shipper, receiver, boxes, rateDetails, totalAmount } = request.body;
    const awbNo = "DCW" + Math.floor(10000000 + Math.random() * 90000000);

    const newBooking = new Booking({
      awbNo,
      shipper,
      receiver,
      boxes,
      rateDetails,
      totalAmount,
      status: "PENDING",
    });

    await newBooking.save();
    return reply.code(201).send({ success: true, booking: newBooking });
  } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ success: false, error: err.message });
  }
});

fastify.get("/api/bookings", async (request, reply) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return reply.send({ success: true, bookings });
  } catch (err) {
    return reply.code(500).send({ success: false, error: err.message });
  }
});

fastify.patch("/api/bookings/:id", async (request, reply) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true },
    );
    return updated || reply.code(404).send({ error: "Booking not found" });
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
});

fastify.delete("/api/bookings/:id", async (request, reply) => {
  await Booking.findByIdAndDelete(request.params.id);
  return { success: true };
});

// --- START SERVER ---
const start = async () => {
  try {
    if (!process.env.MONGO_URI)
      throw new Error("MONGO_URI is not set in the .env file");
    await mongoose.connect(process.env.MONGO_URI);
    fastify.log.info("MongoDB Connected");
    await fastify.listen({ port: process.env.PORT || 5000, host: "0.0.0.0" });
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
