import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {
  RepositoryFactoryHttp,
  Account,
  Address,
  TransferTransaction,
  Deadline,
  PlainMessage,
  UInt64,
  Mosaic,
  MosaicId,
  EmptyMessage,
} from "symbol-sdk";
import { firstValueFrom } from "rxjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const NODE_URL = process.env.SYMBOL_NODE_URL || "http://sym-test-01.opening-line.jp:3000";
const SENDER_PRIVATE_KEY = process.env.SYMBOL_PRIVATE_KEY; // Sender's private key
const DEFAULT_MOSAIC_ID = process.env.MOSAIC_ID || "72C0212E67A08BCE";
const MAX_FEE = process.env.MAX_FEE ? UInt64.fromUint(Number(process.env.MAX_FEE)) : UInt64.fromUint(1000000);

if (!SENDER_PRIVATE_KEY) {
  console.error("SENDER_PRIVATE_KEY environment variable is required.");
  process.exit(1);
}

app.post("/api/trigger-transaction", async (req, res) => {
  try {
    const { recipient, mosaicAmount, message } = req.body;
    if (!recipient || !mosaicAmount) {
      res.status(400).json({
        error: 'Invalid input parameters. "recipient" and "mosaicAmount" are required.',
      });
      return;
    }

    // Set up the repository factory to connect to the Symbol node
    const repositoryFactory = new RepositoryFactoryHttp(NODE_URL);

    // Retrieve necessary network parameters
    const epochAdjustment = await firstValueFrom(repositoryFactory.getEpochAdjustment());
    const networkType = await firstValueFrom(repositoryFactory.getNetworkType());
    const networkGenerationHash = await firstValueFrom(repositoryFactory.getGenerationHash());

    // Create the recipient address from the raw string
    const recipientAddress = Address.createFromRawAddress(recipient);

    // Create a mosaic object using the default mosaic ID and the provided amount
    const mosaic = new Mosaic(new MosaicId(DEFAULT_MOSAIC_ID), UInt64.fromUint(Number(mosaicAmount)));

    // Use a plain message if provided, otherwise use an empty message
    const txMessage = message ? PlainMessage.create(message) : EmptyMessage;

    // Create the transfer transaction.
    // The initial fee is set to 0 and then defined by setMaxFee.
    const transferTransaction = TransferTransaction.create(
      Deadline.create(epochAdjustment),
      recipientAddress,
      [mosaic],
      txMessage,
      networkType,
      UInt64.fromUint(0)
    ).setMaxFee(MAX_FEE);

    // Create the account instance from the sender's private key
    const account = Account.createFromPrivateKey(SENDER_PRIVATE_KEY, networkType);

    // Sign the transaction
    const signedTransaction = account.sign(transferTransaction, networkGenerationHash);

    // Announce the transaction to the Symbol network
    const transactionRepository = repositoryFactory.createTransactionRepository();
    const announceResponse = await firstValueFrom(transactionRepository.announce(signedTransaction));

    res.json({
      success: true,
      transactionHash: signedTransaction.hash,
      announceResponse,
    });
  } catch (error) {
    console.error("Error executing Symbol transaction:", error);
    res.status(500).json({ error: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Symbol server running on http://localhost:${PORT}`);
});
