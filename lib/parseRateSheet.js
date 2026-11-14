const XLSX = require("xlsx");

/** Parse "11 KG – 15 KG" / "21 + KG" / "1 KG" into numeric bounds */
function parseSlab(label) {
  const clean = String(label || "").replace(/\s+/g, " ").trim().toUpperCase();

  // "21 + KG" or "21+ KG"
  let m = clean.match(/^(\d+(?:\.\d+)?)\s*\+\s*KG$/);
  if (m) return { from: parseFloat(m[1]), to: null };

  // "11 KG – 15 KG" (en-dash, em-dash, hyphen)
  m = clean.match(/^(\d+(?:\.\d+)?)\s*KG\s*[–\-—]\s*(\d+(?:\.\d+)?)\s*KG$/);
  if (m) return { from: parseFloat(m[1]), to: parseFloat(m[2]) };

  // "1 KG"
  m = clean.match(/^(\d+(?:\.\d+)?)\s*KG$/);
  if (m) {
    const v = parseFloat(m[1]);
    return { from: v, to: v };
  }

  return null;
}

function parseRateSheet(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error("No worksheet found in file");

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  const flat = (r) => r.map((c) => String(c ?? "").trim());

  let companyName = "";
  let address = null;
  let title = "";
  let transitTime = null;
  const zones = [];
  const rates = [];

  let section = "none"; // "zones" | "rates" | "none"
  let rateHeaders = [];
  let unitColIndex = -1;

  for (const raw of rows) {
    const row = flat(raw);
    if (row.every((c) => !c)) continue;
    const joined = row.join(" ").trim();
    const upper = joined.toUpperCase();

    // ---- Metadata ----
    if (!companyName && upper.includes("DCW SOLUTIONS")) {
      companyName = row.find((c) => c) || "DCW SOLUTIONS";
      continue;
    }
    if (!address && /RICHMOND|CANADA/i.test(joined) && joined.length > 15) {
      address = row.find((c) => c.length > 10) || null;
      continue;
    }
    if (!title && /RATE SHEET/i.test(joined)) {
      title = row.find((c) => c) || "Rate Sheet";
      continue;
    }

    // ---- Section switches ----
    if (/^ZONES?$/i.test(row[0] || "")) {
      section = "zones";
      continue;
    }
    if (/^TRANSIT TIME/i.test(row[0] || "")) {
      section = "none";
      continue;
    }
    if (/^SLAB\s*&\s*BULK RATES/i.test(row[0] || "")) {
      section = "rates";
      continue;
    }

    // Transit time value
    if (!transitTime && /Business Days/i.test(joined)) {
      transitTime = joined;
      continue;
    }

    // ---- Parse zones ----
    if (section === "zones") {
      const zoneName = row[0];
      const statesCell = row[1] || "";
      if (/^Zone\s+[A-Z]$/i.test(zoneName)) {
        const states = statesCell
          .split(/[·•|,]/)
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean);
        zones.push({ name: zoneName.trim(), states, sortOrder: zones.length });
      }
      continue;
    }

    // ---- Parse rates ----
    if (section === "rates") {
      if (/WEIGHT SLAB/i.test(row[0] || "")) {
        rateHeaders = row.slice(1).map((h) => String(h).toUpperCase());
        unitColIndex = rateHeaders.findIndex((h) => /UNIT/i.test(h));
        continue;
      }

      if (!rateHeaders.length) continue;

      const slabLabel = row[0];
      const parsed = parseSlab(slabLabel);
      if (!parsed) continue;

      const valueCols = rateHeaders
        .map((header, i) => ({ header, colIndex: i + 1 }))
        .filter(({ header }) => !/UNIT/i.test(header) && header !== "");

      const unit =
        unitColIndex >= 0
          ? String(row[unitColIndex + 1] || "per kg").trim()
          : "per kg";

      for (const { header, colIndex } of valueCols) {
        const rawPrice = row[colIndex];
        const price = parseFloat(String(rawPrice).replace(/[^\d.]/g, ""));
        if (isNaN(price)) continue;
        rates.push({
          zoneName: header.replace(/\s+/g, " ").trim(),
          slabLabel: String(slabLabel).trim(),
          weightFrom: parsed.from,
          weightTo: parsed.to,
          pricePerKg: price,
          unit,
          sortOrder: rates.length,
        });
      }
    }
  }

  if (!rates.length) throw new Error("No rate rows detected in file");
  if (!zones.length) throw new Error("No zones detected in file");

  return {
    title: title || "International Shipping Rate Sheet",
    companyName: companyName || "DCW SOLUTIONS",
    address,
    transitTime,
    zones,
    rates,
  };
}

module.exports = { parseRateSheet };