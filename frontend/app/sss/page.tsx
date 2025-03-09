'use client';

import React, { useState, useEffect } from 'react';
import * as symbol from 'symbol-sdk';
import { lastValueFrom } from 'rxjs';

// =====================
// Constants & Setup
// =====================

const GENERATION_HASH = '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836';
const EPOCH = 1637848847;
const XYM_ID = '72C0212E67A08BCE'; // Testnet XYM mosaic ID

const NODE_URL =  'http://sym-test-01.opening-line.jp:3000';
const NET_TYPE = symbol.NetworkType.TEST_NET;

const repositoryFactory = new symbol.RepositoryFactoryHttp(NODE_URL);
const accountHttp = repositoryFactory.createAccountRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();

// Helper function to get a string for transaction types
function getTransactionType(type: number) {
  // https://symbol.github.io/symbol-sdk-typescript-javascript/1.0.3/enums/TransactionType.html
  if (type === 16724) return 'TRANSFER TRANSACTION';
  return 'OTHER TRANSACTION';
}

// =====================
// Page Component
// =====================
export default function Page() {
  // UI states for account info
  const [addressPretty, setAddressPretty] = useState('');
  const [xymBalance, setXymBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<symbol.Transaction[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // UI states for form inputs (for creating transaction)
  const [formAddress, setFormAddress] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // =====================
  // Fetch account info on mount
  // =====================
  useEffect(() => {
    // Wait a short time for window.SSS to be injected
    const timer = setTimeout(async () => {
      try {
        // 1) Get the active address from SSS
        const rawAddress = (window as any).SSS.activeAddress;
        if (!rawAddress) {
          setErrorMsg('SSS extension not found or no active address.');
          return;
        }
        console.log('SSS activeAddress:', rawAddress);
        // Check that the active address length is 39 characters (expected for Testnet)
        if (rawAddress.length !== 39) {
          setErrorMsg(`Active address length is not 39 characters. Got ${rawAddress.length}.`);
          return;
        }
        // 2) Format address and display
        const addressObj = symbol.Address.createFromRawAddress(rawAddress);
        setAddressPretty(addressObj.pretty());

        // 3) Fetch account info (balance)
        const accountInfo = await lastValueFrom(accountHttp.getAccountInfo(addressObj));
        // Find the XYM mosaic by comparing mosaic IDs (converted to uppercase)
        const xymMosaic = accountInfo.mosaics.find(
          (m) => m.id.id.toHex().toUpperCase() === XYM_ID.toUpperCase()
        );
        if (xymMosaic) {
          const balanceNum = xymMosaic.amount.compact() / Math.pow(10, 6);
          setXymBalance(balanceNum);
        } else {
          console.warn('XYM mosaic not found. Mosaics returned:', accountInfo.mosaics);
        }

        // 4) Fetch recent confirmed transactions
        const searchCriteria: symbol.TransactionSearchCriteria = {
          group: symbol.TransactionGroup.Confirmed,
          address: addressObj,
          pageNumber: 1,
          pageSize: 20,
          order: symbol.Order.Desc,
        };
        const txSearchResult = await lastValueFrom(transactionHttp.search(searchCriteria));
        setTransactions(txSearchResult.data);
      } catch (err: any) {
        console.error('Error fetching account info:', err);
        setErrorMsg(err.message || 'Error fetching account info.');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // =====================
  // Handle Transaction (SSS)
  // =====================
  const handleSSS = async () => {
    try {
      setErrorMsg('');

      // 1) Read form inputs; check required fields
      if (!formAddress || !formAmount) {
        setErrorMsg('Recipient address and amount are required.');
        return;
      }
      // Check recipient address length is 39 characters
      if (formAddress.length !== 39) {
        setErrorMsg(`Recipient address must be 39 characters long. Provided: ${formAddress.length}`);
        return;
      }

      // 2) Create a TransferTransaction using Symbol SDK
      const addrObj = symbol.Address.createFromRawAddress(formAddress);
      // Convert XYM amount to micro units (multiply by 1,000,000)
      const mosaic = new symbol.Mosaic(
        new symbol.MosaicId(XYM_ID),
        symbol.UInt64.fromUint(Number(formAmount) * 1000000)
      );

      const tx = symbol.TransferTransaction.create(
        symbol.Deadline.create(EPOCH),
        addrObj,
        [mosaic],
        symbol.PlainMessage.create(formMessage),
        NET_TYPE,
        symbol.UInt64.fromUint(2000000) // maxFee
      );

      // 3) Set the transaction in the SSS extension for signing
      (window as any).SSS.setTransaction(tx);

      // 4) Request signing from SSS
      const signedTx = await (window as any).SSS.requestSign();
      console.log('Signed Transaction:', signedTx);
      if (!signedTx || !signedTx.payload) {
        throw new Error('Transaction was not signed.');
      }

      // 5) Announce the signed transaction to the network
      const node = await import('axios').then(mod => mod.default);
      const axiosInstance = node.create({
        baseURL: NODE_URL,
        timeout: 10000, // Increased timeout to 10 seconds
        headers: { 'Content-Type': 'application/json' },
      });
      const jsonPayload = `{"payload":"${signedTx.payload}"}`;
      const announceResult = await lastValueFrom(transactionHttp.announce(signedTx));
      console.log('Announcement Result:', announceResult);
    } catch (err: any) {
      console.error('Error handling SSS transaction:', err);
      setErrorMsg(err.message || 'Error creating or announcing transaction.');
    }
  };

  // =====================
  // Render UI
  // =====================
  return (
    <div style={{ margin: '20px' }}>
      <h1>Next.js Symbol SSS Testnet Example</h1>

      {/* Display errors if any */}
      {errorMsg && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}

      {/* Account Info */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Account Info</h2>
        <p>Address: {addressPretty || '(No address)'}</p>
        <p>XYM Balance: {xymBalance}</p>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Recent Transactions</h2>
        <div id="wallet-transactions">
          {transactions.map((tx: any, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div>Transaction Type: {getTransactionType(tx.type)}</div>
              <div>Transaction Hash: {tx.transactionInfo?.hash || '(No hash)'}</div>
              <hr />
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Form */}
      <div>
        <h2>Create Transaction</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="form-addr">Recipient Address: </label>
          <br />
          <input
            id="form-addr"
            type="text"
            value={formAddress}
            onChange={(e) => {
              console.log('Address changed:', e.target.value);
              setFormAddress(e.target.value);
            }}
            placeholder="Enter recipient address (39 characters)"
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="form-amount">Amount (XYM): </label>
          <br />
          <input
            id="form-amount"
            type="text"
            value={formAmount}
            onChange={(e) => {
              console.log('Amount changed:', e.target.value);
              setFormAmount(e.target.value);
            }}
            placeholder="Enter amount"
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="form-message">Message: </label>
          <br />
          <input
            id="form-message"
            type="text"
            value={formMessage}
            onChange={(e) => {
              console.log('Message changed:', e.target.value);
              setFormMessage(e.target.value);
            }}
            placeholder="Enter message"
            style={{ width: '300px' }}
          />
        </div>
        <button onClick={handleSSS}>Send Transaction with SSS</button>
      </div>
    </div>
  );
}
