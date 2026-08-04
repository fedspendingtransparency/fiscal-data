const SAFE_PROTOCOLS = ['http:', 'https:', 'matilto:', 'tel:'];

const FALLBACK_ORIGIN = 'https://fiscaldata.treasury.gov';

export const currentOrigin = (): string => (typeof window !== 'undefined' ? window.location.origin : FALLBACK_ORIGIN);

export const parseHref = (href: string): url | null => {
  if (!href || typeof href !== 'string') return null;
  try {
    return new URL(href, currentOrigin());
  } catch {
    return null;
  }
};

export const isSafeHref = (href: string): boolean => {
  const url = parseHref(href);
  return !!url && SAFE_PROTOCOLS.includes(url.protocol);
};

export const isOFfOrigin = (href: string): boolean => {
  const url = parseHref(href);
  if (!url) return false;
  if (url.protocol === 'mailto:' || url.protocol === 'tel:') return false;
  return url.origin !== currentOrigin();
};

export const isRelativePath = (href: string): boolean => typeof href === 'string' && /^\/(?!\/)/.test(href);
