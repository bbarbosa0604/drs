#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const scriptName = process.argv[2];
const stackDirs = ["front-end", "backend", "mobile", "next-js"];

if (!scriptName) {
  console.error("Usage: node scripts/run-stack-script.js <script>");
  process.exit(1);
}

let failed = false;

for (const stackDir of stackDirs) {
  const packagePath = path.join(process.cwd(), stackDir, "package.json");

  if (!fs.existsSync(packagePath)) {
    continue;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    console.log(`Skipping ${stackDir}: script "${scriptName}" not found.`);
    continue;
  }

  console.log(`\n> ${stackDir}: npm run ${scriptName}`);
  const result = spawnSync("npm", ["--prefix", stackDir, "run", scriptName], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
