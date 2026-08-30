'use client';

import { useEffect, useRef } from 'react';
import { syncServers } from '@/lib/actions/server-actions';

export function ServerSyncTrigger() {
  const synced = useRef(false);

  useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      syncServers().catch(console.error);
    }
  }, []);

  return null;
}
