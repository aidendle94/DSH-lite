/** Typed English and Chinese copy owned by the Electron shell. */

export const en = {
  cliCommandMenu: 'Manage dsh Command…',
  cliCommandTitle: 'Manage dsh Command',
  cliCommandLocation: 'Desktop command: {path}',
  cliCommandSelected: 'Current dsh command: {path}',
  cliCommandTarget: 'Current launcher target: {path}',
  cliCommandShadowed: 'Another dsh takes precedence. Remove or reorder that installation to use the Desktop command by default. You can also run the Desktop command by its full path.',
  cliCommandSelectionUnknown: 'Your shell command could not be verified. An alias or another dsh installation may take precedence.',
  cliCommandInstalled: 'The Desktop command is installed.',
  cliCommandNotInstalled: 'Add the Desktop command to your terminal.',
  cliCommandBroken: 'The Desktop command needs repair.',
  cliCommandInstall: 'Install',
  cliCommandRepair: 'Repair',
  cliCommandRemove: 'Remove',
  cliCommandClose: 'Close',
  cliCommandSwitch: 'Continue with the Desktop command?',
  cliCommandPreserve: 'An existing command will be preserved. Other installations and shell startup files will not be changed.',
  cliCommandContinue: 'Continue',
  cliCommandInstallApp: 'Install Desktop in your Applications folder before managing the dsh command.',
  cliCommandNewTerminal: 'Open a new terminal and run dsh --version.',
  cliCommandRemoved: 'Desktop command registration removed.',
  cliCommandPreviousRestored: 'The previous launcher has been restored.',
  cliCommandOtherKept: 'Other command installations have been left in place.',
  cliCommandBackupKept: 'A previous launcher is preserved at: {path}',
  cliCommandChanged: 'The command or PATH changed while this dialog was open. Open Manage dsh Command again to review the current state.',
  cliCommandOwnershipError: 'The command registration or backup changed. No unrelated command was removed.',
  cliCommandFailed: 'The command could not be updated. Check that the application is installed and the destination is writable, then retry.',
  application: 'Application',
  fileMenu: 'File',
  closePage: 'Close Page or Window',
  aboutMenu: 'About DeepSeek Harness',
  aboutProduct: 'DeepSeek Harness',
  aboutVersion: 'Version V{version}',
  hideApplication: 'Hide DeepSeek Harness',
  hideOtherApplications: 'Hide Others',
  showAllApplications: 'Show All',
  quitApplication: 'Quit DeepSeek Harness',
  openApplication: 'Open DeepSeek Harness',
  quit: 'Quit',
  cancel: 'Cancel',
  quitTitle: 'Quit DeepSeek Harness?',
  quitActiveTasks: 'Running tasks will be interrupted.',
  quitScheduledTasks: 'Scheduled tasks will not run while the app is closed.',
  quitActiveAndScheduledTasks: 'Running tasks will be interrupted, and scheduled tasks will not run while the app is closed.',
  backgroundNoticeBody: 'Running tasks will continue. You can reopen the window from the system tray.',
  backgroundNoticeConfirm: 'Confirm',
  edit: 'Edit',
  menuBar: 'Application menu',
  delete: 'Delete',
  undo: 'Undo',
  redo: 'Redo',
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  selectAll: 'Select All',
  startupFailed: 'DeepSeek Harness is unavailable',
  fatalSummary: 'The application could not start or stopped unexpectedly.',
  startupAddressInUse: 'Another DSH instance (such as dsh web or the desktop app) is running. They cannot start at the same time. Quit the other running DSH instance, then restart.',
  diagnosticTruncated: '… Error details shortened.',
  reportWrittenTo: 'Diagnostic report: {path}',
  startupReinstallAdvice: 'If application files are missing or damaged, close the application and reinstall it. Your tasks are stored separately.',
  exitApplication: 'Exit',
  restartApplication: 'Restart',
  recoveryOperationFailed: 'The recovery operation failed',
  disableThirdPartyPlugins: 'Disable third-party plugins, back up profile patch, and restart',
  reloadPageMenu: 'Reload Page',
  restartAppHostMenu: 'Restart App and Host',
  dialogClose: 'Close',
  dialogAcknowledge: 'OK',
  dialogTechnicalDetails: 'View technical details',
} as const

/** Every Desktop locale supplies the complete English key set. */
export type DesktopMessages = { readonly [Key in keyof typeof en]: string }

