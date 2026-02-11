import fs from 'node:fs';

export function getEnv(name: string, fallback?: string) {
  const fileVar = process.env[`${name}_FILE`];
  if (fileVar && fs.existsSync(fileVar)) {
    return fs.readFileSync(fileVar, 'utf8').trim();
  }

  const value = process.env[name];
  if (value !== undefined && value !== '') {
    return value;
  }

  return fallback;
}
