import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { promises as fs } from "fs";
import { sendToken, getBalance } from "@/app/utils/contract";
import moment from "moment-timezone";

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

// URLs for external APIs
const WORLD_TIME_URL = "http://worldtimeapi.org/api/timezone";
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to get current time
const getTime = async (location: string, name: string): Promise<string> => {
  try {
    const response = await axios.get(`${WORLD_TIME_URL}/${location}`);
    const { datetime } = response.data;
    const dateTime = moment.tz(datetime, location).format("A HH:mm");
    return `The current time in ${name} is ${dateTime}.`;
  } catch (error) {
    console.error("Error fetching time:", error);
    return `Could not retrieve the time for ${name}.`;
  }
};

// Function to get current weather
const getWeather = async (location: string, name: string): Promise<string> => {
  try {
    const response = await axios.get(OPEN_WEATHER_URL, {
      params: {
        q: location,
        appid: process.env.OPEN_WEATHER_API_KEY,
        units: "metric",
        lang: "en",
      },
    });
    const description = response.data.weather[0].description;
    const temp = response.data.main.temp;
    return `The weather in ${name} is ${description} with a temperature of ${temp}°C.`;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return `Could not retrieve the weather for ${name}.`;
  }
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    // Get "character" from body, default to "trump" if not provided
    const { messages, character = "shizuku" } = body;

    // Determine character file path dynamically
    const characterFilePath = `./data/characters/${character}.json`;

    // Read and parse the character JSON file
    const characterFileContent = await fs.readFile(characterFilePath, "utf-8");
    const characterData = JSON.parse(characterFileContent);

    // Prepare the character prompt
    const characterPrompt = `
      You are ${characterData.name}.
      You focus on the following topics: ${characterData.topics.join(", ")}.
      Your knowledge includes: ${characterData.knowledge.join(", ")}.
      Your communication style involves: ${characterData.style.all.join(", ")}.
      Your speech often includes adjectives such as: ${characterData.adjectives.join(", ")}.
    `;

    // Request ChatGPT API
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: characterPrompt },
        ...messages,
      ],
      functions: [
        {
          name: "getTime",
          description: "Get the current time for a specific location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "A timezone name, e.g., Asia/Tokyo.",
              },
              name: {
                type: "string",
                description: "The location's name, e.g., Tokyo.",
              },
            },
            required: ["location", "name"],
          },
        },
        {
          name: "getWeather",
          description: "Get the current weather for a specific location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "A geographical name, e.g., Tokyo.",
              },
              name: {
                type: "string",
                description: "The location's name, e.g., Tokyo.",
              },
            },
            required: ["location", "name"],
          },
        },
        {
          name: "sendToken",
          description: "Send tokens to a specified wallet address.",
          parameters: {
            type: "object",
            properties: {
              to: { type: "string", description: "Recipient wallet address" },
              amount: { type: "string", description: "Amount of tokens to send" },
            },
            required: ["to", "amount"],
          },
        },
        {
          name: "getBalance",
          description: "Get the balance of the smart contract.",
          parameters: {},
        },
      ],
      function_call: "auto",
    });

    const responseMessage = response.data.choices[0]?.message;
    if (!responseMessage) throw new Error("Empty response message");

    if (responseMessage.function_call) {
      const { name: functionCallName, arguments: args } = responseMessage.function_call;
      let functionCallArgs;
      try {
        functionCallArgs = typeof args === "string" ? JSON.parse(args) : args;
      } catch (parseError) {
        throw new Error("Failed to parse function call arguments");
      }

      let content = "";
      if (functionCallName === "getTime") {
        content = await getTime(functionCallArgs.location, functionCallArgs.name);
      } else if (functionCallName === "getWeather") {
        content = await getWeather(functionCallArgs.location, functionCallArgs.name);
      } else if (functionCallName === "sendToken") {
        content = await sendToken(functionCallArgs.to, functionCallArgs.amount);
      } else if (functionCallName === "getBalance") {
        content = await getBalance();
      } else {
        throw new Error(`Unknown function call: ${functionCallName}`);
      }

      return NextResponse.json({ role: "assistant", content });
    }

    return NextResponse.json(responseMessage);
  } catch (error: any) {
    console.error("Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

