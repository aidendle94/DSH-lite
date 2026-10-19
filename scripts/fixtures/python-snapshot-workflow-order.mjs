/** Order child execution after the advanced parent records its corresponding handoff. */
export const name = 'python-snapshot-workflow-order'

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx - Scenario-local host context.
 * @param {{ parentSessionId: string, prompt: string, direct?: { prompt: string, callId: string } }} config - Exact advanced scenario identities.
 */
export function apply(ctx, config) {
  const started = new Set()
  const pending = new Map()
  let disposed = false
  let directResultSeq
  let directStep
  let directSettled = false

  ctx.effect(() => async () => {
    disposed = true
    const waits = [...pending.values()]
    for (const wait of waits) wait.reject(new Error('workflow snapshot barrier disposed'))
    await Promise.allSettled(waits.map(wait => wait.done))
    started.clear()
  })
  ctx.on('session/event', (session, event) => {
    if (disposed || session.id !== config.parentSessionId) return
    if (event.type === 'tool-workflow/agent-start') {
      started.add(event.data.childId)
      pending.get(event.data.childId)?.resolve()
    }
    if (config.direct === undefined) return
    if (event.type === 'tool/result' && event.data.message.source.callId === config.direct.callId) directResultSeq = event.seq
    if (directResultSeq === undefined) return
    // The parent's next model step, settled or attempted, has consumed the direct result.
    if (event.type === 'step/start' && directStep === undefined) directStep = { turn: event.data.turn, step: event.data.step }
    if (directStep !== undefined && (event.type === 'assistant/message' || event.type === 'assistant/attempt')
      && event.data.turn === directStep.turn && event.data.step === directStep.step) {
      directSettled = true
    }
    if (directSettled) {
      for (const wait of pending.values()) if (wait.direct) wait.resolve()
    }
  })
  ctx.on('agent/pre-step', async ({ agent, messages, turn, step, signal }, next) => {
    const hasPrompt = prompt => messages.some(message => message.content.some(block => block.type === 'text' && block.text === prompt))
    const direct = config.direct !== undefined && hasPrompt(config.direct.prompt)
    if (agent.session.header.parentSession !== config.parentSessionId || turn !== 1 || step !== 1
      || !direct && !hasPrompt(config.prompt)) {
      return next()
    }
    signal.throwIfAborted()
    if (disposed) throw new Error('workflow snapshot barrier disposed')
    if (direct ? !directSettled : !started.has(agent.id)) {
      const wait = { ...Promise.withResolvers(), direct }
      const abort = () => { wait.reject(signal.reason) }
      signal.addEventListener('abort', abort, { once: true })
      wait.done = wait.promise.finally(() => {
        signal.removeEventListener('abort', abort)
        pending.delete(agent.id)
      })
      pending.set(agent.id, wait)
      await wait.done
    }
    signal.throwIfAborted()
    if (disposed) throw new Error('workflow snapshot barrier disposed')
    return next()
  })
}
