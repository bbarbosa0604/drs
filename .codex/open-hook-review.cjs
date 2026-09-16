'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CODEX_BINARY_NAME = process.platform === 'win32' ? 'codex.exe' : 'codex';

function launchCodex(executable) {
  const result = spawnSync(executable, ['/hooks'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: false
  });

  if (result.error && result.error.code === 'ENOENT') {
    return false;
  }

  if (result.error) {
    console.error(`Nao foi possivel abrir a revisao dos hooks: ${result.error.message}`);
    process.exitCode = 1;
    return true;
  }

  process.exitCode = typeof result.status === 'number' ? result.status : 0;
  return true;
}

function findBinary(directory, depth) {
  if (depth < 0) {
    return null;
  }

  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (_) {
    return null;
  }

  for (const entry of entries) {
    if (entry.isFile() && entry.name.toLowerCase() === CODEX_BINARY_NAME) {
      return path.join(directory, entry.name);
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const match = findBinary(path.join(directory, entry.name), depth - 1);
    if (match) {
      return match;
    }
  }

  return null;
}

function findBundledCodex() {
  const extensionRoots = [
    path.join(os.homedir(), '.vscode', 'extensions'),
    path.join(os.homedir(), '.vscode-insiders', 'extensions')
  ];

  for (const extensionRoot of extensionRoots) {
    let extensionDirectories;
    try {
      extensionDirectories = fs
        .readdirSync(extensionRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('openai.chatgpt-'))
        .map((entry) => ({
          path: path.join(extensionRoot, entry.name),
          modifiedAt: fs.statSync(path.join(extensionRoot, entry.name)).mtimeMs
        }))
        .sort((left, right) => right.modifiedAt - left.modifiedAt);
    } catch (_) {
      continue;
    }

    for (const extensionDirectory of extensionDirectories) {
      const executable = findBinary(path.join(extensionDirectory.path, 'bin'), 3);
      if (executable) {
        return executable;
      }
    }
  }

  return null;
}

if (!launchCodex('codex')) {
  const bundledCodex = findBundledCodex();

  if (!bundledCodex || !launchCodex(bundledCodex)) {
    console.error(
      'Codex nao foi encontrado. Instale ou habilite a extensao oficial do Codex no VS Code.'
    );
    process.exitCode = 1;
  }
}
