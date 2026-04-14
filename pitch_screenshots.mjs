// Captures 4 pitch screenshots via Puppeteer interaction.
// Run with OFFLINE_MODE=true server for instant fallback responses.
// node pitch_screenshots.mjs
import puppeteer from "puppeteer-core";
import { readdirSync, copyFileSync } from "fs";
import { join } from "path";

const screenshotsDir = "./temporary screenshots";
const pitchDir = "./pitch_deck";

function nextNum() {
  const existing = readdirSync(screenshotsDir).filter((f) => f.startsWith("screenshot-") && f.endsWith(".png"));
  const nums = existing.map((f) => parseInt(f.replace("screenshot-", "").split(/[-\.]/)[0])).filter(Boolean);
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}

const base = "/var/lib/flatpak/app/com.google.Chrome/x86_64/stable";
const dirs = readdirSync(base);
const CHROME = `${base}/${dirs[0]}/files/extra/chrome`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function shot(page, label) {
  await new Promise((r) => setTimeout(r, 600));
  const n = nextNum();
  const p = join(screenshotsDir, `screenshot-${n}-${label}.png`);
  await page.screenshot({ path: p });
  copyFileSync(p, join(pitchDir, `${label}.png`));
  console.log(`✓ ${label}`);
}

// Helper: click button by text substring
async function clickByText(page, text) {
  return page.evaluate((t) => {
    const btns = [...document.querySelectorAll("button")];
    const b = btns.find((b) => b.textContent.trim().includes(t));
    if (b) { b.click(); return true; }
    return false;
  }, text);
}

// Wait until no typing indicator (streaming done)
async function waitForStreamDone(page, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const streaming = await page.evaluate(() => {
      // Typing indicator has 3 green bouncing dots
      const dots = document.querySelectorAll(".rounded-full.bg-\\[\\#009C4D\\]");
      return dots.length >= 3;
    });
    if (!streaming) break;
    await new Promise((r) => setTimeout(r, 300));
  }
  await new Promise((r) => setTimeout(r, 400));
}

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

// ── Shot 2: Persona picker ──────────────────────────────────────────────────
await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 20000 });
await new Promise((r) => setTimeout(r, 800));
await page.click('[aria-label="Открыть AI-ассистента"]');
await new Promise((r) => setTimeout(r, 700));
await shot(page, "pitch2-persona-picker");

// ── Shot 3: Intercept banner (toxic) ────────────────────────────────────────
await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 20000 });
await new Promise((r) => setTimeout(r, 800));
// Dev trigger button has title "Dev: симулировать трату" and shows 💥 emoji
const devBtn = await page.$('[title="Dev: симулировать трату"]');
if (devBtn) {
  await devBtn.click();
  console.log("Clicked dev trigger button");
} else {
  console.warn("Dev button not found, trying emoji click");
  await clickByText(page, "💥");
}
await new Promise((r) => setTimeout(r, 900));
await shot(page, "pitch3-intercept-toxic");

// ── Shot 4: CashflowWarningCard in chat ─────────────────────────────────────
await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 20000 });
await new Promise((r) => setTimeout(r, 800));
// Open AI chat
await page.click('[aria-label="Открыть AI-ассистента"]');
await new Promise((r) => setTimeout(r, 700));
// Pick toxic persona
await clickByText(page, "Токсичный");
// Wait for opener to load (OFFLINE_MODE = instant)
await waitForStreamDone(page, 8000);
// Now click chip "Хватит до зарплаты?"
await clickByText(page, "зарплат");
await waitForStreamDone(page, 8000);
await shot(page, "pitch4-cashflow-card");

// ── Shot 5: AutopilotJarCard in chat ────────────────────────────────────────
// Send "Что в копилке?" — chips might be gone now; try input
const hasChip = await clickByText(page, "копилк");
if (!hasChip) {
  // Type into composer
  const input = await page.$('input[placeholder]');
  if (input) {
    await input.type("Что в копилке?");
    await page.keyboard.press("Enter");
  }
}
await waitForStreamDone(page, 8000);
// Scroll to bottom of chat
await page.evaluate(() => {
  const scrollable = document.querySelector(".overflow-y-auto");
  if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
});
await new Promise((r) => setTimeout(r, 400));
await shot(page, "pitch5-autopilot-jar");

await browser.close();
console.log("\nAll pitch screenshots done → pitch_deck/");
