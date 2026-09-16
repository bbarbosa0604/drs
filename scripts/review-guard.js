#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const DEFAULT_CONFIG = {
  warningFileLines: 800,
  criticalFileLines: 1200,
  warningCommitFiles: 15,
  warningPrFiles: 25,
  criticalPrFiles: 60,
  warningPrChangedLines: 1000,
  criticalPrChangedLines: 2500,
  maxTypesPerFileWarning: 8,
  maxFunctionsPerFileWarning: 10,
  largeFileChangedLinesStrict: 300,
  ignoredPaths: [
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".next",
    ".turbo",
    ".expo",
    "generated",
  ],
  typeFilePatterns: [
    ".types.",
    "types.ts",
    "typings.ts",
    "dto.ts",
    "schema.ts",
  ],
  utilsFilePatterns: [".utils.", "utils.ts", ".helpers.", "helpers.ts"],
};

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".md",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const DEPENDENCY_FILES = new Set([
  "package.json",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lock",
  "bun.lockb",
]);

const args = process.argv.slice(2);
const mode = args.includes("--pr") ? "pr" : "staged";
const strict =
  process.env.REVIEW_GUARD_STRICT === "true" || args.includes("--strict");
const summaryFile = getArgValue("--summary-file");
const config = loadConfig();

main();

function main() {
  const diff = mode === "pr" ? getPrDiff() : getStagedDiff();
  const relevantFiles = diff.files.filter((file) => !isIgnored(file.path));
  const warnings = [];
  const failures = [];
  const summary = {
    mode,
    strict,
    changedFiles: relevantFiles.length,
    addedLines: sum(relevantFiles.map((file) => file.added)),
    removedLines: sum(relevantFiles.map((file) => file.removed)),
    domains: [],
    largeFiles: [],
  };

  evaluateFileCount(relevantFiles, warnings, failures);
  evaluateChangedLines(summary, warnings, failures);
  evaluateDomains(relevantFiles, warnings, summary);
  evaluateDependencyMix(relevantFiles, warnings);
  evaluateFiles(relevantFiles, warnings, failures, summary);

  printReport(warnings, failures, summary);
  writeSummaryFile(warnings, failures, summary);

  if (failures.length > 0) {
    process.exit(1);
  }
}

function loadConfig() {
  const configPath = path.join(process.cwd(), "review-guard.config.json");

  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  return {
    ...DEFAULT_CONFIG,
    ...JSON.parse(fs.readFileSync(configPath, "utf8")),
  };
}

function getArgValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function getStagedDiff() {
  return {
    files: parseNameStatus(
      runGit(["diff", "--cached", "--name-status", "--diff-filter=ACMR"]),
    ).map((file) => ({
      ...file,
      ...getNumstatForPath(["diff", "--cached", "--numstat", "--", file.path]),
    })),
  };
}

function getPrDiff() {
  const base = getArgValue("--base") || process.env.GITHUB_BASE_REF || "main";
  const head = getArgValue("--head") || process.env.GITHUB_SHA || "HEAD";
  const range = resolveRange(base, head);
  const files = parseNameStatus(
    runGit(["diff", "--name-status", "--diff-filter=ACMR", range]),
  ).map((file) => ({
    ...file,
    ...getNumstatForPath(["diff", "--numstat", range, "--", file.path]),
  }));

  return { files };
}

function resolveRange(base, head) {
  const candidates = [
    `origin/${base}...${head}`,
    `${base}...${head}`,
    `HEAD~1...${head}`,
  ];

  for (const candidate of candidates) {
    try {
      runGit(["diff", "--name-only", candidate]);
      return candidate;
    } catch {
      // Try the next range.
    }
  }

  return `HEAD~1...${head}`;
}

function getNumstatForPath(gitArgs) {
  const output = runGit(gitArgs, { allowFailure: true });
  const [line] = output.split("\n").filter(Boolean);

  if (!line) {
    return { added: 0, removed: 0 };
  }

  const [added, removed] = line.split("\t");

  return {
    added: Number.parseInt(added, 10) || 0,
    removed: Number.parseInt(removed, 10) || 0,
  };
}

function parseNameStatus(output) {
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, ...fileParts] = line.split("\t");
      const filePath = fileParts[fileParts.length - 1];

      return { status, path: filePath };
    });
}

function evaluateFileCount(files, warnings, failures) {
  const warningLimit =
    mode === "pr" ? config.warningPrFiles : config.warningCommitFiles;

  if (files.length > warningLimit) {
    warnings.push(
      `This ${mode === "pr" ? "PR" : "commit"} changes ${files.length} files. Consider splitting it by responsibility.`,
    );
  }

  if (
    strict &&
    mode === "pr" &&
    files.length > config.criticalPrFiles &&
    !hasExceptionLabel()
  ) {
    failures.push(
      `This PR changes ${files.length} files, above the strict limit of ${config.criticalPrFiles}.`,
    );
  }
}

