const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // Routing & Cargo
    shipmentMode: {
      type: String,
      required: true,
      enum: ["courier", "air-cargo", "ocean-freight", "india-canada", "warehousing"],
    },
    originCountry: { type: String, required: true, trim: true },
    destinationCity: { type: String, required: true, trim: true },
    cargoType: { type: String, default: "General Cargo", trim: true },
    weightKg: { type: String, default: "", trim: true },
    packageCount: { type: String, default: "", trim: true },
    timeline: { type: String, default: "", trim: true },
    specialRequirements: { type: String, default: "", trim: true },

    // Contact
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    // Admin workflow
    status: {
      type: String,
      enum: ["new", "in-review", "quoted", "closed"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);