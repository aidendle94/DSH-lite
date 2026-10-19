/** SDK fixture for native registry changes and unmodified DeepSeek request observation. */
import { appendFile } from 'node:fs/promises'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'sdk-dynamic-tool-cache-fixture'
export const inject = ['tools', 'systemPrompt']

/** Observe each request and let the model add or remove a scoped tool. */
export function apply(ctx, config) {
  const states = new Map()
  ctx.on('session/event', (session, event) => {
    const state = states.get(session.id)
    if (state !== undefined && event.type === 'step/start') {
      state.turn = event.data.turn
      state.step = event.data.step
    }
  })
  // Observe the exact Messages body at the process fetch boundary; agent requests carry the control tool.
  ctx.effect(() => {
    const original = globalThis.fetch
    globalThis.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.endsWith('/v1/messages') && typeof init?.body === 'string') {
        const headers = new Headers(init.headers)
        const body = JSON.parse(init.body)
        if (!headers.has('x-deepseek-harness-compact') && body.tools?.some(tool => tool.name === 'cache_tool_control')) {
          const state = states.get(headers.get('x-deepseek-harness-session-id'))
          if (state === undefined) throw new Error('The SDK request has no observed agent.')
          await appendFile(config.evidencePath, `${JSON.stringify({ ...state, body })}\n`)
        }
      }
      return original(input, init)
    }
    return () => { globalThis.fetch = original }
  })
  ctx.on('agent/created', ({ agent }) => {
    const scope = agent.ctx
    const state = { stage: 'initial', turn: 0, step: 0 }
    states.set(agent.id, state)
    scope.effect(() => () => { states.delete(agent.id) })
    scope.effect(() => scope.tools.restrict({ allow: [] }))
    let guidance = ''
    scope.systemPrompt.section({ name: 'sdk:dynamic-tool-guidance', order: 400, text: () => guidance })
    let removeTool
    scope.effect(() => scope.tools.register(defineTool({
      name: 'cache_tool_control',
      description: 'Add or remove the temporary cache_sample tool. It becomes available on the model step after add returns.',
      parameters: { action: { type: 'string', enum: ['add', 'remove'], required: true } },
      output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
      async execute({ action }) {
        if (action === 'add') {
          if (removeTool !== undefined) throw new Error('The sample tool is already registered.')
          if (config.updatePrompt) guidance = 'Place each generated sample label on its own line.'
          removeTool = scope.effect(() => scope.tools.register(defineTool({
            name: 'cache_sample',
            description: 'Read a randomly generated sample label created for this example run.',
            parameters: {},
            output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
            async execute() {
              await appendFile(config.callsPath, 'sample\n')
              return config.sampleLabel
            },
          })))
          state.stage = 'added'
          await appendFile(config.callsPath, 'add\n')
          return 'Tool added. Call cache_sample on the next model step to obtain the generated sample label.'
        }
        if (removeTool === undefined) throw new Error('The sample tool is not registered.')
        await removeTool()
        removeTool = undefined
        state.stage = 'removed'
        await appendFile(config.callsPath, 'remove\n')
        return 'Tool removed. The sample tool is unavailable.'
      },
    })))
  })
}
