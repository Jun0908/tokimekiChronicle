import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { promises as fs } from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

/**
 * Character data structure
 */
interface Character {
  file: string;
  name?: string;
}

interface CharacterData {
  name: string;
  topics: string[];
  knowledge: string[];
  style: string[];
  adjectives: string[];
}

/**
 * Select 100 random characters from index.json
 */
async function getRandomCharacters(): Promise<Character[]> {
  try {
    const data = JSON.parse(await fs.readFile("./data/index.json", "utf-8"));
    if (!data.characters || !Array.isArray(data.characters) || data.characters.length === 0) {
      throw new Error("Character list is empty or invalid.");
    }

    const shuffled: Character[] = data.characters.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 100); // Pick 100 random characters
  } catch (error) {
    console.error("Error reading index.json:", error);
    throw new Error("Failed to load character data.");
  }
}

/**
 * Retrieve character data from a file
 */
async function getCharacterData(characterFile: string): Promise<CharacterData> {
  try {
    const filePath = `./data/${characterFile}`;
    console.log(`Reading character data from: ${filePath}`);

    const rawData = await fs.readFile(filePath, "utf-8");
    const characterData = JSON.parse(rawData);

    return {
      name: characterData.name || "Unknown",
      topics: Array.isArray(characterData.topics) ? characterData.topics : [],
      knowledge: Array.isArray(characterData.knowledge) ? characterData.knowledge : [],
      style: Array.isArray(characterData.style?.all) ? characterData.style.all : [],
      adjectives: Array.isArray(characterData.adjectives) ? characterData.adjectives : [],
    };
  } catch (error) {
    console.error(`Error reading character file ${characterFile}:`, error);
    throw new Error(`Failed to load character data from ${characterFile}`);
  }
}

/**
 * Handles POST requests for the LLM voting system
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    // Select 100 random characters
    const selectedCharacters = await getRandomCharacters();

    // Execute LLM calls in parallel
    const results = await Promise.all(
      selectedCharacters.map(async (character: Character) => {
        const characterData = await getCharacterData(character.file);

        const characterPrompt = `
          You are ${characterData.name}.
          You focus on the following topics: ${characterData.topics.join(", ")}.
          Your knowledge includes: ${characterData.knowledge.join(", ")}.
          Your communication style involves: ${characterData.style.join(", ")}.
          Your speech often includes adjectives such as: ${characterData.adjectives.join(", ")}.
          
          Now, analyze the following question and respond strictly with 'YES' or 'NO'.
          Do not provide any additional explanation.

          Question: ${question}
          Respond ONLY with 'YES' or 'NO'.
        `;

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: characterPrompt }],
          temperature: 0,
          max_tokens: 1,
        });

        let responseMessage = response.data.choices[0]?.message?.content?.trim().toUpperCase() || "NO";
        responseMessage = responseMessage.match(/YES|NO/) ? responseMessage : "NO";

        return responseMessage === "YES" ? "yes" : "no";
      })
    );

    // Aggregate YES/NO votes
    let yesCount = results.filter((vote) => vote === "yes").length;
    let noCount = results.length - yesCount;

    return NextResponse.json({ yesCount, noCount });
  } catch (error: any) {
    console.error("Error in LLM vote API:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

