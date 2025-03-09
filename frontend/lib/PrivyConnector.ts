import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains";
import { toPrivyWallet } from "@privy-io/cross-app-connect/rainbow-kit";

// 🔹 `chains` を正しく定義
export const chains = [mainnet, sepolia, polygon, optimism, arbitrum] as const;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        toPrivyWallet({
          id: "cm7a2v9xr033reh5g4kd3i7a0",
          name: "Strawberry Fields",
          iconUrl:
            "https://privy-assets-public.s3.amazonaws.com/strawberry.png",
        }),
      ],
    },
  ],
  {
    appName: "test1031",
    projectId: "87e3393ad461835eee829b8e6adc2c3a",
  }
);

// 🔹 `createConfig` を使用して `PrivyConnector` を定義
export const PrivyConnector = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
  ssr: true,
});
