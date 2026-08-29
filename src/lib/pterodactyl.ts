/** Types for the Pterodactyl Client API response at GET /api/client */
export interface PteroServerLimits {
  memory: number | null;
  cpu: number | null;
  disk: number | null;
  swap: number | null;
  io: number | null;
}

export interface PteroServerAttributes {
  identifier: string;
  name: string;
  node: string | null;
  description?: string;
  limits: PteroServerLimits;
  // ... more fields returned by the API (state, allocation, etc.)
  [key: string]: unknown;
}

export interface PteroClientResponse {
  object: "list";
  data: { attributes: PteroServerAttributes }[];
}

/** A normalised server record shown in the aggregator dashboard. */
export interface AggregatedServer {
  panelId: string;
  panelName: string;
  panelUrl: string;
  identifier: string;
  name: string;
  node: string | null;
  memoryLimit: number | null;
  cpuLimit: number | null;
}

export interface FetchPanelResult {
  panelId: string;
  panelName: string;
  panelUrl: string;
  ok: boolean;
  error?: string;
  servers: AggregatedServer[];
}

/**
 * Fetch and flatten a single Pterodactyl panel's server list.
 * Runs only in server context (API keys are decrypted in memory here).
 */
export async function fetchPanelServers(
  panel: {
    id: string;
    panelName: string;
    panelUrl: string;
    apiKey: string; // decrypted in-memory, never persisted here
  }
): Promise<FetchPanelResult> {
  const base = {
    panelId: panel.id,
    panelName: panel.panelName,
    panelUrl: panel.panelUrl,
  };

  try {
    const res = await fetch(`${panel.panelUrl}/api/client`, {
      headers: {
        Authorization: `Bearer ${panel.apiKey}`,
        Accept: "application/json",
      },
      // Fail fast; a panel being down must not hang the whole dashboard.
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ...base,
        ok: false,
        servers: [],
        error: `HTTP ${res.status} ${res.statusText}`,
      };
    }

    const json = (await res.json()) as PteroClientResponse;
    const servers: AggregatedServer[] = (json.data ?? []).map(({ attributes }) => ({
      panelId: panel.id,
      panelName: panel.panelName,
      panelUrl: panel.panelUrl,
      identifier: attributes.identifier,
      name: attributes.name,
      node: attributes.node ?? null,
      memoryLimit: attributes.limits?.memory ?? null,
      cpuLimit: attributes.limits?.cpu ?? null,
    }));

    return { ...base, ok: true, servers };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "TimeoutError"
        ? "Timeout fetching panel"
        : err instanceof Error
          ? err.message
          : "Unknown fetch error";
    return { ...base, ok: false, servers: [], error: message };
  }
}

/**
 * Fetch all panels concurrently, flattening the results.
 * Uses allSettled internally so one failing panel never breaks the rest.
 */
export async function aggregatePanels(
  panels: {
    id: string;
    panelName: string;
    panelUrl: string;
    apiKey: string;
  }[]
): Promise<FetchPanelResult[]> {
  return Promise.all(panels.map(fetchPanelServers));
}