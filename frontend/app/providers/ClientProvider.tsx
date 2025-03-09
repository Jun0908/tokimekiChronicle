'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { toPrivyWallet } from '@privy-io/cross-app-connect/rainbow-kit';
import { useEffect, useState } from 'react';

// 環境変数から Privy App ID を取得
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
/*
if (!PRIVY_APP_ID) {
  console.error("⚠️ NEXT_PUBLIC_PRIVY_APP_ID is not set. Please check your environment variables.");
} else {
  console.log("✅ Privy App ID:", PRIVY_APP_ID);
}
*/
// QueryClient のインスタンスを作成
const queryClient = new QueryClient();

// チェーンを定義
const chains = [mainnet, sepolia, polygon, optimism, arbitrum, base] as const;

// WalletConnect のプロジェクトID
const projectId = '87e3393ad461835eee829b8e6adc2c3a';

// Privy Wallet のコネクター設定
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        toPrivyWallet({
          id: 'clxva96js0039k9pb3pw2uovx',
          name: 'Strawberry Fields',
          iconUrl: 'https://privy-assets-public.s3.amazonaws.com/strawberry.png',
        }),
      ],
    },
  ],
  {
    appName: 'test1031',
    projectId,
  }
);

// Wagmi & RainbowKit 設定
const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(), // Base の transport を追加
  },
  ssr: true,
});

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // クライアント側でのみ PrivyProvider をレンダリング
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // SSR を防ぐために初回レンダリングをスキップ

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <PrivyProvider appId={PRIVY_APP_ID}>{children}</PrivyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
