import "server-only";
import { client } from "./client";

export async function sanityFetch<QueryResponse = any>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<{ data: QueryResponse }> {
  const data = await client.fetch<QueryResponse>(query, params);
  return { data };
}

// Mock SanityLive for compatibility
export function SanityLive() {
  return null;
}