function evaluateChangedLines(summary, warnings, failures) {
  const changedLines = summary.addedLines + summary.removedLines;

  if (mode === "pr" && changedLines > config.warningPrChangedLines) {
    warnings.push(
      `This PR changes ${changedLines} lines. Consider splitting it into smaller reviewable PRs.`,
    );
  }

  if (
    strict &&
    mode === "pr" &&
    changedLines > config.criticalPrChangedLines &&
    !hasExceptionLabel()
  ) {
    failures.push(
      `This PR changes ${changedLines} lines, above the strict limit of ${config.criticalPrChangedLines}.`,
    );
  }
}

function evaluateDomains(files, warnings, summary) {
  const domains = [
    ...new Set(files.map((file) => detectDomain(file.path)).filter(Boolean)),
  ].sort();
  summary.domains = domains;

  if (domains.length > 3) {
    warnings.push(
      `This ${mode === "pr" ? "PR" : "commit"} touches multiple domains: ${domains.join(
        ", ",
      )}. Consider splitting into smaller changes if these are not strongly related.`,
    );
  }
}

function evaluateDependencyMix(files, warnings) {
  const dependencyFiles = files.filter((file) => isDependencyFile(file.path));
  const featureFiles = files.filter(
    (file) => !isDependencyFile(file.path) && isFeatureLikeFile(file.path),
  );

  if (dependencyFiles.length > 0 && featureFiles.length > 5) {
    warnings.push(
      "Dependency or lock files changed together with several feature files. Make sure dependency changes are intentional.",
    );
  }
}

function evaluateFiles(files, warnings, failures, summary) {
  for (const file of files) {
    if (!isReadableTextFile(file.path)) {
      continue;
    }

    const text = fs.readFileSync(file.path, "utf8");
    const lineCount = text.length === 0 ? 0 : text.split("\n").length;
    const changedLines = file.added + file.removed;

    if (lineCount > config.criticalFileLines) {
      const message = `${file.path} has ${lineCount} lines. This is extremely large; consider splitting responsibilities.`;
      warnings.push(message);
      summary.largeFiles.push(file.path);

      if (
        strict &&
        (file.status.startsWith("A") ||
          changedLines > config.largeFileChangedLinesStrict)
      ) {
        failures.push(
          `${file.path} exceeds ${config.criticalFileLines} lines and is new or heavily changed.`,
        );
      }
    } else if (lineCount > config.warningFileLines) {
      warnings.push(
        `${file.path} has ${lineCount} lines. Consider splitting responsibilities if this file is handling multiple concerns.`,
      );
      summary.largeFiles.push(file.path);
    }

    evaluateTypeCount(file.path, text, warnings);
    evaluateFunctionCount(file.path, text, warnings);
  }
}

function evaluateTypeCount(filePath, text, warnings) {
  if (!/\.(ts|tsx)$/.test(filePath) || isTypeContainer(filePath)) {
    return;
  }

  const matches =
    text.match(/\b(?:export\s+)?(?:interface|type)\s+[A-Z][A-Za-z0-9_]*/g) ||
    [];

  if (matches.length > config.maxTypesPerFileWarning) {
    warnings.push(
      `${filePath} declares ${matches.length} types/interfaces. Consider extracting shared types to .types.ts, types.ts, or a types folder if they are not purely local.`,
    );
  }
}

