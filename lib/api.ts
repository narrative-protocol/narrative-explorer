const BASE_URL = "https://api-testing-uhuy.dekat.tech/api/explorer";

async function fetchAPI<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  if (!json.success) throw new Error(json.error || "Unknown API error");
  return json.data;
}

export interface GlobalStats {
  stats: {
    publicWorlds: number;
    publicDeployments: number;
    totalEvents: number;
    totalEntities: number;
  };
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: number;
  eventName: string;
  deploymentId: number;
  deploymentName: string;
  deploymentAddress: string;
  worldId: number;
  worldName: string;
  worldAddress: string;
  executedAt: string;
  hasAttestation: boolean;
  hasSolanaTx: boolean;
  hasNearTx: boolean;
}

export interface WorldSummary {
  id: number;
  address: string;
  name: string;
  description: string;
  domainTags: string[];
  createdAt: string;
  publicDeploymentCount: number;
}

export interface WorldDetail {
  id: number;
  address: string;
  name: string;
  description: string;
  domainTags: string[];
  createdAt: string;
  entitySchemas: EntitySchema[];
  events: WorldEvent[];
  publicDeployments: DeploymentSummary[];
}

export interface EntitySchema {
  id: number;
  name: string;
  description: string;
  attributeDefinitions: AttributeDefinition[];
}

export interface AttributeDefinition {
  id: number;
  name: string;
  type: string;
  constraints?: Record<string, unknown>;
  defaultValue?: unknown;
}

export interface WorldEvent {
  id: number;
  name: string;
  description: string;
  versions: { id: number; version: number; publishedAt: string }[];
}

export interface DeploymentSummary {
  id: number;
  address: string;
  name: string;
  description?: string;
  mode: string;
  targetChain: string;
  worldId?: number;
  worldName?: string;
  createdAt?: string;
}

export interface DeploymentDetail {
  id: number;
  address: string;
  name: string;
  mode: string;
  targetChain: string;
  lockedAt: string | null;
  createdAt: string;
  world: { id: number; name: string; description: string };
  eventBindings: {
    id: number;
    event: { id: number; name: string };
    eventVersion: { id: number; version: number; publishedAt: string };
  }[];
  stats: {
    entityInstanceCount: number;
    eventHistoryCount: number;
  };
}

export interface EntityInstance {
  id: number;
  instanceId: string;
  schemaId: number;
  schemaName: string;
  state: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EventHistoryItem {
  id: number;
  eventId?: number;
  eventName: string;
  eventVersionId?: number;
  executedAt: string;
  hasSolanaTx: boolean;
  hasNearTx: boolean;
  deployment?: { id: number; name: string };
  world?: { id: number; name: string };
  event?: { id: number; name: string };
}

export interface EventDetail {
  id: number;
  deployment: {
    id: number;
    name: string;
    targetChain: string;
    world: { id: number; name: string };
  };
  event: { id: number; name: string; description: string };
  eventVersion: {
    id: number;
    version: number;
    inputSchema: Record<string, unknown>;
    resultSchema: Record<string, unknown>;
    stateChangeSchema: Record<string, unknown>;
    publishedAt: string;
  };
  execution: {
    input: Record<string, unknown>;
    stateChanges: Record<string, unknown>;
    result: Record<string, unknown>;
    executedAt: string;
    executedBy: number;
  };
  llm?: {
    model: string;
    request: string;
    response: string;
  };
  attestation: {
    signature: string;
    signingAddress: string;
    signingAlgo: string;
    text: string;
  } | null;
  onChain: {
    solana: {
      signature: string;
      eventRecordPda: string;
      explorerUrl: string;
    } | null;
    near: {
      txHash: string;
      receiptId?: string;
      explorerUrl: string;
    } | null;
  };
}

export interface EntityDetail {
  id: number;
  instanceId: string;
  deployment: {
    id: number;
    name: string;
    world: { id: number; name: string };
  };
  schema: {
    id: number;
    name: string;
    description: string;
    attributes: AttributeDefinition[];
  };
  currentState: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  changeHistory: {
    historyId: number;
    eventId: number;
    eventName: string;
    changes: Record<string, unknown>;
    executedAt: string;
  }[];
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchResults {
  worlds: WorldSummary[];
  deployments: DeploymentSummary[];
  events: EventHistoryItem[];
}

export interface TxLookup {
  historyId: number;
  deployment: { id: number; name: string };
  event: { id: number; name: string };
  executedAt: string;
  solana?: { signature: string; eventRecordPda: string; explorerUrl: string };
  near?: { txHash: string; explorerUrl: string };
}

// API Functions
export async function getGlobalStats(): Promise<GlobalStats> {
  return fetchAPI<GlobalStats>("");
}

export async function searchExplorer(q: string): Promise<SearchResults> {
  return fetchAPI<SearchResults>("/search", { q });
}

export async function getWorlds(
  page = 1,
  limit = 20
): Promise<Paginated<WorldSummary>> {
  const data = await fetch(`${BASE_URL}/worlds?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 },
  });
  const json = await data.json();
  return { data: json.data, pagination: json.pagination };
}

export async function getWorldDetail(id: number): Promise<WorldDetail> {
  return fetchAPI<WorldDetail>(`/worlds/${id}`);
}

export async function getDeployments(
  page = 1,
  limit = 20
): Promise<Paginated<DeploymentSummary>> {
  const data = await fetch(
    `${BASE_URL}/deployments?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  const json = await data.json();
  return { data: json.data, pagination: json.pagination };
}

export async function getDeploymentDetail(
  id: number
): Promise<DeploymentDetail> {
  return fetchAPI<DeploymentDetail>(`/deployments/${id}`);
}

export async function getDeploymentEntities(
  id: number,
  page = 1,
  limit = 20
): Promise<Paginated<EntityInstance>> {
  const data = await fetch(
    `${BASE_URL}/deployments/${id}/entities?page=${page}&limit=${limit}`,
    { next: { revalidate: 30 } }
  );
  const json = await data.json();
  return { data: json.data, pagination: json.pagination };
}

export async function getDeploymentHistory(
  id: number,
  limit = 20,
  cursor?: string
) {
  const params: Record<string, string> = { limit: String(limit) };
  if (cursor) params.cursor = cursor;
  return fetchAPI<EventHistoryItem[]>(`/deployments/${id}/history`, params);
}

export async function getGlobalEvents(
  page = 1,
  limit = 20
): Promise<Paginated<EventHistoryItem>> {
  const data = await fetch(`${BASE_URL}/events?page=${page}&limit=${limit}`, {
    next: { revalidate: 30 },
  });
  const json = await data.json();
  return { data: json.data, pagination: json.pagination };
}

export async function getEventDetail(historyId: number): Promise<EventDetail> {
  return fetchAPI<EventDetail>(`/events/${historyId}`);
}

export async function getEntityDetail(id: number): Promise<EntityDetail> {
  return fetchAPI<EntityDetail>(`/entities/${id}`);
}

export async function lookupSolanaTx(signature: string): Promise<TxLookup> {
  return fetchAPI<TxLookup>(`/tx/solana/${signature}`);
}

export async function lookupNearTx(hash: string): Promise<TxLookup> {
  return fetchAPI<TxLookup>(`/tx/near/${hash}`);
}
