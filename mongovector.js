import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import embeddings from "./config/textembed.js";
dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();


// For Business Description
const baseInformationCollection = client
    .db("chatbot")
    .collection("Information");

const baseInformationVectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: baseInformationCollection,
    indexName: "baseinfo_vector_index",
    textKey: "content",
    embeddingKey: "vector",
});



// For chatbot
const trainingCollection = client.db("chatbot").collection("Training");



export { baseInformationCollection, baseInformationVectorStore, trainingCollection, client };