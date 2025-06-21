import Replicate from "replicate";
import ImageEmbed from "../models/ImageEmbed.js";
import axios from "axios";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export const getVectorEmbedPhoto = async (image) => {

    const data = {
        model: process.env.JINA_MODEL,
        input: [
            { image },
        ]
    };

    try {
        const response = await axios.post('https://api.jina.ai/v1/embeddings', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.JINA_API_KEY}`
            }
        });

        return response.data.data[0].embedding; // or return response.data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

}

export const getVectorEmbedMutiplePhoto = async (images) => {

    const data = {
        model: process.env.JINA_MODEL,
        input: images
    };

    try {
        const response = await axios.post('https://api.jina.ai/v1/embeddings', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.JINA_API_KEY}`
            }
        });

        return response.data.data; // or return response.data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

}

export const embedSinglePhoto = async (url, productId, projectId) => {
    try {
        const vector = await getVectorEmbedPhoto(url);
        const doc = new ImageEmbed({
            productId,
            projectId,
            vector,
            category: "product",
        })

        await doc.save();
    } catch (error) {
        console.error(error)
    }
}