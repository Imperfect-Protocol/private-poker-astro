import { Suspense, lazy, useMemo } from 'react';

function ensureProcessEnv() {
  if (typeof globalThis.process !== 'object' || globalThis.process == null) {
    globalThis.process = { env: {} };
  }
  if (typeof globalThis.process.env !== 'object' || globalThis.process.env == null) {
    globalThis.process.env = {};
  }

  const env = globalThis.process.env;
  env.NEXT_PUBLIC_PRIVATE_POKER_CHAIN ??= import.meta.env.PUBLIC_PRIVATE_POKER_CHAIN;
  env.NEXT_PUBLIC_PRIVATE_MESH_URL ??= import.meta.env.PUBLIC_PRIVATE_MESH_URL;
  env.NEXT_PUBLIC_PRIVATE_MESH_SIGNAL_URL ??= import.meta.env.PUBLIC_PRIVATE_MESH_SIGNAL_URL;
}

ensureProcessEnv();

const Providers = lazy(() => import('@/components/Providers').then((module) => ({
  default: module.Providers,
})));
const SiteLayout = lazy(() => import('@/components/layout/SiteLayout'));

const registry = {
  splash: lazy(() => import('@/screens/SplashPage')),
  signin: lazy(() => import('@/components/account_signin/Component')),
  mainLobby: lazy(() => import('@/screens/MainLobbyPage')),
  about: lazy(() => import('@/screens/AboutPage')),
  leaderboard: lazy(() => import('@/screens/LeaderboardPage')),
  lobby: lazy(() => import('@/components/lobby/LobbyClient')),
  table: lazy(() => import('@/components/table/TableClient')),
  createTable: lazy(() => import('@/screens/CreateTablePage')),
};

function LoadingTerminal() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center py-16 text-teal-600/50 font-mono text-xs uppercase tracking-widest border border-dashed border-teal-500/20 rounded-xl bg-slate-900/30">
        Loading Data Terminal...
      </div>
    </div>
  );
}

function RouteContent({ route, props }) {
  const Page = registry[route] ?? registry.splash;
  return <Page {...props} />;
}

export default function RouteIsland({ route, props = {}, site = false }) {
  const resolvedProps = useMemo(() => props ?? {}, [props]);
  const content = <RouteContent route={route} props={resolvedProps} />;

  return (
    <Suspense fallback={<LoadingTerminal />}>
      <Providers>
        {site ? <SiteLayout>{content}</SiteLayout> : content}
      </Providers>
    </Suspense>
  );
}
