import { headers } from "next/headers";

const FALLBACK_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function getFallbackProtocol(host: string | null): "http" | "https" {
  return host?.includes("localhost") ? "http" : "https";
}

export async function getServerApiBase() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return FALLBACK_APP_URL;
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? getFallbackProtocol(host);

  return `${protocol}://${host}`;
}

export async function serverApiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const apiBase = await getServerApiBase();
  const requestHeaders = await headers();
  const forwardedHeaders = new Headers(init.headers);
  const cookie = requestHeaders.get("cookie");

  if (cookie && !forwardedHeaders.has("Cookie")) {
    forwardedHeaders.set("Cookie", cookie);
  }

  return fetch(`${apiBase}${path}`, {
    ...init,
    headers: forwardedHeaders,
  });
}
