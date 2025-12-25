import "server-only";
import { client } from "./client";

export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params);
  return { data };
}

// Mock SanityLive for compatibility
export function SanityLive() {
  return null;
}