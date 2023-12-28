// sanity.js
import { createClient } from "@sanity/client";
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: "i3el3t92",
  dataset: "production",
  useCdn: false,
  apiVersion: "2021-03-25",
});
