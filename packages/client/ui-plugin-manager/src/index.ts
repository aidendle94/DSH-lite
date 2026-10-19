/**
 * Plugin management surface, node half. The empty apply exists so the plugin
 * appears in the Host cordis.yml / Loader; the browser half owns the sidebar
 * Plugins page through exports["./client"], discovered from the package.json
 * dsh.client declaration. Installation goes through the `pluginManager`
 * Remote, so this package registers no Host service of its own.
 */

/** Host plugin body — no Host-side behavior for this surface plugin. */
export function apply(): void {}
