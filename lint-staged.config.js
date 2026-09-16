const path = require("node:path");

/**
 * Aspas duplas, nunca aspas simples: cmd.exe (Windows) nao reconhece `'...'` como
 * delimitador de string — um path entre aspas simples chega ao processo com as aspas
 * literais coladas no nome, quebrando o comando. Aspas duplas funcionam tanto em
 * cmd.exe quanto em shells POSIX. Bug real encontrado ao commitar um projeto gerado
 * a partir deste scaffold no Windows.
 */
const quote = (value) => `"${value.replace(/"/g, '\\"')}"`;

const toRepoRelative = (file) =>
  path.relative(process.cwd(), file).split(path.sep).join("/");

const toStackRelative = (file, stackDir) =>
  path.relative(stackDir, file).split(path.sep).join("/");

const toStackFiles = (files, stackDir) =>
  files
    .map(toRepoRelative)
    .filter((file) => file.startsWith(`${stackDir}/`))
    .map((file) => toStackRelative(file, stackDir))
    .filter(Boolean)
    .map(quote);

/**
 * `npm --prefix <dir> run lint:staged -- ...` no lugar de `cd <dir> && ...`. Dois
 * problemas reais descartaram alternativas mais obvias, confirmados testando de
 * verdade (nao so lendo doc):
 *
 * 1. `cd <dir> && comando` depende do parser de encadeamento/aspas do shell — cmd.exe
 *    (Windows) trata `&&` e aspas de forma diferente do bash, e quebrava o comando de
 *    verdade em producao.
 * 2. `npm --prefix <dir> exec eslint -- --fix <arquivo>` NAO ajusta o cwd do processo
 *    filho (confirmado: `--prefix` com `exec` so decide onde resolver o binario; o
 *    eslint roda com o cwd original, e regras que depende de cwd — como resolucao de
 *    "pages directory" do plugin do Next.js — silenciosamente resolvem o caminho
 *    errado). So `npm --prefix <dir> run <script>` ajusta o cwd de fato, porque scripts
 *    do package.json sempre rodam com cwd = diretorio do package.json.
 *
 * Por isso cada stack tem um script `lint:staged` proprio (`eslint --fix`, sem glob
 * fixo) — so assim o eslint local resolve `eslint.config.*` e as regras dependentes de
 * cwd do jeito certo, sem precisar de `--config` explicito nem de `cd`.
 */
const stackCommand = (stackDir, files) => {
  const stackFiles = toStackFiles(files, stackDir);

  if (stackFiles.length === 0) {
    return [];
  }

  return [
    `npm --prefix ${quote(stackDir)} run lint:staged -- ${stackFiles.join(" ")}`,
  ];
};

module.exports = {
  "front-end/**/*.{js,jsx,ts,tsx}": (files) => stackCommand("front-end", files),
  "backend/**/*.{js,ts}": (files) => stackCommand("backend", files),
  "mobile/**/*.{js,jsx,ts,tsx}": (files) => stackCommand("mobile", files),
  "next-js/**/*.{js,jsx,ts,tsx}": (files) => stackCommand("next-js", files),
  "*.{js,json,md,yml,yaml}": "prettier --write",
  ".github/**/*.{yml,yaml,md}": "prettier --write",
  "docs/**/*.{md,json,yml,yaml}": "prettier --write",
  "tasks/**/*.{md,json,yml,yaml}": "prettier --write",
  "scripts/**/*.js": "prettier --write",
};
