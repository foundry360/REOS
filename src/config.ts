import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and add your GHL credentials.`,
    );
  }
  return value;
}

export const config = {
  ghl: {
    privateToken: () => required("GHL_PRIVATE_TOKEN"),
    locationId: () => required("GHL_LOCATION_ID"),
    apiBase:
      process.env.GHL_API_BASE?.trim() ||
      "https://services.leadconnectorhq.com",
    apiVersion: process.env.GHL_API_VERSION?.trim() || "2021-07-28",
  },
};
