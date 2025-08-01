import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY environment variable not set.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  try {
    const prompt = "Write a story about a magic backpack.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("Error connecting to Google AI:", error);
  }
}

run();
