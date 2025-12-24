import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const token = [
  process.env.SANITY_API_TOKEN,
  process.env.SANITY_API_WRITE_TOKEN,
  process.env.SANITY_WRITE_TOKEN,
  process.env.SANITY_API_READ_TOKEN,
].find(t => t?.startsWith('sk'));

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});