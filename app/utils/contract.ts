import { ethers } from "ethers";
import SecureETHDistributorAbi from "../../contracts/SendToken.json"; // ABI のパスを調整

const CONTRACT_ADDRESS = "0x5d3c5c80aa78c5a0eee0f747188fe552f439ef08";
const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;

// 🔹 Alchemy を使って Provider を取得
export const getContractWithProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);
  return new ethers.Contract(CONTRACT_ADDRESS, SecureETHDistributorAbi, provider);
};

// 🔹 MetaMask (ユーザーのウォレット) 経由で署名付きトランザクションを送る
export const getContractWithSigner = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // ユーザーに接続を要求
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, SecureETHDistributorAbi, signer);
  }
  throw new Error("MetaMask がインストールされていません。");
};

// 🔹 トークン送信 (ユーザーの MetaMask 経由)
export const sendToken = async (to: string, amount: string): Promise<string> => {
  try {
    const contract = await getContractWithSigner();
    const tx = await contract.transfer(to, ethers.utils.parseUnits(amount, 18));
    await tx.wait();
    return `トークン送信成功 TxHash: ${tx.hash}`;
  } catch (error: any) {
    console.error("トークン送信失敗:", error);
    return "トークン送信に失敗しました。";
  }
};

// 🔹 コントラクトの残高を取得 (Alchemy経由)
export const getBalance = async (): Promise<string> => {
  try {
    const contract = getContractWithProvider();
    const balance = await contract.getBalance();
    return ethers.utils.formatEther(balance);
  } catch (error: any) {
    console.error("残高取得失敗:", error);
    return "取得失敗";
  }
};
