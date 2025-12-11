import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Yield Eggregator",
    projectId:
      (process.env
        .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string) ||
      "",
  }
);
