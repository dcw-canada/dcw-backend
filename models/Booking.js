const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    awbNo: { type: String, required: true, unique: true },
    shipper: { type: Object, required: true },
    receiver: { type: Object, required: true },
    boxes: { type: Array, required: true },
    rateDetails: { type: Object, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
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

module.exports = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);