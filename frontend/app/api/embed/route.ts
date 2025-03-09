import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";
import dataJson from "@/public/data.json";

// JSON構造を定義（例）
interface DataItem {
  question: string;
  outcome: {
    explanation: string | null;
  };
}

// 環境変数読み込み
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
// 既に Pinecone コンソールで作成済みの Index 名 & Host
const PINECONE_INDEX = process.env.PINECONE_INDEX || "prediction-data";
const PINECONE_HOST = process.env.PINECONE_HOST || "";

// Pinecone と OpenAI の初期化
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

/**
 * 非ASCII文字を除去＆スペースを_に置換し、ASCIIのみのIDを返す関数
 * 例: "Will Dharma’s Phase 1 Retroactive UNI Distribution proposal pass?"
 *  -> "Will_Dharma_s_Phase_1_Retroactive_UNI_Distribution_proposal_pass?"
 *  -> "will_dharma_s_phase_1_retroactive_uni_distribution_proposal_pass?"
 * （実際の処理はアポストロフィ完全除去するなど、お好みで調整）
 */
function sanitizeId(str: string): string {
  return str
    // 1) 非ASCII文字を削除
    .replace(/[^\x00-\x7F]/g, "")
    // 2) 空白類をアンダースコアに
    .replace(/\s+/g, "_")
    // 3) （任意）全部小文字にする
    .toLowerCase()
    // 4) 必要があれば、さらに記号を置換するなど適宜カスタム
    ;
}

export async function POST() {
  try {
    // data.json を読み込む
    const data = dataJson as DataItem[];
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: "JSON data is empty." }, { status: 400 });
    }

    // Pinecone 上の既存Indexに接続
    // 第2引数に host を指定することで確実にこのIndexを利用
    const index = pc.index(PINECONE_INDEX, PINECONE_HOST);

    // JSONの各項目をEmbeddingして Upsert
    const vectors = await Promise.all(
      data.map(async (item) => {
        // 1) Vector ID用に item.question をASCII化
        const asciiId = sanitizeId(item.question);

        // 2) Embedding対象テキストを作成
        //    outcome.explanation が null の場合を考慮
        const explanation = item.outcome?.explanation ?? "";
        const text = `${item.question} ${explanation}`;

        // 3) OpenAI で Embedding
        const res = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: text,
        });
        const vector = res.data.data[0].embedding;

        // 4) Pinecone upsert用のオブジェクトを返す
        return {
          id: asciiId,             // ← ASCIIだけのIDに置換
          values: vector,
          metadata: { text },      // メタデータはUnicode含んでもOK
        };
      })
    );

    // まとめて upsert
    await index.upsert(vectors);

    return NextResponse.json({ message: "Upsert completed." });
  } catch (error) {
    console.error("Error in /api/embed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



