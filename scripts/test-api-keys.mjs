/**
 * Test OpenAI and Resend API keys from .env. Run: node scripts/test-api-keys.mjs
 * Does not print key values.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const parentRoot = resolve(appRoot, "..");

function loadEnv() {
  for (const root of [appRoot, parentRoot]) {
    const envPath = resolve(root, ".env");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^\s*([^#=]+)=(.*)$/);
        if (m) {
          const k = m[1].trim();
          const v = m[2].trim().replace(/\r$/, "").replace(/^["']|["']$/g, "");
          if (k && v !== undefined) process.env[k] = v;
        }
      }
      return;
    }
  }
}

loadEnv();

const openaiKey = process.env.OPENAI_API_KEY;
const resendKey = process.env.RESEND_API_KEY;

async function testOpenAI() {
  if (!openaiKey) {
    console.log("OPENAI: skip (OPENAI_API_KEY not set)");
    return;
  }
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${openaiKey}` },
    });
    if (res.ok) {
      console.log("OPENAI: OK (key valid)");
      return;
    }
    const err = await res.json().catch(() => ({}));
    console.error("OPENAI: fail –", err.error?.message || res.statusText);
  } catch (e) {
    console.error("OPENAI: error –", e.message);
  }
}

async function testResend() {
  if (!resendKey) {
    console.log("RESEND: skip (RESEND_API_KEY not set)");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Investment Tracker <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "API key test",
        html: "<p>Test from Investment Tracker – key works.</p>",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) {
      console.log("RESEND: OK (key valid, test email sent to Resend test inbox)");
      return;
    }
    console.error("RESEND: fail –", data.message || data.error || res.statusText);
  } catch (e) {
    console.error("RESEND: error –", e.message);
  }
}

(async () => {
  console.log("Testing API keys from .env ...\n");
  await testOpenAI();
  await testResend();
  console.log("\nDone.");
})();
