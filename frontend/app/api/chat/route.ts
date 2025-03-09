import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { promises as fs } from "fs";
import { sendToken, getBalance } from "@/app/utils/contract";
import moment from "moment-timezone";
import { ethers } from "ethers";
import IPFS_NFT_ABI from "@/contracts/IPFS_NFT.json";

// Connect to your network (e.g., Sepolia)
const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// The NFT contracts from your Mint page
const nftContracts = [
  "0xB1Af9E247d97a2fdc9d790Be473D8C2314141697",
  "0x6ae1c68f83a321eb35d6cbdd4959925725d8b532",
  "0x9a5e4b8aee1148bfe1f90d09d0670dd30ad77515",
];

// Simple function to check if an address holds any NFT in those contracts
async function checkNftOwnership(address: string): Promise<boolean> {
  for (const contractAddress of nftContracts) {
    const contract = new ethers.Contract(contractAddress, IPFS_NFT_ABI, provider);
    const balance = await contract.balanceOf(address);
    if (balance.gt(0)) {
      return true;
    }
  }
  return false;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

const WORLD_TIME_URL = "http://worldtimeapi.org/api/timezone";
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Helper function to parse a cookie value from the Cookie header.
 */
function getCookieValue(cookieHeader: string, cookieName: string) {
  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

/**
 * Helper function to decode the authToken and check for nftFlag.
 */
function checkNftFlagFromToken(token: string | null) {
  if (!token) return false;
  try {
    // Decode URL-encoded cookie value first
    const decodedCookie = decodeURIComponent(token);
    // Convert the base64 string into UTF-8 string
    const decodedStr = Buffer.from(decodedCookie, "base64").toString("utf-8");
    console.log("Decoded token string:", decodedStr);
    const decoded = JSON.parse(decodedStr);
    return decoded.nftFlag === true;
  } catch (err) {
    console.error("Error decoding token:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expect the client to provide messages, an optional character,
    // and optionally an address if no cookie is available.
    const { messages, character = "trump", address } = body;

    // Try to read the authToken from cookies.
    const headers = new Headers(req.headers);
    const cookieHeader = headers.get("cookie") || "";
    const authToken = getCookieValue(cookieHeader, "authToken");
    let isWeatherOn = false;

    // If we have a valid authToken with nftFlag, turn on weather.
    const nftFlagFromCookie = checkNftFlagFromToken(authToken);
    if (nftFlagFromCookie) {
      isWeatherOn = true;
    } else if (address) {
      // Otherwise, if an address is provided in the request, check NFT ownership.
      const ownsNft = await checkNftOwnership(address);
      isWeatherOn = ownsNft;
    }

    // Define function implementations.
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

    const getWeather = async (location: string, name: string): Promise<string> => {
      // If the flag isn't on, report that weather is disabled.
      if (!isWeatherOn) {
        return "Weather feature is currently disabled.";
      }
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

    // Load character file.
    const characterFilePath = `./data/characters/${character}.json`;
    const characterData = JSON.parse(await fs.readFile(characterFilePath, "utf-8"));

    // Prepare system prompt.
    const characterPrompt = `
      You are ${characterData.name}.
      You focus on the following topics: ${characterData.topics.join(", ")}.
      Your knowledge includes: ${characterData.knowledge.join(", ")}.
      Your communication style involves: ${characterData.style.all.join(", ")}.
      Your speech often includes adjectives such as: ${characterData.adjectives.join(", ")}.
    `;

    // Call OpenAI.
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [{ role: "system", content: characterPrompt }, ...messages],
      functions: [
        {
          name: "getTime",
          description: "Get the current time for a specific location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "Timezone name e.g., Asia/Tokyo",
              },
              name: {
                type: "string",
                description: "Location's name e.g., Tokyo",
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
                description: "Geographical name e.g., Tokyo",
              },
              name: {
                type: "string",
                description: "Location's name e.g., Tokyo",
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

    // If the model calls a function, execute it.
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

    // Otherwise, return the text response.
    return NextResponse.json(responseMessage);
  } catch (error: any) {
    console.error("Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


