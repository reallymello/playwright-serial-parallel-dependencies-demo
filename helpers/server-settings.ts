import { promises as fs } from 'node:fs';
import path from 'node:path';

// Stand-in for global server state (think web.config values or the server
// clock). It is one shared file, so every test in every worker sees it.
const SETTINGS_FILE = path.join(__dirname, '..', 'state', 'server-settings.json');

export interface ServerSettings {
  featureFlag: 'off' | 'on';
  serverDate: string;
}

export const DEFAULT_SETTINGS: ServerSettings = {
  featureFlag: 'off',
  serverDate: '2026-01-01',
};

export async function readSettings(): Promise<ServerSettings> {
  try {
    return JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8'));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function writeSettings(settings: ServerSettings): Promise<void> {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function resetSettings(): Promise<void> {
  await writeSettings(DEFAULT_SETTINGS);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
