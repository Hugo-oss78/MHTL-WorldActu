// Génère les icônes PNG (PWA, iPhone) à partir d'un SVG, avec le Chromium de Playwright.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // Playwright doit être installé (globalement ou localement)
import { writeFile } from 'node:fs/promises';

const svg = (size, pad) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<rect width="64" height="64" fill="#0f1115"/>
<g transform="translate(32 32) scale(${1 - pad}) translate(-32 -32)" fill="none" stroke="#e9e6df">
<circle cx="32" cy="32" r="22" stroke-width="2.6"/>
<path d="M10 32h44M32 10c-8 6.5-11 14-11 22s3 15.5 11 22M32 10c8 6.5 11 14 11 22s-3 15.5-11 22" stroke-width="2"/>
</g></svg>`;

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, pad] of [['icon-192.png', 192, 0.1], ['icon-512.png', 512, 0.1], ['icon-maskable-512.png', 512, 0.3], ['apple-touch-icon.png', 180, 0.12]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${svg(size, pad)}</body></html>`);
  await writeFile(`public/${name}`, await page.screenshot({ clip: { x: 0, y: 0, width: size, height: size } }));
  console.log('écrit', name);
}
await browser.close();
