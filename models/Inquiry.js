// models/Inquiry.js
const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: "", trim: true, maxlength: 200 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    service: { type: String, default: "", trim: true, maxlength: 80 },
    message: { type: String, default: "", trim: true, maxlength: 5000 },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUOTED", "CLOSED"],
      default: "NEW",
      index: true,
    },
    notes: { type: String, default: "", maxlength: 5000 },

    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);