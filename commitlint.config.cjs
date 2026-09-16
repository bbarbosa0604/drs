module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "test",
        "docs",
        "style",
        "chore",
        "ci",
        "perf",
        "build",
        "revert",
      ],
    ],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
  },
};
