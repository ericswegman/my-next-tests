// Saves a Timeback Reporting getData result as data.json for the page.
// Usage: node tools/save.mjs <result.json>   (the getData answer, or just its "data" array)
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(process.argv[2], "utf8"));
const rows = Array.isArray(raw) ? raw : raw.data;
if (!Array.isArray(rows) || !rows.length) { console.error("No rows found; data.json left unchanged."); process.exit(1); }
const keep = ["kind", "d", "s", "c", "v", "w"];
const clean = rows.map((r) => Object.fromEntries(keep.map((k) => [k, r[k] ?? ""])));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
writeFileSync(new URL("../data.json", import.meta.url), JSON.stringify({ generatedFor: today, updatedAt: new Date().toISOString(), rows: clean }, null, 1) + "\n");
console.log(`data.json: ${clean.length} rows for ${today}`);
