import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../', import.meta.url))
const cli = require.resolve('@dcloudio/vite-plugin-uni/bin/uni.js')
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: root,
  env: { ...process.env, UNI_INPUT_DIR: root },
  stdio: 'inherit'
})
child.on('exit', code => process.exit(code ?? 1))
