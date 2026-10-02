// Prints the TimeBack Reporting SQL for today's refresh (dates in Eastern time).
// event_time is a naive UTC timestamp: label it UTC first, then convert, or every time shifts 4h the wrong way.
// Usage: node tools/sql.mjs   -> paste the output into Timeback Reporting getData.
import { readFileSync } from "node:fs";

const cfg = JSON.parse(readFileSync(new URL("../config.json", import.meta.url)));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const add = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dow = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7;
const monday = add(today, -dow);
const prevMonday = add(monday, -7);
const paceFrom = add(today, -14);
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const names = cfg.courses.map((c) => q(c.course)).join(",");

console.log(`WITH a AS (SELECT subject, app_name, course_name, activity_name, earned_xp::numeric AS xp, correct_questions AS cq, total_questions AS tq, ((event_time AT TIME ZONE 'UTC') AT TIME ZONE 'America/New_York') AS t FROM rpt2_activity_log WHERE student_id=${q(cfg.studentId)})
SELECT 'day' AS kind, t::date::text AS d, subject AS s, '' AS c, ROUND(SUM(xp),1)::text AS v, '' AS w FROM a WHERE t::date >= '${prevMonday}' GROUP BY 2,3
UNION ALL SELECT 'course','',subject,course_name,ROUND(SUM(xp),1)::text,'' FROM a WHERE app_name<>'Alpha Test' AND course_name IN (${names}) GROUP BY 3,4
UNION ALL SELECT 'pace','',subject,'',ROUND(SUM(xp),1)::text,'' FROM a WHERE app_name<>'Alpha Test' AND t::date >= '${paceFrom}' AND t::date < '${today}' GROUP BY 3
UNION ALL SELECT 'test',t::date::text,subject,activity_name,ROUND(xp,0)::text,ROUND(100.0*cq/NULLIF(tq,0),0)::text FROM a WHERE app_name='Alpha Test' AND t::date >= '${prevMonday}'`);
