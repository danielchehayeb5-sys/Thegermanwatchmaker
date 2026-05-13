import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] ? `-${process.argv[3]}` : "";

const dir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter((f) => f.startsWith("screenshot-") && f.endsWith(".png"));
const nums = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] || "0")).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}${label}.png`;

const browser = await puppeteer.launch({
  executablePath: "C:/Users/nateh/.cache/puppeteer/chrome/win64-136.0.7103.92/chrome-win64/chrome.exe",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle2" });
await page.screenshot({ path: path.join(dir, filename), fullPage: true });
await browser.close();
console.log(`Screenshot saved: temporary screenshots/${filename}`);
