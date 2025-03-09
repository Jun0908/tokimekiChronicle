"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import nftAbi from "../../contracts/IPFS_NFT.json"; // Adjust the path as needed


const CONTRACT_ADDRESS = "0x0ae1ebf61c2fe2ee0bb80696ab51ac455045f012";

export default function NFTMinting() {
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string>("");
  const [tokenId, setTokenId] = useState<number>(1);
  const [cid, setCid] = useState<string>("");
  const [mintStatus, setMintStatus] = useState<string>("");

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, nftAbi, signer);
        setContract(contractInstance);

        // Get connected account
        const address = await signer.getAddress();
        setAccount(address);
      }
    }
    init();
  }, []);

  const handleMint = async () => {
    if (!contract) return;
    if (!cid) {
      setMintStatus("Please enter an IPFS CID.");
      return;
    }
    try {
      setMintStatus("Minting...");
      // Call safeMint with the connected account as the recipient
      const tx = await contract.safeMint(account, tokenId, cid);
      await tx.wait();
      setMintStatus("Mint successful!");
    } catch (error) {
      console.error("Minting error:", error);
      setMintStatus("Mint failed. See console for details.");
    }
  };

  return (
    <div >
      <strong>NFT Minting DApp</strong>
      <div>
        <h1 >Connected Account:</h1>{" "}
        <span className="inline">{account}</span>
      </div>
      <div className="w-full flex items-center mt-2">
        <label className="mr-2 whitespace-nowrap">Token ID:</label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="w-full flex items-center mt-2">
        <label className="mr-2 whitespace-nowrap">IPFS CID:</label>
        <input
          type="text"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="Enter IPFS CID"
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <button
        onClick={handleMint}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Mint NFT
      </button>
      {mintStatus && <p className="mt-2">{mintStatus}</p>}
    </div>
  );
  
}
