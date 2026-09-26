// src/services/api/openapiClient.ts
import createClient from "openapi-fetch";
import type { paths } from "../../generated/openapi";
import { env } from "../../config/env";
import { supabase } from "../integrations/supabaseClient";
import { ApiError, normalizeProblem } from "./errors";

type AccessTokenProvider = () => Promise<string | null>;

async function readErrorBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json")
  ) {
    return response.json();
  }

  const text = await response.text();
  return text ? { detail: text } : null;
}

export function createAuthenticatedFetch(
  getAccessToken: AccessTokenProvider,
  fetchImplementation: typeof fetch = fetch,
) {
  return async (request: Request) => {
    const headers = new Headers(request.headers);
    const accessToken = await getAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetchImplementation(
      new Request(request, { headers }),
    );

    if (!response.ok) {
      const problem = normalizeProblem(
        response,
        await readErrorBody(response.clone()),
      );
      throw new ApiError(problem.detail, response.status, problem);
    }

    return response;
  };
}

export const openapiClient = createClient<paths>({
  baseUrl: env.browserApiBaseUrl,
  fetch: createAuthenticatedFetch(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }),
});
