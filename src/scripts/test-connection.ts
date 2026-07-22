import { GhlApiError, GhlClient } from "../ghl/client.js";

async function main(): Promise<void> {
  console.log("REOS → GoHighLevel direct connection test\n");

  const client = new GhlClient();
  console.log(`Location ID: ${client.getLocationId()}`);
  console.log("Calling GET /locations/{id} ...");

  try {
    const location = await client.getLocation();
    const name =
      location.location?.name ?? location.name ?? "(name not returned)";
    const id = location.location?.id ?? location.id ?? client.getLocationId();

    console.log("\nConnected.");
    console.log(`  Location: ${name}`);
    console.log(`  ID:       ${id}`);

    console.log("\nFetching a small contacts sample ...");
    const contacts = await client.listContacts(3);
    const count = Array.isArray((contacts as { contacts?: unknown[] }).contacts)
      ? (contacts as { contacts: unknown[] }).contacts.length
      : 0;
    console.log(`  Contacts returned: ${count}`);
    console.log("\nDirect GHL connection is working.");
  } catch (error) {
    if (error instanceof GhlApiError) {
      console.error(`\nGHL error ${error.status}: ${error.message}`);
      console.error(JSON.stringify(error.body, null, 2));
      if (error.status === 401) {
        console.error(
          "\nTip: Check GHL_PRIVATE_TOKEN. Create/rotate it under Settings → Integrations → Private Integrations.",
        );
      }
      if (error.status === 403) {
        console.error(
          "\nTip: Add required scopes (e.g. locations.readonly, contacts.readonly) on the Private Integration.",
        );
      }
      process.exitCode = 1;
      return;
    }

    console.error("\nConnection failed:", error);
    process.exitCode = 1;
  }
}

void main();
