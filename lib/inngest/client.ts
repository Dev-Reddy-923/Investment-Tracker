import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "mockfolio",
  ai: { openai: { apiKey: process.env.OPENAI_API_KEY! } },
});
