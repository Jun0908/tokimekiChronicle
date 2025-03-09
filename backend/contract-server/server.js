import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xb2e8fc19293f8f9020f3dc74ee2f4a67f8a88240";

// ✅ 直接 ABI を埋め込む
const contractABI = [
  {
    "inputs": [
      { "internalType": "address payable", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "sendETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "sendToken",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// ✅ ethers.js の設定
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// ✅ ETH 送信 API
app.post("/api/trigger-contract", async (req, res) => {
  try {
    const { recipient, amount } = req.body;
    if (!recipient || !amount) {
      res.status(400).json({ error: "Invalid input parameters" });
      return;
    }

    const parsedAmount = ethers.parseEther(amount);
    const tx = await contract.sendETH(recipient, parsedAmount, { value: parsedAmount });
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Error executing contract function:", error);
    res.status(500).json({ error });
  }
});

// ✅ サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
