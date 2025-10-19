import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "kqg258tu",
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-05-30",
  stega: false,
});
