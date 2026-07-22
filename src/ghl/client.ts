import { config } from "../config.js";

export type GhlRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

export class GhlApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "GhlApiError";
  }
}

/**
 * Direct GHL connection via Private Integration Token (PIT).
 * No OAuth refresh cycle — rotate the token in GHL when needed.
 */
export class GhlClient {
  private readonly token: string;
  private readonly locationId: string;
  private readonly apiBase: string;
  private readonly apiVersion: string;

  constructor(options?: {
    privateToken?: string;
    locationId?: string;
    apiBase?: string;
    apiVersion?: string;
  }) {
    this.token = options?.privateToken ?? config.ghl.privateToken();
    this.locationId = options?.locationId ?? config.ghl.locationId();
    this.apiBase = options?.apiBase ?? config.ghl.apiBase;
    this.apiVersion = options?.apiVersion ?? config.ghl.apiVersion;
  }

  getLocationId(): string {
    return this.locationId;
  }

  async request<T>(options: GhlRequestOptions): Promise<T> {
    const url = new URL(
      options.path.startsWith("http")
        ? options.path
        : `${this.apiBase}${options.path.startsWith("/") ? "" : "/"}${options.path}`,
    );

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
      Version: this.apiVersion,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      throw new GhlApiError(
        `GHL ${options.method ?? "GET"} ${url.pathname} failed (${response.status})`,
        response.status,
        parsed,
      );
    }

    return parsed as T;
  }

  /** Prove the token + location are valid. */
  async getLocation(): Promise<{
    location?: { id?: string; name?: string; email?: string };
    id?: string;
    name?: string;
  }> {
    return this.request({
      path: `/locations/${this.locationId}`,
    });
  }

  async listContacts(limit = 5): Promise<unknown> {
    return this.request({
      path: "/contacts/",
      query: {
        locationId: this.locationId,
        limit,
      },
    });
  }
}
