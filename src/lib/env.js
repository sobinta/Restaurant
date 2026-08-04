const trim = (value) => typeof value === 'string' ? value.trim() : '';

const supabaseUrl = trim(import.meta.env.VITE_SUPABASE_URL);
const supabasePublishableKey = trim(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
};

export const supabaseConfig = Object.freeze({
  url: supabaseUrl,
  publishableKey: supabasePublishableKey,
  configured: isValidUrl(supabaseUrl) && supabasePublishableKey.startsWith('sb_publishable_'),
});

export const getPublicAppUrl = () => {
  const configuredUrl = trim(import.meta.env.VITE_PUBLIC_APP_URL);
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};
