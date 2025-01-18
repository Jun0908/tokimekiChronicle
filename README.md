# トキメキ・クロ二カル 

### 概要 / Overview
AI Agentsとブロックチェーン技術（NFT・トークン）を活用し、地域の観光資源や特産品をデジタル化して新たな価値を創出。
個別化された体験提案や特典システムで観光消費を拡大し、リピーターを促進。地域住民や事業者と連携し、持続可能な経済活性化と文化継承を実現する。

### 課題　/ Problems

地域創生の改題として

①地域資源の価値が十分に評価されていない

地域の特産品や文化的資源が現地外で認知されず、価値が埋もれている。
観光や物販の販路が限定的で、広域での収益化が難しい。

②ひとり旅客の消費が少なく地域経済に貢献しにくい

ひとり旅は消費単価が低く、地域にお金を落とす割合が少ない。
旅行中の追加消費や体験の動機づけが不足している。

③観光客が一過性で終わり、リピート訪問が少ない

一度訪れた観光客がリピーターとして定着せず、地域との長期的な関わりが生まれにくい。
観光体験が「その場限り」で終わることが多い。


### 解決方法　/ Solution : Crypto AI Agents

①NFTを活用した地域資源のデジタル化と収益化

地域特産品や文化資源をNFTとして発行し、希少性を高めたデジタルアイテムを販売。
例: 地元特産の「限定ワインラベルNFT」や「伝統工芸のデジタルアート」。
NFT購入者に地域体験（ツアー、ワークショップ）の特典を付与し、現地訪問を促進。

②トークン経済でひとり旅客の消費を増加

現地での消費（飲食、特産品購入）に応じて「地域限定トークン」を獲得できる仕組みを導入。
例: 地元レストランやスナック利用でトークンを付与。
トークンは特産品やNFTと交換可能で、旅行者の追加消費を促進。

③NFTとトークンでリピーターを囲い込む

地域訪問者限定のNFTを発行し、所有者だけが参加できる「バーチャルコミュニティ」を形成。
例: 地域の最新情報や限定イベント案内を提供する会員制オンラインクラブ。
トークンの一部を地域貢献プロジェクト（インフラ整備、イベント運営）に還元し、訪問者の満足度を向上。


### テクノロジー　/ Technologies I used

①ERC6551を用いたNPCのデータ管理

ERC6551に紐づいたNFTがIPFSの画像データの非暗号化や音声や人格のLLMのAPIのアクセス管理を行い、MetaMaskによりNPCのデータ管理ができる。

<img width="390" alt="スクリーンショット 2024-06-25 11 47 35" src="https://github.com/lodestar3/frontend/assets/31527310/8a5d0bfc-afb5-46de-aa94-f2132965c22e">

②LLMを用いた会話システムの構築

LangchainによりAPIの接続やJSONのEmbedding等を行い、NPCの個性を生成する。VoiceBoxによりNPCの音声を選択することができる。

<img width="390" alt="スクリーンショット 2024-06-25 11 50 39" src="https://github.com/lodestar3/frontend/assets/31527310/1261f1ad-8f88-43d4-ac02-75d67a278adb">

### コントラクト / Contracts

**IPFSNFT.sol Contracts**

| contract                   |                                                                                                                   contract address |
| :------------------------- | ---------------------------------------------------------------------------------------------------------------------------------: |
| Ethereum Sepolia    | [0xd644eeb2217d02f167e8865fff55079fc140e971](https://sepolia.etherscan.io/address/0xd644eeb2217d02f167e8865fff55079fc140e971)|
| Bitkub Testnet    | [0x67eeb1af00304fb3ab40fa1320b67354ce4d5492011c0cc642887a866b504e8e](https://testnet.bkcscan.com/tx/0x67eeb1af00304fb3ab40fa1320b67354ce4d5492011c0cc642887a866b504e8e)|

### 資料 / Implementation Status

| Title          |                                                              URL |
| :------------- | ---------------------------------------------------------------: |
| Demo Movie      |                                      [tokimeki-chronicle-demo](https://youtu.be/agQj5_Lpucc)|
| Pitch Doc    |   [tokimeki-chronicle-presentation](https://www.canva.com/design/DAGchHryAAA/sK3Zmk4uzxb20zobgVyPXw/edit?utm_content=DAGchHryAAA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) |
| Demo Site     |                                 [tokimeki-chronicle-demo](https://tpfsg35rib.ap-northeast-1.awsapprunner.com/evaluate-1)| 


###  実行方法 / How to excute 
① Get API / APIの取得

.env.sample を .envに書き換えてください

下記のリンクからAPIを取得してください

  [NEXT_PUBLIC_ALCHEMY_API_KEY](https://www.alchemy.com/)
  
  [NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID](https://web3auth.io/)

  [OPEN_WEATHER_API_KEY](https://hibi-update.org/other/openweathermap-api/)
  
  [OPENAI_API_KEY](https://platform.openai.com/api-keys)

  [CMC_API_KEY](https://coinmarketcap.com/api/)
  

② Starting Docker / Dockerの起動
```bash
docker-compose up
```

③ Starting Frontend /フロントエンドの起動
```bash
# Clone the repository
git clone git@github.com:lodestar3/frontend.git

# Change to the project directory
cd frontend

# Install library
npm install 

# Start the development server
npm run dev
```

### 次にやりたいこと /What's next for
ARの空間ににAI Agentsが暮らしていて、ユーザーはAI Agentsのミームコインに投資することができる。ARのバーチャル空間でAI Agentsが稼いだお金は、投資先に還元される。実際にAI Agentsはバーチャル空間に人間のような生活リズムを持っており、時間と場所によって出現して、実際に関わった人間やAI Agentsの関わりでも影響を受ける。

