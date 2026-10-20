import "server-only";

import { headers } from "next/headers";

export type RequestContext = {
  ipAddress: string | null;
  userAgent: string | null;
};

export async function getRequestContext(): Promise<RequestContext> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const ipAddress = (forwarded?.split(",")[0] ?? requestHeaders.get("x-real-ip"))?.trim() || null;
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 512) || null;
  return { ipAddress, userAgent };
}
