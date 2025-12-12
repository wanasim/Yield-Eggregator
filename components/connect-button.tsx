"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Simple ConnectButton using RainbowKit's standard component.
 * This works perfectly fine with Nexus SDK - no need for Custom!
 */
export default function ConnectWalletButton({
  className,
}: {
  className?: string;
}) {
  return (
    <ConnectButton
      chainStatus={"none"}
      showBalance={false}
    />
  );
}
