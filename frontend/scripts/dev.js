const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const flaskDir = path.resolve(__dirname, "..", "..", "resume-evaluator");
const flaskPython = path.join(flaskDir, ".venv", "Scripts", "python.exe");

if (!fs.existsSync(flaskPython)) {
  console.error("Could not find Flask's Python at:", flaskPython);
  console.error("Check that resume-evaluator/.venv exists.");
  process.exit(1);
}

console.log("Starting Flask backend...");
const flask = spawn(flaskPython, ["run.py"], {
  cwd: flaskDir,
  stdio: "inherit",
  // no shell here on purpose — shell:true breaks paths with spaces on Windows
});

flask.on("error", (err) => {
  console.error("Flask failed to start:", err);
});

console.log("Starting Next.js frontend...");
const next = spawn("npx", ["next", "dev"], {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit",
  shell: true,
});

next.on("error", (err) => {
  console.error("Next.js failed to start:", err);
});

function shutdown() {
  flask.kill();
  next.kill();
  process.exit();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);