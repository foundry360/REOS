import { GhlClient } from "./client.js";

export type CustomFieldDataType =
  | "TEXT"
  | "LARGE_TEXT"
  | "NUMERICAL"
  | "MONETORY"
  | "PHONE"
  | "EMAIL"
  | "DATE"
  | "SINGLE_OPTIONS"
  | "MULTIPLE_OPTIONS"
  | "CHECKBOX"
  | "RADIO";

export type CustomFieldDef = {
  id?: string;
  name?: string;
  fieldKey?: string;
  dataType?: string;
  model?: string;
  parentId?: string;
  options?: string[] | Array<{ key?: string; label?: string }>;
};

export type CreateCustomFieldInput = {
  name: string;
  dataType: CustomFieldDataType;
  model?: "contact" | "opportunity";
  placeholder?: string;
  parentId?: string;
  options?: string[];
  position?: number;
};

export async function listCustomFields(
  client: GhlClient,
  model: "contact" | "opportunity" = "contact",
): Promise<CustomFieldDef[]> {
  const locationId = client.getLocationId();
  const response = await client.request<{
    customFields?: CustomFieldDef[];
  }>({
    path: `/locations/${locationId}/customFields`,
    query: { model },
  });
  return response.customFields ?? [];
}

export async function createCustomField(
  client: GhlClient,
  input: CreateCustomFieldInput,
): Promise<CustomFieldDef> {
  const locationId = client.getLocationId();
  const body: Record<string, unknown> = {
    name: input.name,
    dataType: input.dataType,
    model: input.model ?? "contact",
  };

  if (input.placeholder) body.placeholder = input.placeholder;
  if (input.parentId) body.parentId = input.parentId;
  if (input.position !== undefined) body.position = input.position;
  if (input.options?.length) body.options = input.options;

  const response = await client.request<{
    customField?: CustomFieldDef;
  }>({
    method: "POST",
    path: `/locations/${locationId}/customFields`,
    body,
  });

  return response.customField ?? response;
}

export async function createCustomFieldFolder(
  client: GhlClient,
  name: string,
): Promise<{ id?: string; name?: string } | null> {
  const locationId = client.getLocationId();

  // Prefer V2 folders endpoint when available on the account.
  try {
    const response = await client.request<{
      folder?: { id?: string; name?: string };
      id?: string;
      name?: string;
    }>({
      method: "POST",
      path: "/custom-fields/folders",
      body: {
        locationId,
        name,
        objectKey: "contact",
      },
    });
    return response.folder ?? response;
  } catch {
    return null;
  }
}
