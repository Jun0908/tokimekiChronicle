import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { promises as fs } from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { messages, character } = body;

    if (!character) {
      return new NextResponse("Character is required", { status: 400 });
    }

    const characterData = JSON.parse(
      await fs.readFile(`./data/characters/${character}.json`, "utf-8")
    );

    const characterPrompt = `
      You are ${characterData.name}. 
      You focus on the following topics: ${characterData.topics.join(", ")}.
      Your knowledge includes: ${characterData.knowledge.join(", ")}.
      Your communication style involves: ${characterData.style.all.join(", ")}.
      Your speech often includes adjectives such as: ${characterData.adjectives.join(", ")}.
      
      Now, score the given conversation on the following five criteria, each out of 10:
      1. **Relevance**: How relevant is the response to the given topic?
      2. **Creativity**: How unique and creative is the response?
      3. **Coherence**: How well-structured and logical is the response?
      4. **Engagement**: How engaging is the response?
      5. **Accuracy**: How factually accurate is the response?
      
      Also, provide a short feedback comment summarizing the overall response quality.
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [{ role: "system", content: characterPrompt }, ...messages],
    });

    const responseMessage = response.data.choices[0]?.message?.content;
    if (!responseMessage) throw new Error("Empty response");

    const scoreRegex = /\d+/g;
    const scores = responseMessage.match(scoreRegex)?.map(Number) || [];
    const scoreLabels = ["Relevance", "Creativity", "Coherence", "Engagement", "Accuracy"];

    const scoreData = scoreLabels.map((label, index) => ({ label, score: scores[index] || 0 }));
    const feedback = responseMessage.split("\n").slice(-1)[0];

    return NextResponse.json({ scores: scoreData, feedback });
  } catch (error: any) {
    console.error("Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
