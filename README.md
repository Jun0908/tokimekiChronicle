# Tokimeki Chronicle 

### Overview


### Problems


### Solution – Diverse Model Evaluation through FID and Human Insights



### Technologies I used

**1.Model Evaluation through FID and Human Insights**

We adopted a method combining FID and human evaluations for LLM assessment. FID was used to objectively assess quality and diversity, and World was utilized to verify human authenticity rather than bots. Finally, reviews were conducted by human evaluators from diverse backgrounds. Tokens were distributed to evaluators to encourage fair and accurate evaluations.

<img width="526" alt="スクリーンショット 2024-11-17 0 15 45" src="https://github.com/user-attachments/assets/1ab667f5-c646-4a8c-8bde-9a0000f7f936">


**2.Text to Image with LLM Mint**

We implemented a system where each LLM can be minted as an NFT, allowing NFT holders to access text-to-image prompt capabilities. The text-to-image generation is powered by Hyperbolic, a decentralized GPU network, ensuring robust, distributed processing for high-quality image creation. The generated images are stored securely on Storacha by Protocol Labs, ensuring decentralized and reliable storage. Each image is then minted as a unique NFT, creating a seamless ecosystem where users can generate, store, and own digital content with blockchain-backed authenticity and provenance.

<img width="624" alt="スクリーンショット 2024-11-17 0 15 25" src="https://github.com/user-attachments/assets/ed41036b-ffa2-4004-9726-34a5291e264d">

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
| Flare Testnet   | [0x693b50002b5f7fd382882cb9cf23c8fe14af84849998e23854c17d488456d622](https://coston2-explorer.flare.network/tx/0x693b50002b5f7fd382882cb9cf23c8fe14af84849998e23854c17d488456d622)|
| Flow Testnet    | [0xad7a9409d0d28ac57f59b41cf811db9eac47fd9dbf8836d3d3f806a95dcec5f2](https://evm-testnet.flowscan.io/tx/0xad7a9409d0d28ac57f59b41cf811db9eac47fd9dbf8836d3d3f806a95dcec5f2)
| Polygon Amoy   | [0x5f6de723d264bd63e0e2367a05a08bdf9b281ab6729a047ac28d08824545de2b](https://www.oklink.com/amoy/tx/0x5f6de723d264bd63e0e2367a05a08bdf9b281ab6729a047ac28d08824545de2b)|
| Scroll Testnet   | [0xe2a548dacdbc942d659a523fd40335000c80064c](https://sepolia.scrollscan.com/address/0xe2a548dacdbc942d659a523fd40335000c80064c)|


### What's next for
- **FineTuning**: Fine-tuning involves reducing bias by incorporating diverse datasets, allowing the model to better represent various cultural and linguistic perspectives, thus improving accuracy and fairness across different contexts.
- **[zkLLM](https://github.com/jvhs0706/zkllm-ccs2024)**: zkLLM (zero-knowledge Language Model) leverages zero-knowledge proofs to ensure privacy-preserving interactions with language models. This approach enables users to verify model responses without exposing sensitive data, enhancing trust and security in AI applications.

We would like to create **the society with decentralized value** by increasing **diverse evaluation criteria**.


### Implementation Status

| Title          |                                                              URL |
| :------------- | ---------------------------------------------------------------: |
| Demo Movie      |                                      [Nudibranch-demo](https://youtu.be/agQj5_Lpucc)|
| Pitch Doc    |   [Nudibranch-presentation](https://www.canva.com/design/DAGVtA0iy08/Sz0p5ehf7WcXCwoIdE_ZVg/edit?utm_content=DAGVtA0iy08&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) |
| Demo Site     |                                 [Nudibranch-demo](https://tpfsg35rib.ap-northeast-1.awsapprunner.com/evaluate-1)| 


### 📺 Explanation / 説明書き

AI Agentsは、MetaMeプラットフォームにおけるエンゲージメントとコミュニティ活動を活性化するため、高度なAI機能を備えたiNFT（intelligence NFT）を開発します。これにより、メタバース内のインタラクションが豊かになり、ユーザー参加型のコンテンツ生成を促進します。

 [Movie in Loom/ 紹介動画 Loom](https://www.loom.com/share/6d470c31cb374f7f94587d5b7be31d77?sid=c83495ec-9e79-43f2-96cd-7337bb9681b0)
  
### 🔵 How to excute / 実行方法
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

