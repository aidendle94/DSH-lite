import { expect, it, vi } from 'vitest'
import { readHostLocalePreference } from '../src/locale-preference.ts'

type Send = (input: string, init: RequestInit) => Promise<Response>

/** A Host double answering `settings/describe` with the given namespaces, echoing the request id. */
function host(namespaces: unknown, ok = true): ReturnType<typeof vi.fn<Send>> {
  return vi.fn<Send>(async (_input, init) => {
    const request = JSON.parse(String(init.body)) as { rpcId: string }
    return Response.json({ type: 'server-response', rpcId: request.rpcId, result: { ok, value: { namespaces } } })
  })
}

it('reads the saved language through the Host settings RPC with the shell cookie', async () => {
  const send = host([{ ns: 'llm', value: {} }, { ns: 'locale', value: { preference: 'zh' } }])
  await expect(readHostLocalePreference('http://127.0.0.1:4567/?token=launch', 'dsh=cookie', send)).resolves.toBe('zh')
  const [url, init] = send.mock.calls[0]!
  expect(url).toBe('http://127.0.0.1:4567/api/settings/describe')
  expect(init).toMatchObject({ method: 'POST', redirect: 'error', headers: { cookie: 'dsh=cookie' } })
  expect(JSON.parse(String(init.body))).toMatchObject({ type: 'client-request', method: 'settings/describe', payload: { args: {} } })
})

it('returns null when no language was selected', async () => {
  await expect(readHostLocalePreference('http://127.0.0.1:1/', 'c', host([{ ns: 'locale', value: {} }]))).resolves.toBeNull()
})

it.each([
  ['a missing locale namespace', host([])],
  ['a non-string preference', host([{ ns: 'locale', value: { preference: 7 } }])],
  ['a failed RPC result', host([{ ns: 'locale', value: {} }], false)],
  ['a mismatched response id', vi.fn<Send>(async () => Response.json({ type: 'server-response', rpcId: 'other', result: { ok: true, value: { namespaces: [] } } }))],
  ['an HTTP failure', vi.fn<Send>(async () => new Response('denied', { status: 401 }))],
])('rejects %s', async (_case, send) => {
  await expect(readHostLocalePreference('http://127.0.0.1:1/', 'c', send)).rejects.toThrow('desktop locale:')
})
