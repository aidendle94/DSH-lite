/** Shell chrome and General-nav dictionaries; feature rows own their copy. */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'trigger': '设置',
  'shortcut.open': '打开设置',
  'title': '设置',
  'close': '关闭',
  'openDocument': '打开配置文件',
  'openDocument.error': '无法打开配置文件',
  'general.nav': '通用设置',
  'general.currentVersion': '当前版本：{version}',
  'developerTools.title': '显示代码工作视图',
  'developerTools.error': '保存失败，请重试',
  'developerTools.description': '开启后，显示轨迹、本轮代码差异，可选择完整的 Agent 预设切换',
  'connection.error': '连接异常，刷新重试',
  'connection.connecting': '重新连接中',
  'connection.connected': '连接成功',
  'connection.reconnect': '连接异常，点击立即重连',
  'connection.restart': '连接中断，正在重试，点击立即重连',
  'hostRelease.title': '服务版本变化',
  'hostRelease.description': '服务版本已变化，本页面已暂停热更新，刷新后加载新版本。',
  'hostRelease.service': '服务',
  'hostRelease.page': '页面',
  'hostRelease.unknown': '未解析',
  'hostRelease.reload': '刷新以加载新版本',
  'hostRelease.later': '暂不刷新',
} satisfies Record<string, string>

/** The settings namespace key union. */
export type SettingsKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'trigger': 'Settings',
  'shortcut.open': 'Open settings',
  'title': 'Settings',
  'close': 'Close',
  'openDocument': 'Open configuration file',
  'openDocument.error': 'Could not open configuration file',
  'general.nav': 'General',
  'general.currentVersion': 'Current version: {version}',
  'developerTools.title': 'Show coding view',
  'developerTools.error': 'Could not save. Please try again.',
  'developerTools.description': 'Shows trajectory, code diffs, and all Agent presets',
  'connection.error': 'Disconnected',
  'connection.connecting': 'Reconnecting',
  'connection.connected': 'Connected',
  'connection.reconnect': 'Disconnected, reconnect now',
  'connection.restart': 'Reconnecting, reconnect now',
  'hostRelease.title': 'Service version changed',
  'hostRelease.description': 'The service version changed. This page paused live updates; reload to load the new version.',
  'hostRelease.service': 'Service',
  'hostRelease.page': 'Page',
  'hostRelease.unknown': 'Unknown',
  'hostRelease.reload': 'Reload to load the new version',
  'hostRelease.later': 'Not now',
} satisfies Record<SettingsKey, string>
