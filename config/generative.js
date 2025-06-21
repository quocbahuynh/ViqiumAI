import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: process.env.OPENAI_GENERATIVE_MODEL,
  temperature: 0.1,
  apiKey: process.env.OPENAI_API_KEY,
  maxTokens: 600,
}).bind({
  response_format: { type: "json_object" },
});

export const modelText = new ChatOpenAI({
  model: process.env.OPENAI_GENERATIVE_MODEL,
  temperature: 0.1,
  apiKey: process.env.OPENAI_API_KEY,
  maxTokens: 600,
});

export default model;
