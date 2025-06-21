import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: process.env.OPENAI_EMBEDDING_MODEL,
  apiKey: process.env.OPENAI_API_KEY,
});

export default embeddings;
