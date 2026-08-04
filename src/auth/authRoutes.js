const INTERNAL_PATH = /^\/(?!\/)[^\\]*$/;

export const sanitizeReturnPath = (value, fallback = '/account') => {
  if (!value || typeof value !== 'string') return fallback;
  try {
    const decoded = decodeURIComponent(value);
    return INTERNAL_PATH.test(decoded) && !decoded.startsWith('/auth/') ? decoded : fallback;
  } catch {
    return fallback;
  }
};

export const authPath = (pathname, returnTo) => {
  const safeReturn = sanitizeReturnPath(returnTo, '');
  return safeReturn ? `${pathname}?returnTo=${encodeURIComponent(safeReturn)}` : pathname;
};
