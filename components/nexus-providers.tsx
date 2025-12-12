"use client";

import { useEffect, useMemo } from "react";
import {
  EthereumProvider,
  NexusSDK,
} from "@avail-project/nexus-core";
import { useConnection } from "wagmi";

export default function NexusProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const sdk = useMemo(
    () => new NexusSDK({ network: "testnet" }),
    []
  );

  const { connector, isConnected } = useConnection();

  // Single useEffect handles both mount and connection changes
  useEffect(() => {
    if (!isConnected || !connector) {
      // Deinitialize if disconnected
      if (sdk.isInitialized()) {
        sdk.deinit().catch(console.error);
      }
      return;
    }

    const initialize = async () => {
      try {
        // Skip if already initialized
        if (sdk.isInitialized()) {
          return;
        }

        const provider = await connector.getProvider();
        if (!provider) return;

        await sdk.initialize(provider as EthereumProvider);
        console.log("SDK initialized");
      } catch (error) {
        console.error("Error initializing SDK:", error);
      }
    };

    initialize();
  }, [connector, isConnected, sdk]);

  return <>{children}</>;
}
