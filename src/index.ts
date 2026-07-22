import { GhlClient } from "./ghl/client.js";

/**
 * REOS entrypoint — Real Estate Operating System on GoHighLevel.
 * Start here once .env has GHL_PRIVATE_TOKEN + GHL_LOCATION_ID.
 */
async function main(): Promise<void> {
  const ghl = new GhlClient();
  const location = await ghl.getLocation();
  const name = location.location?.name ?? location.name ?? "unknown";

  console.log(`REOS online. Connected to GHL location: ${name}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
