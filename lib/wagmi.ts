import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  arbitrum,
  polygon,
  optimism,
  avalanche,
} from "wagmi/chains";
import { connectors } from "@/lib/connectors";
import { createConfig, http } from "wagmi";

export const config = createConfig({
  connectors,
  chains: [
    // mainnet,
    arbitrum,
    polygon,
    optimism,
    avalanche, // TODO: Limit chains to Nexus compatible chains
  ],
  transports: {
    // [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
  },
  ssr: true, // If your dApp uses server side rendering (SSR),
});
