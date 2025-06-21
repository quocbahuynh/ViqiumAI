import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});


 const output = await replicate.run(
  process.env.REPLICATE_MODEL,
  {
    input: {
      image: "https://chatbotai.b-cdn.net/29ad1b64-2fd5-4e11-ad0b-664fdf59ac6c.webp"
    }
  }
);

console.log(output)
