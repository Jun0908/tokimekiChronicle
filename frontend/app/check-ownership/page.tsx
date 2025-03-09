"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/header/navbar";

export default function CheckOwnershipPage() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const checkNftFlag = async () => {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask not found.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      // POST the address to /api/auth
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: userAddress }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }

      // If successful, the cookie is set
      setStatus("Success! Cookie set with nftFlag = true.");
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
       <Navbar />
      <h1>Check NFT Ownership (Simple Version)</h1>
      <p>This page checks if you own an NFT in one of our contracts and sets a cookie if yes.</p>
      <button onClick={checkNftFlag}>Check NFT & Set Cookie</button>
      <div style={{ marginTop: "1rem" }}>
        <p>Address: {address}</p>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}



