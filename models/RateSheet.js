const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    states: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const RateSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true, trim: true },
    slabLabel: { type: String, required: true, trim: true },
    weightFrom: { type: Number, required: true },
    weightTo: { type: Number, default: null },
    pricePerKg: { type: Number, required: true },
    unit: { type: String, default: "per kg" },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const RateSheetSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Rate Sheet" },
    companyName: { type: String, default: "DCW SOLUTIONS" },
    address: { type: String, default: "" },
    transitTime: { type: String, default: "" },
    originCountry: { type: String, default: "India" },
    destCountry: { type: String, default: "Canada" },
    zones: { type: [ZoneSchema], default: [] },
    rates: { type: [RateSchema], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    uploadedAt: { type: Date, default: Date.now },
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

module.exports =
  mongoose.models.RateSheet || mongoose.model("RateSheet", RateSheetSchema);