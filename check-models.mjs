import { config } from "dotenv";

config({ path: ".env.local" });

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

async function checkGeminiModels() {
  console.log("\n=== GEMINI AVAILABLE MODELS ===");
  if (!GEMINI_KEY) {
    console.log("GEMINI_API_KEY not set");
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`
    );
    const data = await response.json();
    
    if (data.models) {
      console.log("Available models:");
      data.models.forEach((model) => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function checkGroqModels() {
  console.log("\n=== GROQ AVAILABLE MODELS ===");
  if (!GROQ_KEY) {
    console.log("GROQ_API_KEY not set");
    return;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
      },
    });
    const data = await response.json();
    
    if (data.data) {
      console.log("Available models:");
      data.data.forEach((model) => {
        console.log(`  - ${model.id}`);
      });
    } else {
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

await checkGeminiModels();
await checkGroqModels();
