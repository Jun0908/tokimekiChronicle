// app/api/idea-score/route.ts
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { promises as fs } from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

async function getRandomCharacters() {
  const data = JSON.parse(await fs.readFile("./data/index.json", "utf-8"));
  const shuffled = data.characters.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3); // ランダムに3人選択
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { ideas } = body;

    if (!ideas || !Array.isArray(ideas) || ideas.length !== 3) {
      return NextResponse.json({ error: "Invalid ideas input" }, { status: 400 });
    }

    const selectedCharacters = await getRandomCharacters();
    let totalScores = [0, 0, 0];
    let voteDetails = [];

    for (const character of selectedCharacters) {
      const prompt = `
        You are ${character.name}, an AI voting system expert. 
        Evaluate the following three ideas using quadratic voting principles.
        Distribute 10 total voting points fairly among these ideas:
        
        1. "${ideas[0].text}"
        2. "${ideas[1].text}"
        3. "${ideas[2].text}"
        
        Provide ONLY the JSON response in this exact format:
        {
          "votes": [vote1, vote2, vote3]
        }
        where vote1, vote2, and vote3 represent the squared number of votes allocated to each idea.
      `;

      const response = await openai.createChatCompletion({
        model: "gpt-4-turbo",
        messages: [{ role: "system", content: prompt }],
        temperature: 0,
        max_tokens: 100,
      });

      const responseMessage = response.data.choices[0]?.message?.content;
      if (!responseMessage) throw new Error("Empty response from OpenAI");

      // JSON部分のみを抽出（ES2018未満の環境でも動作するよう修正）
      const jsonStart = responseMessage.indexOf("{");
      const jsonEnd = responseMessage.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("Invalid response format from OpenAI");

      const jsonString = responseMessage.substring(jsonStart, jsonEnd + 1);
      const parsedVotes = JSON.parse(jsonString).votes;
      if (!Array.isArray(parsedVotes) || parsedVotes.length !== 3) {
        throw new Error("Invalid vote distribution from OpenAI");
      }

      totalScores = totalScores.map((score, index) => score + parsedVotes[index]);
      voteDetails.push({ character: character.name, votes: parsedVotes });
    }

    return NextResponse.json({ scores: totalScores, voteDetails });
  } catch (error: any) {
    console.error("Error in idea scoring API:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
