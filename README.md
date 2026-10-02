# My Next Tests

Lorenzo's weekly planner: his Monday-to-Sunday week toward 600 XP, how far he is from each test, and a day-by-day lesson plan.

- `index.html` is the page. It reads `config.json` and `data.json`.
- `config.json` maps each course to the test it leads to. Update it whenever a new course is assigned.
- `data.json` holds the TimeBack numbers. To refresh it, run `node tools/sql.mjs`, run that SQL with Timeback Reporting `getData`, save the result to a file, then run `node tools/save.mjs <file>` and push.

The plan Lorenzo makes saves in his browser only.
