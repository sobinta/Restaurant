import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const useMembershipRealtime = (userId, onAccessChanged) => {
  const callbackRef = useRef(onAccessChanged);
  callbackRef.current = onAccessChanged;
  useEffect(() => {
    if (!supabase || !userId) return undefined;
    void supabase.realtime.setAuth();
    const channel = supabase.channel(`user:${userId}:access`, { config: { private: true } })
      .on('broadcast', { event: 'access_changed' }, () => callbackRef.current?.())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [userId]);
};
