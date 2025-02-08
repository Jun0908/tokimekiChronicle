"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/header/navbar";
import SecureETHDistributorAbi from "../../contracts/SendToken.json"; // ABIをインポート

const CONTRACT_ADDRESS = "0x5d3c5c80aa78c5a0eee0f747188fe552f439ef08";
const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

export default function BalancePage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 AlchemyのRPCを使ってProviderを作成
        const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);

        // 🔹 スマートコントラクトのインスタンスを作成
        const contract = new ethers.Contract(CONTRACT_ADDRESS, SecureETHDistributorAbi, provider);

        // 🔹 コントラクトのETH残高を取得
        const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
        const balanceEth = ethers.utils.formatEther(balanceWei); // ETH に変換

        setBalance(balanceEth);
      } catch (err: any) {
        console.error("❌ 残高取得エラー:", err);
        setError("残高を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Navbar />
      <h1 className="text-2xl font-bold mb-4">スマートコントラクトの残高</h1>

      {loading ? (
        <p>⏳ 読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-lg font-semibold">💰 {balance} ETH</p>
      )}
    </div>
  );
}
