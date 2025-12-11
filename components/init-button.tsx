'use client';

import { useAccount } from 'wagmi';

/**
 * InitButton for Nexus SDK initialization.
 * This uses wagmi's useAccount hook to get the provider from the connected wallet.
 * Works with both standard and custom ConnectButton!
 */
export default function InitButton({
  className,
  onReady,
}: { 
  className?: string; 
  onReady?: () => void;
}) {
  const { connector, isConnected } = useAccount();
  
  const onClick = async () => {
    try {
      if (!isConnected || !connector) {
        throw new Error('Please connect your wallet first');
      }

      // Get the provider from the connected wallet
      const provider = await connector?.getProvider();
      if (!provider) throw new Error('No provider found');
      
      // TODO: Initialize Nexus SDK here
      // await initializeWithProvider(provider);
      
      console.log('Provider obtained:', provider);
      onReady?.();
      alert('Nexus initialized (provider obtained - implement initialization logic)');
    } catch (e: any) {
      alert(e?.message ?? 'Init failed');
    }
  };
  
  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={!isConnected}
    >
      Initialize Nexus
    </button>
  );
}