function evaluateFunctionCount(filePath, text, warnings) {
  if (!/\.(js|jsx|ts|tsx)$/.test(filePath) || isUtilityContainer(filePath)) {
    return;
  }

  const declarations = text.match(/\bfunction\s+[A-Za-z0-9_]+\s*\(/g) || [];
  const arrowFunctions =
    text.match(
      /\b(?:const|let|var)\s+[A-Za-z0-9_]+\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>/g,
    ) || [];
  const functions = declarations.length + arrowFunctions.length;

  if (functions > config.maxFunctionsPerFileWarning) {
    warnings.push(
      `${filePath} declares ${functions} functions. Consider moving reusable helpers to utils/helpers if responsibilities are accumulating.`,
    );
  }
}

function detectDomain(filePath) {
  const segments = normalizePath(filePath).split("/");
  const [root] = segments;

  if (!root) {
    return null;
  }

  const srcIndex = segments.indexOf("src");
  if (srcIndex !== -1 && segments[srcIndex + 1]) {
    const afterSrc = segments[srcIndex + 1];
    const next = segments[srcIndex + 2];

    if (
      [
        "components",
        "features",
        "modules",
        "screens",
        "services",
        "stores",
      ].includes(afterSrc) &&
      next
    ) {
      return next;
    }

    return afterSrc;
  }

  if (["apps", "packages", "libs"].includes(root) && segments[1]) {
    return segments[1];
  }

  if (
    [
      "front-end",
      "backend",
      "mobile",
      "next-js",
      "tools",
      "scripts",
      "docs",
      "tasks",
    ].includes(root)
  ) {
    return segments[1] || root;
  }

  return root;
}

function isIgnored(filePath) {
  const normalized = normalizePath(filePath);

  return (
    config.ignoredPaths.some((ignoredPath) => {
      const ignored = normalizePath(ignoredPath).replace(/\/$/, "");
      return (
        normalized === ignored ||
        normalized.startsWith(`${ignored}/`) ||
        normalized.includes(`/${ignored}/`)
      );
    }) || /\.min\.(js|css)$/.test(normalized)
  );
}

function isDependencyFile(filePath) {
  return DEPENDENCY_FILES.has(path.basename(filePath));
}

function isFeatureLikeFile(filePath) {
  return (
    /\.(js|jsx|ts|tsx|css|scss|md|json|yaml|yml)$/.test(filePath) &&
    !isIgnored(filePath)
  );
}

function isReadableTextFile(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

function isTypeContainer(filePath) {
  const normalized = normalizePath(filePath);

  return (
    normalized.includes("/types/") ||
    normalized.includes("/schemas/") ||
    normalized.includes("/dto/") ||
    config.typeFilePatterns.some(
      (pattern) => normalized.endsWith(pattern) || normalized.includes(pattern),
    )
  );
}

function isUtilityContainer(filePath) {
  const normalized = normalizePath(filePath);

  return (
    normalized.includes("/utils/") ||
    normalized.includes("/helpers/") ||
    config.utilsFilePatterns.some(
      (pattern) => normalized.endsWith(pattern) || normalized.includes(pattern),
    )
  );
}

function hasExceptionLabel() {
  const labels = (process.env.PR_LABELS || "")
    .split(",")
    .map((label) => label.trim().toLowerCase())
    .filter(Boolean);

  return labels.some((label) =>
    ["review-guard:exception", "large-pr-approved"].includes(label),
  );
}

function printReport(warnings, failures, summary) {
  console.log("\nReview Guard\n");

  if (mode === "pr") {
    console.log("Summary:\n");
    console.log(`* Changed files: ${summary.changedFiles}`);
    console.log(`* Added lines: ${summary.addedLines}`);
    console.log(`* Removed lines: ${summary.removedLines}`);
    console.log(
      `* Domains touched: ${summary.domains.length > 0 ? summary.domains.join(", ") : "none"}`,
    );
    console.log(`* Large files: ${summary.largeFiles.length}`);
    console.log("");
  }

  if (warnings.length === 0 && failures.length === 0) {
    console.log("Review Guard passed with no warnings.");
    return;
  }

  if (warnings.length > 0) {
    console.log("Warnings:\n");
    for (const warning of warnings) {
      console.log(`* ${warning}`);
    }
    console.log("");
  }

  if (failures.length > 0) {
    console.log("Failures:\n");
    for (const failure of failures) {
      console.log(`* ${failure}`);
    }
    console.log("");
    return;
  }

  console.log("These are warnings only. Commit is allowed.");
}

function writeSummaryFile(warnings, failures, summary) {
  if (!summaryFile) {
    return;
  }

  const lines = ["## PR Review Guard", ""];

  if (failures.length > 0) {
    lines.push("This PR has strict Review Guard failures.", "");
  } else if (warnings.length > 0) {
    lines.push("This PR may be difficult to review.", "");
  } else {
    lines.push("Review Guard passed with no warnings.", "");
  }

  lines.push("### Summary", "");
  lines.push(`* Changed files: ${summary.changedFiles}`);
  lines.push(`* Added lines: ${summary.addedLines}`);
  lines.push(`* Removed lines: ${summary.removedLines}`);
  lines.push(
    `* Domains touched: ${summary.domains.length > 0 ? summary.domains.join(", ") : "none"}`,
  );
  lines.push(`* Large files: ${summary.largeFiles.length}`);
  lines.push("");

  if (warnings.length > 0) {
    lines.push("### Warnings", "");
    warnings.forEach((warning) => lines.push(`* ${warning}`));
    lines.push("");
  }

  if (failures.length > 0) {
    lines.push("### Failures", "");
    failures.forEach((failure) => lines.push(`* ${failure}`));
    lines.push("");
  }

  if (warnings.length > 0 || failures.length > 0) {
    lines.push("### Suggestions", "");
    lines.push(
      "* Consider splitting feature implementation, refactor, and tests into separate PRs.",
    );
    lines.push("* Make sure dependency changes are intentional.");
    lines.push("* Add review notes explaining the main areas changed.");
    lines.push("");
  }

  fs.writeFileSync(summaryFile, `${lines.join("\n")}\n`);
}

function runGit(gitArgs, options = {}) {
  try {
    return execFileSync("git", gitArgs, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", options.allowFailure ? "ignore" : "pipe"],
    }).trim();
  } catch (error) {
    if (options.allowFailure) {
      return "";
    }

    throw error;
  }
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}
