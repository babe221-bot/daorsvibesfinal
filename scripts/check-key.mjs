import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Error: GOOGLE_API_KEY environment variable not set.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  try {
    const prompt = "Write a story about a magic backpack.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Success! The key is working. Here's your story:");
    console.log(text);
  } catch (error) {
    console.error("Error connecting to Google AI. The API key is likely invalid or has not been enabled for the 'generativelanguage.googleapis.com' service.");
    // The actual error object from Google often has more details in a 'cause' or 'message' field.
    if (error instanceof Error) {
        console.error("Details:", error.message);
    } else {
        console.error("Full error object:", JSON.stringify(error, null, 2));
    }
  }
}

run();
