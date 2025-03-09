import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_INDEX = process.env.PINECONE_INDEX || "prediction-data";
const PINECONE_HOST = process.env.PINECONE_HOST || ""; // 重要

// Pinecone & OpenAIの初期化
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ message: "Query is required" }, { status: 400 });
    }

    // すでに作成済みのインデックスを取得
    // 第2引数に Host を渡し、確実に同インデックスを指すようにする
    const index = pc.index(PINECONE_INDEX, PINECONE_HOST);

    // クエリをEmbedding
    const embeddingRes = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query,
    });
    const queryVector = embeddingRes.data.data[0].embedding;

    // Pineconeで類似検索
    const searchResults = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
    });

    // 検索結果をまとめてcontextを作成
    const context = searchResults.matches
      .map((match) => match.metadata?.text ?? "")
      .join("\n");

    // コンテキスト付きでChatGPTに問い合わせ
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
    You are an AI that answers factual questions from Pinecone data.
    You must use the provided context to answer as factually and directly as possible.
    If the context explicitly contains the answer, do not give disclaimers. 
    If the context does not have the answer, say you don't have enough info. 
    `
        },
        // ここでは「context」を System or Assistant メッセージとして渡す
        {
          role: "assistant",
          content: `CONTEXT:\n${context}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0, // より確実に事実に集中させる
    });
    

    const answer = chatResponse.data.choices[0].message?.content || "";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in /api/query:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

