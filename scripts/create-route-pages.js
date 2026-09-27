import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const source = resolve('dist/index.html')
const routes = [
  'download',
  'documentation',
  'en',
  'en/download',
  'en/documentation',
]

for (const route of routes) {
  const destination = resolve('dist', route, 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await copyFile(source, destination)
}

console.log(`Created static entry pages for ${routes.length} client routes.`)
