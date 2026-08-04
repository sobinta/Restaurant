import { requireSupabase } from '../lib/supabase';

const decodeVapidKey = (value) => {
  const padding = '='.repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replaceAll('-', '+').replaceAll('_', '/');
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

export const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

export const enablePushNotifications = async (branchId = null) => {
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();
  if (!pushSupported()) throw new Error('PUSH_NOT_SUPPORTED');
  if (!vapidKey) throw new Error('PUSH_NOT_CONFIGURED');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('PUSH_PERMISSION_DENIED');
  const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeVapidKey(vapidKey) });
  const { data, error } = await requireSupabase().functions.invoke('register-push-subscription', { body: { subscription: subscription.toJSON(), branchId } });
  if (error) throw error;
  return data;
};
