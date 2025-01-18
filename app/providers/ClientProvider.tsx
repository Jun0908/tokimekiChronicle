'use client';
import "@rainbow-me/rainbowkit/styles.css";
import { useMemo } from 'react';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';
import { mainnet, goerli, sepolia, polygon, polygonMumbai, zkSync, zkSyncTestnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { rainbowWeb3AuthConnector } from '@/lib/RainbowWeb3authConnector';

// Custom Chains
/*
const mantaPacificSepoliaTestnet: Chain = {
  id: 3441006,
  name: 'Manta Pacific Sepolia Testnet',
  network: 'manta-pacific-sepolia-testnet',
  nativeCurrency: {
    name: 'Manta Token',
    symbol: 'MANTA',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'] },
    public: { http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'] },
  },
  blockExplorers: {
    default: { name: 'Manta Pacific Sepolia Testnet Explorer', url: 'https://pacific-explorer.sepolia-testnet.manta.network' },
  },
  testnet: true,
};

const mantaPacific: Chain = {
  id: 169,
  name: 'Manta Pacific',
  network: 'manta-pacific',
  nativeCurrency: {
    name: 'Manta Token',
    symbol: 'MANTA',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://pacific-rpc.manta.network/http'] },
    public: { http: ['https://pacific-rpc.manta.network/http'] },
  },
  blockExplorers: {
    default: { name: 'Manta Pacific Explorer', url: 'https://pacific-explorer.manta.network' },
  },
  testnet: false,
};
*/
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const { chains, publicClient } = useMemo(() => configureChains(
    [
      mainnet,
      goerli,
      sepolia,
      polygon,
      polygonMumbai,
      //zkSync,
      //zkSyncTestnet,
      //mantaPacific,
      //mantaPacificSepoliaTestnet,
    ],
    [
      alchemyProvider({ 
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '', 
      }),
      publicProvider(),
    ]
  ), []);

  const connectors = useMemo(() => connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        walletConnectWallet({ chains }),
        metaMaskWallet({ chains }),
        rainbowWeb3AuthConnector({ chains }) as any,
      ],
    },
  ]), [chains]);

  const wagmiConfig = useMemo(() => createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  }), [connectors, publicClient]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
