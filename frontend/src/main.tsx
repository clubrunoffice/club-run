import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { polygonAmoy } from 'viem/chains';
import App from './App.tsx';
import './index.css';

type RootErrorBoundaryState = {
  error: Error | null;
};

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('❌ App initialization error:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-4">
          <h1 className="text-xl font-semibold">Configuration error</h1>
          <p className="text-sm text-white/80">
            The app failed to start. If this is a Privy configuration issue, ensure the Vercel Environment Variable
            <span className="font-mono"> VITE_PRIVY_APP_ID</span> is set and redeploy.
          </p>
          <pre className="text-xs bg-white/5 border border-white/10 rounded p-3 overflow-auto">
            {String(this.state.error.message || this.state.error)}
          </pre>
        </div>
      </div>
    );
  }
}

function MissingPrivyAppId() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-xl font-semibold">Privy not configured</h1>
        <p className="text-sm text-white/80">
          This deployment is missing the Privy App ID. Set the Vercel Environment Variable
          <span className="font-mono"> VITE_PRIVY_APP_ID</span> and redeploy.
        </p>
      </div>
    </div>
  );
}

function InvalidPrivyAppId({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-xl font-semibold">Privy misconfigured</h1>
        <p className="text-sm text-white/80">
          The value of <span className="font-mono">VITE_PRIVY_APP_ID</span> doesn’t look like a Privy App ID.
        </p>
        <p className="text-sm text-white/80">
          Fix: In Privy Dashboard → Settings → Basics, copy <b>App ID</b> (not the <b>Client ID</b> from the Clients
          page), set it as <span className="font-mono">VITE_PRIVY_APP_ID</span> in Vercel, then redeploy.
        </p>
        <pre className="text-xs bg-white/5 border border-white/10 rounded p-3 overflow-auto">{reason}</pre>
      </div>
    </div>
  );
}

const privyAppId = (import.meta.env.VITE_PRIVY_APP_ID as string | undefined)?.trim();
const hasPrivyAppId = Boolean(privyAppId);
const looksLikeClientId = Boolean(privyAppId && /^client-/i.test(privyAppId));
const hasValidPrivyAppId = hasPrivyAppId && !looksLikeClientId;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      {hasValidPrivyAppId ? (
        <PrivyProvider
          appId={privyAppId as string}
          config={{
            appearance: {
              theme: 'dark',
              accentColor: '#7C3AED',
              logo: '/logo.png',
              showWalletLoginFirst: false,
            },
            loginMethods: ['email', 'google', 'wallet'],
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
            defaultChain: polygonAmoy,
            supportedChains: [polygonAmoy],
          }}
          onSuccess={() => {
            console.log('✅ Privy authentication successful');
          }}
        >
          <App />
        </PrivyProvider>
      ) : looksLikeClientId ? (
        <InvalidPrivyAppId reason="Detected a value starting with 'client-'. That is a Privy Client ID, not an App ID." />
      ) : (
        <MissingPrivyAppId />
      )}
    </RootErrorBoundary>
  </StrictMode>
);
