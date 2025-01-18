# トキメキ⭐︎クロ二カル 

### 概要 / Overview


### 課題　/ Problems


### 解決方法　/ Solution 


### テクノロジー　/ Technologies I used

①ERC6551を用いたNPCのデータ管理

ERC6551に紐づいたNFTがIPFSの画像データの非暗号化や音声や人格のLLMのAPIのアクセス管理を行い、MetaMaskによりNPCのデータ管理ができる。

<img width="390" alt="スクリーンショット 2024-06-25 11 47 35" src="https://github.com/lodestar3/frontend/assets/31527310/8a5d0bfc-afb5-46de-aa94-f2132965c22e">

②LLMを用いた会話システムの構築

LangchainによりAPIの接続やJSONのEmbedding等を行い、NPCの個性を生成する。VoiceBoxによりNPCの音声を選択することができる。

<img width="390" alt="スクリーンショット 2024-06-25 11 50 39" src="https://github.com/lodestar3/frontend/assets/31527310/1261f1ad-8f88-43d4-ac02-75d67a278adb">

### Development

**IPFSNFT.sol Contracts**

| contract                   |                                                                                                                   contract address |
| :------------------------- | ---------------------------------------------------------------------------------------------------------------------------------: |
| Ethereum Sepolia    | [0xd644eeb2217d02f167e8865fff55079fc140e971](https://sepolia.etherscan.io/address/0xd644eeb2217d02f167e8865fff55079fc140e971)|
| Bitkub Testnet    | [0x67eeb1af00304fb3ab40fa1320b67354ce4d5492011c0cc642887a866b504e8e](https://testnet.bkcscan.com/tx/0x67eeb1af00304fb3ab40fa1320b67354ce4d5492011c0cc642887a866b504e8e)|

### Implementation Status

| Title          |                                                              URL |
| :------------- | ---------------------------------------------------------------: |
| Demo Movie      |                                      [tokimeki-chronicle-demo](https://youtu.be/agQj5_Lpucc)|
| Pitch Doc    |   [tokimeki-chronicle-presentation](https://www.canva.com/design/DAGVtA0iy08/Sz0p5ehf7WcXCwoIdE_ZVg/edit?utm_content=DAGVtA0iy08&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) |
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
- **FineTuning**: Fine-tuning involves reducing bias by incorporating diverse datasets, allowing the model to better represent various cultural and linguistic perspectives, thus improving accuracy and fairness across different contexts.
- **[zkLLM](https://github.com/jvhs0706/zkllm-ccs2024)**: zkLLM (zero-knowledge Language Model) leverages zero-knowledge proofs to ensure privacy-preserving interactions with language models. This approach enables users to verify model responses without exposing sensitive data, enhancing trust and security in AI applications.

We would like to create **the society with decentralized value** by increasing **diverse evaluation criteria**.

