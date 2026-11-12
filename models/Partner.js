const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    // Step 1: Organization type
    businessType: {
      type: String,
      required: true,
      enum: ["courier-co", "freight-forwarder", "3pl-provider", "ecommerce-aggregator"],
    },

    // Step 2: Volume & trade lanes
    estimatedMonthlyVolume: {
      type: String,
      required: true,
      enum: ["starter", "100-500", "500-2000", "enterprise"],
    },
    headquartersCountry: { type: String, required: true, trim: true },
    originLanes: { type: String, required: true, trim: true },
    primaryService: {
      type: String,
      default: "clearance-delivery",
      enum: [
        "clearance-delivery",
        "airport-recovery",
        "bonded-warehousing",
        "full-gateway",
      ],
    },
    additionalDetails: { type: String, default: "", trim: true },

    // Step 3: Contact
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    // Admin workflow
    status: {
      type: String,
      enum: ["new", "contacted", "in-negotiation", "approved", "rejected"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);