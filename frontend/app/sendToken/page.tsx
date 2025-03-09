"use client";

import Image from "next/image"; // If you prefer Next.js's Image component
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/header/navbar";
import Abi from "../../contracts/UniversalSender.json";

const CONTRACT_ADDRESS = "0xb2e8fc19293f8f9020f3dc74ee2f4a67f8a88240";

export default function Home() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [owner, setOwner] = useState<string>("");

  // Set default values for recipient address and amount (in ETH)
  const [recipient, setRecipient] = useState<string>("0x4DCf63CcD612bf1afC6E216EAFc20DDaf5071d40");
  const [amount, setAmount] = useState<string>("0.01");

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request access to the user's wallet
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, Abi, signer);
          setContract(contractInstance);

          // Get connected account
          const address = await signer.getAddress();
          setAccount(address);

          // Retrieve the contract owner (assuming the contract has an owner() function)
          const contractOwner = await contractInstance.owner();
          setOwner(contractOwner);
        } catch (error) {
          console.error("Error during initialization:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    }
    init();
  }, []);

  async function handleSendETH() {
    if (!contract) {
      console.error("Contract is not connected.");
      return;
    }
    try {
      // Convert the amount (ETH) to wei
      const parsedAmount = ethers.utils.parseEther(amount);
      const tx = await contract.sendETH(recipient, parsedAmount, {
        value: parsedAmount,
      });
      await tx.wait();
      console.log("Transaction successful:", tx);
    } catch (error) {
      console.error("Error sending ETH:", error);
    }
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <Image
            src="/yakumo.jpg" // Ensure this image is in your public folder or provide a valid URL
            alt="Illustration"
            width={200}
            height={200}
            style={{ marginRight: "10px" }}
          />
      
        </div>
        <p>
          <strong>Your Account:</strong> {account}
        </p>
        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Recipient Address: </strong>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ width: "400px" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Amount (ETH): </strong>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "200px" }}
            />
          </div>
          <button onClick={handleSendETH}>賽銭</button>
        </div>
      </main>
    </div>
  );
}
