import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { promises as fs } from "fs";

// OpenAI API設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

// 外部API URL
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

// 天気情報取得関数
const getWeather = async (location: string, name: string): Promise<string> => {
  try {
    const response = await axios.get(OPEN_WEATHER_URL, {
      params: {
        q: location,
        appid: process.env.OPEN_WEATHER_API_KEY!,
        units: "metric",
        lang: "ja",
      },
    });

    if (!response.data || !response.data.weather || !response.data.main) {
      throw new Error("Invalid weather API response structure");
    }

    const description = response.data.weather[0].description;
    const temp = response.data.main.temp;

    return `${name}の天気は${description}で${temp}度です。`;
  } catch (error: any) {
    console.error("Weather API Error:", error.message);
    return `${name}の天気は分かりませんでした。`;
  }
};

// メイン処理
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // JSONファイルの読み込み
    const characterData = JSON.parse(
      await fs.readFile("./data/character.json", "utf-8")
    );

    const body = await req.json();
    const { messages } = body;

    // キャラクター設定用のプロンプト
    const characterPrompt = `
      You are ${characterData.name}. You are ${characterData.personality}.
      Your role is: ${characterData.role}.
      You have knowledge in ${characterData.knowledge}.
      Your catchphrases include: ${characterData.catchphrases.join(", ")}.
    `;

    // ChatGPT APIへのリクエスト
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: characterPrompt }, // キャラクター情報を渡す
        ...messages,
      ],
      functions: [
        {
          name: "getWeather",
          description: "Get the current weather for a specific location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The specified location, e.g., Tokyo, Los Angeles.",
              },
              name: {
                type: "string",
                description: "The name of the location in natural language.",
              },
            },
            required: ["location", "name"],
          },
        },
      ],
      function_call: "auto",
    });

    const responseMessage = response.data.choices[0]?.message;

    if (!responseMessage) throw new Error("Empty response message");

    if (responseMessage.content) {
      return NextResponse.json(responseMessage);
    } else if (responseMessage.function_call) {
      const { name, arguments: args } = responseMessage.function_call;
      let parsedArgs;

      try {
        parsedArgs = typeof args === "string" ? JSON.parse(args) : args;
      } catch (parseError) {
        throw new Error("Failed to parse function call arguments");
      }

      let content = "";
      if (name === "getWeather") {
        content = await getWeather(parsedArgs.location, parsedArgs.name);
      } else {
        throw new Error(`Unknown function call: ${name}`);
      }

      return NextResponse.json({ role: "assistant", content });
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