export const zh = {
  cliCommandMenu: '管理 dsh 命令…',
  cliCommandTitle: '管理 dsh 命令',
  cliCommandLocation: 'Desktop 命令：{path}',
  cliCommandSelected: '当前 dsh 命令：{path}',
  cliCommandTarget: '当前启动器目标：{path}',
  cliCommandShadowed: '另一个 dsh 的优先级更高。请移除或调整该安装的顺序，以默认使用 Desktop 命令；也可以通过完整路径运行 Desktop 命令。',
  cliCommandSelectionUnknown: '无法确认 shell 中的命令。别名或另一个 dsh 安装可能具有更高优先级。',
  cliCommandInstalled: 'Desktop 命令已安装。',
  cliCommandNotInstalled: '将 Desktop 命令添加到终端。',
  cliCommandBroken: 'Desktop 命令需要修复。',
  cliCommandInstall: '安装',
  cliCommandRepair: '修复',
  cliCommandRemove: '移除',
  cliCommandClose: '关闭',
  cliCommandSwitch: '继续使用 Desktop 命令？',
  cliCommandPreserve: '现有命令会被保留，不会修改其他安装或 shell 启动文件。',
  cliCommandContinue: '继续',
  cliCommandInstallApp: '请先将 Desktop 安装到“应用程序”文件夹，再管理 dsh 命令。',
  cliCommandNewTerminal: '打开新终端并运行 dsh --version。',
  cliCommandRemoved: '已移除 Desktop 命令注册。',
  cliCommandPreviousRestored: '已恢复之前的启动器。',
  cliCommandOtherKept: '其他命令安装保持不变。',
  cliCommandBackupKept: '之前的启动器保留在：{path}',
  cliCommandChanged: '对话框打开期间命令或 PATH 已改变。请重新打开“管理 dsh 命令”检查当前状态。',
  cliCommandOwnershipError: '命令注册或备份已改变，未移除无关命令。',
  cliCommandFailed: '无法更新命令。请检查应用是否已安装、目标位置是否可写，然后重试。',
  application: '应用',
  fileMenu: '文件',
  closePage: '关闭页面或窗口',
  aboutMenu: '关于 DeepSeek Harness',
  aboutProduct: 'DeepSeek Harness',
  aboutVersion: '版本 V{version}',
  hideApplication: '隐藏 DeepSeek Harness',
  hideOtherApplications: '隐藏其他',
  showAllApplications: '显示全部',
  quitApplication: '退出 DeepSeek Harness',
  openApplication: '打开 DeepSeek Harness',
  quit: '退出',
  cancel: '取消',
  quitTitle: '退出 DeepSeek Harness？',
  quitActiveTasks: '当前正在运行的任务将会中断',
  quitScheduledTasks: '应用关闭期间，定时任务不会运行',
  quitActiveAndScheduledTasks: '当前正在运行的任务将会中断，且应用关闭期间，定时任务不会运行',
  backgroundNoticeBody: '正在运行的任务不会中断，可在系统托盘中重新打开窗口',
  backgroundNoticeConfirm: '确认',
  edit: '编辑',
  menuBar: '应用菜单',
  delete: '删除',
  undo: '撤销',
  redo: '重做',
  cut: '剪切',
  copy: '复制',
  paste: '粘贴',
  selectAll: '全选',
  startupFailed: 'DeepSeek Harness 无法使用',
  fatalSummary: '应用无法启动或已意外停止。',
  startupAddressInUse: '有其他正在运行的 DSH（如其他 dsh web、桌面端），无法同时启动，请退出其他正在运行的 DSH 后重启。',
  diagnosticTruncated: '… 错误详情已截短。',
  reportWrittenTo: '诊断报告：{path}',
  startupReinstallAdvice: '如果应用文件缺失或损坏，请关闭应用并重新安装。任务数据存储在独立位置。',
  exitApplication: '退出',
  restartApplication: '重启',
  recoveryOperationFailed: '恢复操作失败',
  disableThirdPartyPlugins: '禁用第三方插件、备份 profile patch 并重启',
  reloadPageMenu: '刷新页面',
  restartAppHostMenu: '重启应用与 Host',
  dialogClose: '关闭',
  dialogAcknowledge: '确定',
  dialogTechnicalDetails: '查看技术详情',
} as const satisfies DesktopMessages

/** Locale payload exposed to the Desktop-owned renderer. */
export interface DesktopLocale {
  readonly id: 'en' | 'zh-CN'
  readonly messages: DesktopMessages
}

/** Resolve Electron's locale to one shipped Desktop dictionary. */
export function resolveDesktopLocale(locale: string): DesktopLocale {
  return locale.toLowerCase().startsWith('zh')
    ? { id: 'zh-CN', messages: zh }
    : { id: 'en', messages: en }
}

/**
 * Choose a built-in dictionary from the shared preference, then ordered OS languages.
 * @param preference - explicit locale.preference, or null when no language was selected.
 * @param languages - operating-system languages in preference order.
 * @returns the supported dictionary, falling back to English.
 */
export function resolveDesktopStartupLocale(preference: string | null, languages: readonly string[]): DesktopLocale {
  const selected = preference?.toLowerCase()
  if (selected === 'zh' || selected === 'en') return resolveDesktopLocale(selected)
  for (const language of languages) {
    const primary = language.toLowerCase().split('-')[0]
    if (primary === 'zh' || primary === 'en') return resolveDesktopLocale(primary)
  }
  return resolveDesktopLocale('en')
}

/** Replace named placeholders in one locale-owned message. */
export function formatDesktopMessage(
  message: string,
  values: Readonly<Record<string, string>>,
): string {
  return message.replaceAll(/\{([^{}]+)\}/gu, (placeholder, key: string) => values[key] ?? placeholder)
}
