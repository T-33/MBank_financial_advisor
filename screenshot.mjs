// screenshot.mjs — takes a screenshot of a URL using puppeteer-core + local Chrome
// Usage: node screenshot.mjs <url> [label]
// Saves to: ./temporary screenshots/screenshot-N[-label].png

import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const screenshotsDir = join(__dirname, "temporary screenshots");
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

// Auto-increment screenshot number
const existing = readdirSync(screenshotsDir).filter((f) => f.startsWith("screenshot-") && f.endsWith(".png"));
const nums = existing.map((f) => parseInt(f.replace("screenshot-", "").split(/[-\.]/)[0])).filter(Boolean);
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = join(screenshotsDir, filename);

// Try flatpak Chrome on Linux, fall back to Windows path
const CHROME_PATH =
  existsSync("/var/lib/flatpak/app/com.google.Chrome/x86_64/stable")
    ? (() => {
        const base = "/var/lib/flatpak/app/com.google.Chrome/x86_64/stable";
        const dirs = readdirSync(base);
        return `${base}/${dirs[0]}/files/extra/chrome`;
      })()
    : "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
await new Promise((r) => setTimeout(r, 800)); // let animations settle
await page.screenshot({ path: outPath, fullPage: false });

await browser.close();
console.log(`Screenshot saved: ${outPath}`);
