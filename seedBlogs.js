const Blog = require("./models/Blog");

const INITIAL_BLOGS = [
  {
    slug: "complete-guide-shipping-india-to-canada",
    category: "guides",
    icon: "🇨🇦",
    tag: "Shipping Guides",
    title: "Complete Guide: Shipping Personal Effects & Cargo from India to Canada",
    description: "Planning to ship parcels, household goods, or commercial merchandise from India to Canada? Learn about transit times, documentation, customs regulations, and how door-to-door logistics saves you money.",
    readTime: "7 min",
    thumbClass: "thumb-featured",
    featured: true,
    publishedDate: "November 14, 2026",
    metaTitle: "Complete Guide: Shipping from India to Canada | DCW Solutions Inc.",
    metaDescription: "Learn how to ship parcels, personal effects, and commercial cargo from India to Canada door-to-door with DCW Solutions.",
    author: {
      name: "DCW Logistics Team",
      avatarInitials: "DCW"
    },
    content: [
      {
        type: "paragraph",
        text: "Moving to Canada or sending care packages, garments, sweets, and essential goods from India across the Pacific can seem daunting. With differing customs jurisdictions, strict CBSA guidelines, and multiple handling points, having a clear roadmap is crucial."
      },
      {
        type: "paragraph",
        text: "At **DCW Solutions Inc.**, we specialize in seamless door-to-door delivery connecting cities across India—including Delhi NCR, Punjab, Mumbai, Gujarat, and Hyderabad—directly to Canadian doorsteps across Ontario, British Columbia, Alberta, and beyond."
      },
      {
        type: "heading",
        text: "1. Understanding Transit Times & Flight Connectivity",
        style: "h2"
      },
      {
        type: "paragraph",
        text: "Standard express courier services typically take **4 to 7 business days** for major metropolitan hubs like Toronto (YYZ), Vancouver (YVR), and Montreal (YUL). For regional towns, allow an additional 1 to 2 business days for domestic final-mile delivery."
      },
      {
        type: "list",
        style: "bullet",
        items: [
          "**Express Air Courier:** 4-6 business days for time-sensitive documents and personal parcels.",
          "**Standard Air Cargo:** 7-10 business days for consolidated commercial shipments.",
          "**Sea Freight (LCL / FCL):** 35-50 days for bulk commercial cargo and full household relocations."
        ]
      },
      {
        type: "callout",
        text: "💡 **Pro Tip:** Always declare exact parcel weights and dimensions. Volumetric weight is calculated using the standard IATA formula: (Length × Width × Height in cm) ÷ 5000.",
        buttonText: "Calculate Rate",
        buttonLink: "/get-quote"
      },
      {
        type: "heading",
        text: "2. Canadian Customs & Declaration Essentials",
        style: "h2"
      },
      {
        type: "paragraph",
        text: "The Canada Border Services Agency (CBSA) requires accurate itemized declarations for all inbound consignments. Failure to declare contents accurately may lead to customs holds, inspection fees, or border delays."
      },
      {
        type: "table",
        tableData: [
          ["Item Category", "Declaration Requirement", "Customs Duty Status"],
          ["Homemade Sweets / Snacks", "Commercial packaging with sealed pouches", "Generally duty-free up to CAD $20"],
          ["New Clothing & Apparel", "Store invoice with itemized value", "Subject to applicable GST/HST and duty"],
          ["Used Personal Effects", "Unaccompanied baggage declaration (Form BSF186)", "Duty-free for qualifying newcomers / students"],
          ["Electronics & Gadgets", "Serial numbers and original invoice", "Subject to federal & provincial taxes"]
        ]
      },
      {
        type: "heading",
        text: "3. Packaging Standards for Trans-Pacific Transit",
        style: "h2"
      },
      {
        type: "paragraph",
        text: "International air shipments encounter multiple automated sortation conveyor belts and aircraft pressurization changes. Using high-grade double-walled corrugated cardboard boxes, internal bubble cushioning, and heavy-duty tape guarantees your items arrive intact."
      },
      {
        type: "divider"
      },
      {
        type: "paragraph",
        text: "Ready to send your parcel or book an import shipment to Canada? Our team is available 24/7 to provide instant quotes, pickup coordination across India, and real-time tracking until the box reaches your Canadian doorstep."
      }
    ]
  },
  {
    slug: "canadian-customs-cbsa-duty-guide-2026",
    category: "customs",
    icon: "📋",
    tag: "Customs & Compliance",
    title: "Navigating Canadian Customs (CBSA): Taxes, Duties, and Exemptions",
    description: "Everything you need to know about Canada Border Services Agency regulations, GST/HST thresholds, duty rates on apparel, and personal gifts from overseas.",
    readTime: "6 min",
    thumbClass: "thumb-customs",
    featured: false,
    publishedDate: "November 10, 2026",
    metaTitle: "Canadian Customs CBSA Duty Guide | DCW Solutions Inc.",
    metaDescription: "Understand CBSA import tariffs, gift exemptions, and customs clearance procedures for courier shipments into Canada.",
    author: {
      name: "DCW Compliance Team",
      avatarInitials: "DCW"
    },
    content: [
      {
        type: "paragraph",
        text: "Importing goods into Canada requires navigating the regulations enforced by the Canada Border Services Agency (CBSA). Whether you are an individual receiving a gift or a business importing inventory, understanding duty and tax liabilities avoids unexpected clearance bills."
      },
      {
        type: "heading",
        text: "The Canadian Gift Exemption Rule (CAD $60)",
        style: "h2"
      },
      {
        type: "paragraph",
        text: "Under Canadian customs law, genuine gifts sent from an individual abroad to an individual in Canada valued at **CAD $60 or less** per gift are exempt from duties and taxes. If the gift is valued over $60, duties and taxes only apply to the portion of the value that exceeds $60."
      },
      {
        type: "list",
        style: "bullet",
        items: [
          "Must be sent person-to-person (not from a commercial enterprise or company).",
          "Must include a gift card or clear notation stating 'Unsolicited Gift'.",
          "Tobacco, cannabis, and alcoholic beverages do not qualify for the gift exemption."
        ]
      },
      {
        type: "heading",
        text: "Provincial Sales Tax Overview (GST / HST)",
        style: "h2"
      },
      {
        type: "paragraph",
        text: "Depending on which province your shipment is destined for, the applicable tax rate varies according to provincial tax agreements:"
      },
      {
        type: "table",
        tableData: [
          ["Province", "Tax Type", "Total Rate"],
          ["Ontario (ON)", "HST", "13%"],
          ["British Columbia (BC)", "GST + PST", "5% + 7% = 12%"],
          ["Alberta (AB)", "GST Only", "5%"],
          ["Quebec (QC)", "GST + QST", "5% + 9.975% = 14.975%"],
          ["Nova Scotia (NS)", "HST", "15%"]
        ]
      },
      {
        type: "callout",
        text: "📌 **Notice:** DCW handles customs clearance coordination directly with licensed Canadian customs brokers, ensuring all paperwork complies with CBSA EDI standards.",
        buttonText: "Ask Our Customs Broker",
        buttonLink: "#contact"
      }
    ]
  },
  {
    slug: "how-door-to-door-courier-booking-works",
    category: "logistics",
    icon: "📦",
    tag: "International Logistics",
    title: "How DCW's Door-to-Door Courier Service Works from Pickup to Delivery",
    description: "Step-by-step breakdown of how our reverse logistics and scheduled pickup model delivers packages right from Indian pin codes directly to Canadian addresses.",
    readTime: "5 min",
    thumbClass: "thumb-logistics",
    featured: false,
    publishedDate: "November 5, 2026",
    metaTitle: "How Door-to-Door Courier Works | DCW Solutions Inc.",
    metaDescription: "Learn how DCW arranges pickup across India, manages air transit, and delivers directly to residential and commercial Canadian addresses.",
    author: {
      name: "DCW Operations",
      avatarInitials: "DCW"
    },
    content: [
      {
        type: "paragraph",
        text: "Booking international shipping used to mean visiting physical courier shops, filling out stacks of carbon-copy forms, and guessing when your parcel would arrive. DCW has modernized this process with transparent pricing and end-to-end management."
      },
      {
        type: "heading",
        text: "Step 1: Get an Instant Quote Online",
        style: "h3"
      },
      {
        type: "paragraph",
        text: "Input your shipment weight, box dimensions, and origin/destination details into our instant rate calculator to view all-inclusive door-to-door pricing with zero hidden surcharges."
      },
      {
        type: "heading",
        text: "Step 2: Convenient Doorstep Pickup in India",
        style: "h3"
      },
      {
        type: "paragraph",
        text: "Our field agents coordinate doorstep collection across 19,000+ Indian postal PIN codes. We weigh, inspect, label, and securely pack your goods before dispatch to the international air cargo terminal."
      },
      {
        type: "heading",
        text: "Step 3: Direct Air Transit & Canadian Final Mile",
        style: "h3"
      },
      {
        type: "paragraph",
        text: "Consignments are flown via scheduled carrier partners directly to Canadian gateways (Toronto, Vancouver, Montreal). Following expedited electronic customs release, regional express couriers complete last-mile delivery directly to your door."
      }
    ]
  }
];

async function seedBlogsIfEmpty() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial blog posts into DCW database...");
      await Blog.insertMany(INITIAL_BLOGS);
      console.log("✅ Successfully seeded initial blogs!");
    }
  } catch (err) {
    console.error("Error checking or seeding blogs:", err.message);
  }
}

module.exports = { INITIAL_BLOGS, seedBlogsIfEmpty };

