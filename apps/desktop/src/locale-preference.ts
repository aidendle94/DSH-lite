/** Shared UI language preference read from the owned Host over its standard RPC endpoint. */

import { randomUUID } from 'node:crypto'

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Read the saved `locale.preference` through `settings/describe`.
 * @param host - Owned Host URL; only its origin is used.
 * @param cookie - Host-issued authentication cookie.
 * @param send - HTTP client; defaults to the global `fetch`.
 * @returns The saved UI language, or null when no language was selected.
 * @throws Error when the Host rejects the request or returns a malformed settings document.
 */
export async function readHostLocalePreference(
  host: string,
  cookie: string,
  send: (input: string, init: RequestInit) => Promise<Response> = fetch,
): Promise<string | null> {
  const rpcId = randomUUID()
  const method = 'settings/describe'
  const response = await send(new URL(`/api/${method}`, new URL(host).origin).href, {
    method: 'POST', redirect: 'error',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ type: 'client-request', rpcId, method, payload: { args: {} } }),
  })
  if (!response.ok) {
    await response.body?.cancel()
    throw new Error('desktop locale: Host settings request failed')
  }
  const envelope: unknown = await response.json()
  if (!record(envelope) || envelope.type !== 'server-response' || envelope.rpcId !== rpcId
    || !record(envelope.result) || envelope.result.ok !== true) {
    throw new Error('desktop locale: Host settings RPC failed')
  }
  const settings = envelope.result.value
  if (!record(settings) || !Array.isArray(settings.namespaces)) throw new Error('desktop locale: missing settings namespaces')
  const locale: unknown = settings.namespaces.find((item: unknown) => record(item) && item.ns === 'locale')
  if (!record(locale) || !record(locale.value)
    || (locale.value.preference !== undefined && typeof locale.value.preference !== 'string')) {
    throw new Error('desktop locale: invalid locale preference')
  }
  return locale.value.preference ?? null
}
