import { GhlApiError, GhlClient } from "../ghl/client.js";
import {
  createCustomField,
  createCustomFieldFolder,
  listCustomFields,
  type CreateCustomFieldInput,
} from "../ghl/customFields.js";

/**
 * Identity (First Name, Last Name, Phone, Email) are native GHL contact fields.
 * Seeds Intent, Buyer/Seller/Investor profiles, and AI concierge fields.
 */
const FIELD_GROUPS: Array<{
  folder: string;
  fields: CreateCustomFieldInput[];
}> = [
  {
    folder: "Intent",
    fields: [
      {
        name: "Lead Type",
        dataType: "SINGLE_OPTIONS",
        options: ["Buyer", "Seller", "Investor", "Referral"],
        placeholder: "Select lead type",
      },
      {
        name: "Lead Temperature",
        dataType: "SINGLE_OPTIONS",
        options: ["Hot", "Warm", "Cold"],
        placeholder: "Select lead temperature",
      },
    ],
  },
  {
    folder: "Buyer Profile",
    fields: [
      {
        name: "Target Location",
        dataType: "TEXT",
        placeholder: "City, neighborhood, or zip",
      },
      {
        name: "Budget",
        dataType: "MONETORY",
        placeholder: "Max purchase budget",
      },
      {
        name: "Property Type",
        dataType: "SINGLE_OPTIONS",
        options: [
          "Single Family",
          "Condo",
          "Townhome",
          "Multi-Family",
          "Land",
          "Commercial",
          "Other",
        ],
        placeholder: "Select property type",
      },
      {
        name: "Financing Status",
        dataType: "SINGLE_OPTIONS",
        options: [
          "Cash",
          "Pre-Approved",
          "Pre-Qualified",
          "Needs Financing",
          "Unknown",
        ],
        placeholder: "Select financing status",
      },
      {
        name: "Timeline",
        dataType: "SINGLE_OPTIONS",
        options: [
          "ASAP",
          "0-30 Days",
          "1-3 Months",
          "3-6 Months",
          "6+ Months",
          "Just Exploring",
        ],
        placeholder: "Select buyer timeline",
      },
      {
        name: "Must Have Features",
        dataType: "LARGE_TEXT",
        placeholder: "Beds, baths, garage, school district, etc.",
      },
    ],
  },
  {
    folder: "Seller Profile",
    fields: [
      {
        name: "Property Address",
        dataType: "TEXT",
        placeholder: "Street, city, state, zip",
      },
      {
        name: "Estimated Value",
        dataType: "MONETORY",
        placeholder: "Estimated property value",
      },
      {
        name: "Selling Timeline",
        dataType: "SINGLE_OPTIONS",
        options: [
          "ASAP",
          "0-30 Days",
          "1-3 Months",
          "3-6 Months",
          "6+ Months",
          "Just Exploring",
        ],
        placeholder: "Select selling timeline",
      },
      {
        name: "Motivation",
        dataType: "LARGE_TEXT",
        placeholder: "Why are they selling?",
      },
    ],
  },
  {
    folder: "Investor Profile",
    fields: [
      {
        name: "Investment Strategy",
        dataType: "TEXT",
        placeholder: "Buy and hold, flip, BRRRR, etc.",
      },
      {
        name: "Target Markets",
        dataType: "TEXT",
        placeholder: "Cities or markets of interest",
      },
      {
        name: "Investment Goals",
        dataType: "LARGE_TEXT",
        placeholder: "Cash flow, appreciation, portfolio size, etc.",
      },
    ],
  },
  {
    folder: "AI",
    fields: [
      {
        name: "AI Summary",
        dataType: "LARGE_TEXT",
        placeholder: "Short AI qualification summary",
      },
      {
        name: "Qualification Score",
        dataType: "NUMERICAL",
        placeholder: "0-100",
      },
      {
        name: "Recommended Next Action",
        dataType: "TEXT",
        placeholder: "e.g. Schedule consultation",
      },
      {
        name: "Agent Brief",
        dataType: "LARGE_TEXT",
        placeholder: "Client intelligence brief for the agent",
      },
    ],
  },
];

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

async function main(): Promise<void> {
  const client = new GhlClient();
  console.log("Seeding REOS contact custom fields in GHL\n");
  console.log(`Location: ${client.getLocationId()}`);
  console.log(
    "Skipping Identity (First Name, Last Name, Phone, Email) — native fields.\n",
  );

  let existing = await listCustomFields(client, "contact");
  const existingByName = new Map(
    existing
      .filter((f) => f.name)
      .map((f) => [normalizeName(f.name!), f] as const),
  );

  console.log(`Existing contact custom fields: ${existing.length}`);

  const folderIds = new Map<string, string>();

  for (const group of FIELD_GROUPS) {
    console.log(`\nFolder: ${group.folder}`);
    const folder = await createCustomFieldFolder(client, group.folder);
    if (folder?.id) {
      folderIds.set(group.folder, folder.id);
      console.log(`  Folder ready (${folder.id})`);
    } else {
      console.log(
        "  Folder API unavailable or missing scope — creating fields ungrouped.",
      );
    }

    for (const [index, field] of group.fields.entries()) {
      const key = normalizeName(field.name);
      if (existingByName.has(key)) {
        const current = existingByName.get(key)!;
        console.log(`  Skip (exists): ${field.name} [${current.id}]`);
        continue;
      }

      try {
        const created = await createCustomField(client, {
          ...field,
          parentId: folderIds.get(group.folder),
          position: index,
        });
        const id = created.id ?? "(no id)";
        console.log(`  Created: ${field.name} [${id}] (${field.dataType})`);
        existingByName.set(key, created);
      } catch (error) {
        if (error instanceof GhlApiError) {
          console.error(`  Failed: ${field.name} — ${error.status}`);
          console.error(`  ${JSON.stringify(error.body)}`);
          if (error.status === 401 || error.status === 403) {
            console.error(
              "\nAdd Private Integration scopes: locations/customFields.readonly + locations/customFields.write",
            );
            process.exitCode = 1;
            return;
          }
        } else {
          console.error(`  Failed: ${field.name}`, error);
        }
        process.exitCode = 1;
      }
    }
  }

  existing = await listCustomFields(client, "contact");
  const seededNames = FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.name));
  console.log("\n--- Seed summary ---");
  for (const name of seededNames) {
    const match = existing.find(
      (f) => normalizeName(f.name ?? "") === normalizeName(name),
    );
    console.log(
      match
        ? `OK  ${name}  key=${match.fieldKey ?? "n/a"}  id=${match.id}`
        : `MISSING  ${name}`,
    );
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
