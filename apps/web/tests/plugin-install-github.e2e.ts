// Real Git reaches a controlled proxy failure or stall; the browser shows the
// ordinary failed screen naming the unreachable host, pnpm never starts, and
// Retry asks the same address again.
import { once } from 'node:events'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { createServer, type Socket } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { expect, it, onTestFinished } from 'vitest'
import { launchWebScaffold, watchConsole } from './scaffold.ts'
import { ZH_BROWSER_LOCALE } from './support.ts'

it.each(['network', 'timeout'] as const)('names the unreachable GitHub host after a %s without starting pnpm', async (failure) => {
  const scratch = await mkdtemp(join(tmpdir(), 'dsh-install-github-'))
  onTestFinished(() => rm(scratch, { recursive: true, force: true }))
  const sockets = new Set<Socket>()
  let connections = 0
  const proxy = createServer((socket) => {
    sockets.add(socket)
    socket.on('error', () => {})
    socket.once('close', () => { sockets.delete(socket) })
    socket.once('data', () => { connections++; if (failure === 'network') socket.destroy() })
  })
  onTestFinished(async () => {
    for (const socket of sockets) socket.destroy()
    await new Promise<void>((resolve, reject) => { proxy.close((error) => { if (error) reject(error); else resolve() }) })
  })
  proxy.listen(0, '127.0.0.1')
  await once(proxy, 'listening')
  const address = proxy.address()
  if (address === null || typeof address === 'string') throw new Error('proxy did not bind a TCP port')
  const gitConfig = join(scratch, 'git.config')
  await writeFile(gitConfig, `[http "https://github.com/"]\n proxy = http://127.0.0.1:${String(address.port)}\n`)
  const scaffold = await launchWebScaffold({
    profile: { packages: [], packageManager: { command: process.execPath, args: [], env: { GIT_CONFIG_GLOBAL: gitConfig, GIT_CONFIG_NOSYSTEM: '1' } } },
  })
  onTestFinished(() => scaffold.close())
  const browser = await chromium.launch()
  onTestFinished(() => browser.close())
  const profile = join(scaffold.harnessHome, 'profiles', 'scaffold')
  const manifestPath = join(profile, 'package.json')
  const manifestBefore = await readFile(manifestPath, 'utf8')
  await writeFile(join(profile, 'config'), 'console.log("https://registry.npmjs.org/")\n')
  await writeFile(join(profile, '.attempts'), '')
  await writeFile(join(profile, 'add'), `
    const fs = require('node:fs');
    fs.appendFileSync('.attempts', JSON.stringify(process.argv) + '\\n');
    console.error('pnpm must not start after the GitHub connection check fails');
    process.exitCode = 1;
  `)
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: ZH_BROWSER_LOCALE })
  const tripwire = watchConsole(page)
  await page.goto(scaffold.authenticatedUrl)
  await page.waitForSelector('[class*="frame"]')
  if (await page.getByRole('dialog', { name: '设置' }).count() > 0) await page.keyboard.press('Escape')
  await page.getByRole('navigation', { name: '全局面板' }).getByRole('button', { name: '插件', exact: true }).click()
  await page.getByRole('button', { name: '添加插件', exact: true }).click()
  const spec = 'https://github.com/example/dsh-plugin.git'
  const hostSentence = '无法连接 github.com。GitHub 地址和 .tgz 直链不经过安装源，需要本机能直接访问它或配置代理；如果这个插件也发布到了 npm，请改填包名。'
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: '安装源 npm 官方源', exact: true }).waitFor()
  await dialog.getByRole('textbox', { name: '包名或地址' }).fill(spec)
  await dialog.getByRole('button', { name: '安装', exact: true }).click()
  await dialog.getByText(hostSentence, { exact: true }).waitFor()
  expect(await page.getByRole('dialog').count()).toBe(1)
  expect(await readFile(join(profile, '.attempts'), 'utf8')).toBe('')
  expect(connections).toBeGreaterThan(0)
  await expect.poll(() => sockets.size).toBe(0)
  const checked = connections
  // Retry asks the same address again; the connection check still fails before pnpm starts.
  await dialog.getByRole('button', { name: '重试', exact: true }).click()
  await expect.poll(() => connections).toBeGreaterThan(checked)
  await dialog.getByText(hostSentence, { exact: true }).waitFor()
  expect(await readFile(join(profile, '.attempts'), 'utf8')).toBe('')
  expect(await readFile(manifestPath, 'utf8')).toBe(manifestBefore)
  expect(tripwire.pageErrors).toEqual([])
})
