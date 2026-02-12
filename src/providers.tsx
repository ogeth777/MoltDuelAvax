import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { avalancheFuji } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'MoltDuel',
  projectId: 'YOUR_PROJECT_ID', // Replace with valid WalletConnect ID for production
  chains: [avalancheFuji],
  ssr: false, // Vite is client-side
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
            theme={darkTheme({
                accentColor: '#E84142', // Avalanche Red
                accentColorForeground: 'white',
                borderRadius: 'medium',
            })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
