// Retakes pitch shots 4 and 5 only (cashflow + autopilot jar in chat).
// Run with OFFLINE_MODE=true server.
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

async function clickByText(page, text) {
  return page.evaluate((t) => {
    const btns = [...document.querySelectorAll("button")];
    const b = btns.find((b) => b.textContent.trim().includes(t));
    if (b) { b.click(); return true; }
    return false;
  }, text);
}

async function waitForStreamDone(page, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const streaming = await page.evaluate(() => {
      // TypingIndicator has 3 small green dots with inline animation style
      const dots = document.querySelectorAll('[style*="bounce"]');
      return dots.length > 0;
    });
    if (!streaming) break;
    await new Promise((r) => setTimeout(r, 300));
  }
  await new Promise((r) => setTimeout(r, 500));
}

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

// ── Shot 4: CashflowWarningCard in chat ─────────────────────────────────────
await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 20000 });
await new Promise((r) => setTimeout(r, 800));
await page.click('[aria-label="Открыть AI-ассистента"]');
await new Promise((r) => setTimeout(r, 600));
// Pick toxic persona
await clickByText(page, "Токсичный");
// Wait for opener stream to finish
await waitForStreamDone(page, 10000);
// Click chip
await clickByText(page, "зарплат");
await waitForStreamDone(page, 10000);
// Scroll chat to bottom
await page.evaluate(() => {
  const s = document.querySelector(".overflow-y-auto");
  if (s) s.scrollTop = s.scrollHeight;
});
await shot(page, "pitch4-cashflow-card");

// ── Shot 5: AutopilotJarCard in chat ────────────────────────────────────────
// Type "Что в копилке?" in the input (chips are gone after first message)
const input = await page.$('input[placeholder]');
if (input) {
  await input.type("Что в копилке?");
  await page.keyboard.press("Enter");
}
await waitForStreamDone(page, 10000);
await page.evaluate(() => {
  const s = document.querySelector(".overflow-y-auto");
  if (s) s.scrollTop = s.scrollHeight;
});
await shot(page, "pitch5-autopilot-jar");

await browser.close();
console.log("\nShots 4+5 done → pitch_deck/");
