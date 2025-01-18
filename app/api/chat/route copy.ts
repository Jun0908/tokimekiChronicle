import { NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"
import moment from "moment-timezone"
import axios from "axios"
import { RepositoryFactoryHttp, Account, TransactionGroup } from "symbol-sdk";
import { firstValueFrom } from 'rxjs';



//import crypto from "crypto";

// OpenAI設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// URL
const WORLD_TIME_URL = "http://worldtimeapi.org/api/timezone"
const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"



// 時刻取得
const getTime = async (location: string, name: string) => {
  try {
    // APIコール
    const response = await axios.get(`${WORLD_TIME_URL}/${location}`)
    // 時刻取得
    const { datetime } = response.data
    // 時刻フォーマット
    const dateTime = moment.tz(datetime, location).format("A HH:mm")

    return `${name}の時刻は${dateTime}です。`
  } catch (error) {
    return `${name}の時刻は分かりませんでした。`
  }
}

// 天気取得
const getWeather = async (location: string, name: string) => {
  try {
    // APIコール
    const response = await axios.get(OPEN_WEATHER_URL, {
      params: {
        q: location,
        appid: process.env.OPEN_WEATHER_API_KEY,
        units: "metric",
        lang: "ja",
      },
    })
    // 天気取得
    const description = response.data.weather[0].description
    // 気温取得
    const temp = response.data.main.temp

    return `${name}の天気は${description}で${temp}度です。`
  } catch (error) {
    return `${name}の天気は分かりませんでした。`
  }
}

// XYM価格取得
const getXymPrice = async (jpyAmount: number) => {
  try {
    // Zaifの公開APIを利用してXYMの価格を取得
    const xymPriceResponse = await axios.get("https://api.zaif.jp/api/1/ticker/xym_jpy");
    const xymPriceData = xymPriceResponse.data;
    const xymPriceLast = xymPriceData.last;

    // XYMの請求金額を算出
    const xymAbsoluteAmount = Math.round((jpyAmount / xymPriceLast) * 1000000);
    const xymRelativeAmount = xymAbsoluteAmount / 1000000; // ユーザー向け表示

    return `XYM価格: ${xymPriceLast} JPY, 請求金額: ${xymRelativeAmount} XYM`;
  } catch (error) {
    return `XYMの価格情報を取得できませんでした。`;
  }
}

const alicePrivateKey = process.env.NEXT_PUBLIC_ALICE_PRIVATE_KEY; 

// Symbolトランザクション情報取得
const getSymbolTransactions = async (PrivateKey: string) => {
  try {
    
    const nodeUrl = "http://sym-test-01.opening-line.jp:3000";
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const networkType = await firstValueFrom(repositoryFactory.getNetworkType());
    if (!alicePrivateKey) {
      throw new Error("環境変数 ALICE_PRIVATE_KEY が設定されていません。");
      }
    const account = Account.createFromPrivateKey(alicePrivateKey, networkType);
    const txRepo = repositoryFactory.createTransactionRepository();
    
    const result = await firstValueFrom(txRepo.search({
      group: TransactionGroup.Confirmed,
      address: account.address,
      embedded: true,
      //order: Order.Desc, // Sort transactions in descending order by timestamp
      pageSize: 1 // Retrieve only the latest transaction
    }));
    
    // Access the first transaction in the result array
    const latestTransaction = result.data[0];

    // Return details of the latest transaction
    return `Latest Transaction:
      Transaction Hash: ${latestTransaction.transactionInfo?.hash ?? 'N/A'}
      Timestamp: ${latestTransaction.transactionInfo?.height?.toString() ?? 'N/A'}
      Sender: ${latestTransaction.signer?.address?.plain() ?? 'N/A'}`
  } catch (error) {
    return `Failed to fetch transaction information`;
  }
}

const products = [
  {
    id: "mystic-aroma-quest-perfume",
    name: "ミスティックアロマクエスト香水",
    description: "ミスティックアロマクエスト香水で感覚の旅に出かけましょう。この魅惑的な香りは、野生のベリー、古代の木々、そして伝説のクエストの本質を捉えた神秘的なスパイスの複雑なブレンドを特徴としており、冒険心を持つ人々のために作られています。涼しさを保つエッセンスが注入されており、この香水は自信と魅力を引き出す目に見えない鎧となります。複雑なデザインで飾られたエレガントなボトルは、ただの香りではなく、コレクションを飾る宝物です。現実世界に冒険の精神を持ち歩きたいゲーマーにぴったりです。",
    price: "5000円",
    volume: "50ml / 1.7oz"
  },
  {
    id: "heros-valor-rpg-costume",
    name: "ヒーローズヴァラーRPGコスチューム",
    description: "ヒーローズヴァラーRPGコスチュームでお気に入りのキャラクターに変身しましょう。この丁寧に作られたコスチュームは、ファンタジーと現実の境界を融合させ、アイコニックなゲーミングアーマーの高品質レプリカを提供します。耐久性があり柔軟な素材で作られており、コンベンション、パーティー、または没入型ゲームセッションに理想的です。調整可能なストラップとクロージャーが各種体型にフィットし、誰もが自分のバーチャルヒーローを体現できるようになっています。詳細な刺繍と金属のアクセントが施されたヒーローズヴァラーコスチュームは、コスプレの傑作であり、あなたのゲーミング体験を高める準備ができています。",
    price: "25000円",
    sizesAvailable: ["S", "M", "L", "XL"]
  },
  {
    id: "fantasy-feast-game-inspired-culinary-kit",
    name: "ファンタジーフィーストゲームインスパイアード料理キット",
    description: "ファンタジーフィーストゲームインスパイアード料理キットで、お気に入りのウェブゲームの料理世界に飛び込みましょう。このユニークなキットには、ゲームの象徴的な料理を再現するためのスパイス、レシピ、そしてファンタジー世界の各地から調達された食材が含まれています。エリクサーやパン、エキゾチックなメインコースまで、各キットは没入型の料理体験を提供し、ゲームの味をあなたの食卓にもたらします。美しくパッケージされた箱には、簡単にフォローできる指示が含まれており、新しい料理の冒険を探求することが好きなゲーマーグルメにとって完璧なギフトです。",
    price: "3000円",
    kitIncludes: "3種類の異なる料理のための食材、2-4人分"
  }
];
// 商品情報取得
const getProductInfoByName = async (productName: string) => {
  try {
    // 指定された商品名に一致する商品を検索
    const product = products.find(product => product.name === productName);

    // 商品が見つかった場合
    if (product) {
      // 商品の詳細情報を返す
      return `
        商品名: ${product.name}
        説明: ${product.description}
        価格: ${product.price}
        ${product.volume ? `容量: ${product.volume}` : ''}
        ${product.sizesAvailable ? `利用可能なサイズ: ${product.sizesAvailable.join(', ')}` : ''}
        ${product.kitIncludes ? `キットに含まれるもの: ${product.kitIncludes}` : ''}
      `;
    } else {
      // 商品が見つからなかった場合
      return `指定された商品 "${productName}" の情報は見つかりませんでした。`;
    }
  } catch (error) {
    // エラーが発生した場合
    return `商品情報の取得中にエラーが発生しました。`;
  }
}

// Function Calling設定
const functions = [
  {
    name: "getTime",
    description: "Get the current time for a specific location.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "The specified location, for instance, Tokyo, Los Angeles, should be represented in the form of a timezone name such as Asia/Tokyo.",
        },
        name: {
          type: "string",
          description:
            "The location referred to in the prompt could be, for example, Tokyo, Los Angeles.",
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
          description:
            "The specified location, for instance, Tokyo, Los Angeles, should be identified by its geographical name.",
        },
        name: {
          type: "string",
          description:
            "The location referred to in the prompt could be, for example, Tokyo, Los Angeles.",
        },
      },
      required: ["location", "name"],
    },
  },
  {
    name: "getXymPrice",
    description: "Get the current price of XYM and calculate the billing amount in XYM.",
    parameters: {
      type: "object",
      properties: {
        jpyAmount: {
          type: "number",
          description: "The billing amount in Japanese Yen to be converted to XYM.",
        },
      },
      required: ["jpyAmount"],
    },
  },
  {
    name: "getSymbolTransactions",
    description: "Retrieve detailed information on confirmed transactions for a specified account, including transaction type, signer, block height, and hash, using the Symbol SDK.",
    parameters: {
    type: "object",
    properties: {
      privateKey: {
        type: "string",
        description: "The private key of the account to retrieve transactions for.",
      },
    },
    required: [],
    },
  },
  {
    name: "getProductInfoByName",
    description: "Get detailed information about a specific product by its name.",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string",
          description: "The name of the product to retrieve information for."
        }
      },
      required: ["productName"]
    },
  },

]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    // ChatGPT
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      /*
      messages:[
        {"role": "user", "content": "送料はいくらですか？"},
        {"role": "assistant", "content": "全国一律500円です。5,000円以上のお買い上げで送料無料になります。"},
        {"role": "user", "content": "返品・交換は可能ですか？"},
        {"role": "assistant", "content": "商品到着後7日以内であれば、未使用の商品に限り返品・交換を承ります。"},
        {"role": "user", "content": "支払い方法にはどのようなものがありますか？"},
        {"role": "assistant", "content": "仮想通貨払いになります。"},
        {"role": "user", "content": "相手側から商品が送られてこないリスクはありますか？"},
        {"role": "assistant", "content": "Escowシステムを導入しており、商品のトレサビリティを調べております。"},
    ],
    */
    messages,
    functions,
    function_call: "auto",
    })

    // メッセージ取得
    const responseMessage = response.data.choices[0].message

    // メッセージ取得エラー
    if (!responseMessage) {
      return new NextResponse("Message Error", { status: 500 })
    }

    // 通常のメッセージ
    if (responseMessage.content) {
      return NextResponse.json(responseMessage)
    } else {
      // Function Callingチェック
      if (!responseMessage.function_call) {
        return new NextResponse("Function Call Error", { status: 500 })
      }

      // 引数チェック
      if (!responseMessage.function_call.arguments) {
        return new NextResponse("Function Call Arguments Error", {
          status: 500,
        })
      }

      // 関数名取得
      const functionCallName = responseMessage.function_call.name

      // 引数取得
      const functionCallNameArguments = JSON.parse(
        responseMessage.function_call.arguments
      )

      // メッセージ内容
      let content = ""

      // 関数名によって処理を分岐
      if (functionCallName === "getTime") {
        // 時刻取得
        content = await getTime(
          functionCallNameArguments.location,
          functionCallNameArguments.name
        )
      } else if (functionCallName === "getWeather") {
        // 天気取得
        content = await getWeather(
          functionCallNameArguments.location,
          functionCallNameArguments.name
        )
      }  else if (functionCallName === "getXymPrice") {
          // XYM価格取得
        content = await getXymPrice(
          functionCallNameArguments.jpyAmount
        )
      }  else if (functionCallName === "getSymbolTransactions") {
        // Symbolトランザクション情報取得
        content = await getSymbolTransactions(
          functionCallNameArguments.privateKey
        )
      } else if (functionCallName === "getProductInfoByName") {
        
        content = await getProductInfoByName(
          functionCallNameArguments.productName
        )
      
      } else {
         return new NextResponse("Function Call Name Error", { status: 500 })
      }

      // レスポンスのメッセージ作成
      const message = {
        role: "assistant",
        content,
      }

      return NextResponse.json(message)
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
