import { useCallback, useEffect, useMemo, useState } from 'react';

function currentUrl() {
  if (typeof window === 'undefined') {
    return new URL('http://localhost/');
  }
  return new URL(window.location.href);
}

function navigateTo(href, mode = 'push') {
  if (typeof window === 'undefined') return;
  const target = typeof href === 'string' ? href : href?.pathname ?? '/';
  if (mode === 'replace') {
    window.location.replace(target);
  } else {
    window.location.assign(target);
  }
}

export function useRouter() {
  return useMemo(() => ({
    push: (href) => navigateTo(href, 'push'),
    replace: (href) => navigateTo(href, 'replace'),
    refresh: () => {
      if (typeof window !== 'undefined') window.location.reload();
    },
    back: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
    forward: () => {
      if (typeof window !== 'undefined') window.history.forward();
    },
    prefetch: () => Promise.resolve(),
  }), []);
}

export function useSearchParams() {
  const [search, setSearch] = useState(() => currentUrl().search);

  useEffect(() => {
    const handlePopState = () => setSearch(currentUrl().search);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => currentUrl().pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(currentUrl().pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

export function useParams() {
  return {};
}

export function redirect(href) {
  navigateTo(href, 'replace');
}

export function notFound() {
  throw new Error('Not found');
}

export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [];
export const permanentRedirect = redirect;
