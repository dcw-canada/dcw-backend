const mongoose = require("mongoose");

const BlogBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "paragraph",
      "subheading",
      "list",
      "callout",
      "image",
      "heading",
      "divider",
      "slideshow",
      "table",
    ],
    required: true,
  },
  text: { type: String, default: "" },
  items: { type: [String], default: [] },
  style: { type: String, default: "" }, // e.g. "bullet", "numbered", "h2", "h3", "h4"
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  caption: { type: String, default: "" },
  layout: { type: String, default: "none" }, // "none", "left-image", "right-image", "top-image", "bottom-image"
  images: [
    {
      src: { type: String, default: "" },
      alt: { type: String, default: "" },
      caption: { type: String, default: "" },
    },
  ],
  buttonText: { type: String, default: "" },
  buttonLink: { type: String, default: "" },
  tableData: { type: [[String]], default: [] },
});

const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: "📝" },
    tag: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    readTime: { type: String, default: "5 min", trim: true },
    thumbClass: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    publishedDate: { type: String, required: true, trim: true },
    bannerImage: { type: String, default: "" },
    bannerImageAlt: { type: String, default: "" },
    mobileBannerImage: { type: String, default: "" },
    mobileBannerImageAlt: { type: String, default: "" },
    previewImage: { type: String, default: "" },
    previewImageAlt: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    author: {
      name: { type: String, default: "DCW Logistics Team" },
      avatarInitials: { type: String, default: "DCW" },
    },
    content: { type: [BlogBlockSchema], default: [] },
  },
  { timestamps: true }
);

BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", BlogSchema);

