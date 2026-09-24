// tests/architecture.test.ts
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url))

function forbiddenDependencies(source: string) {
  const legacy = ['lib/', 'pages/', 'components/common/']
  if (source.startsWith('features/')) return [...legacy, 'app/']
  if (source.startsWith('components/ui/') || source.startsWith('utils/')) {
    return [...legacy, 'app/', 'features/', 'services/', 'config/']
  }
  if (source.startsWith('services/') || source.startsWith('config/')) {
    return [...legacy, 'app/', 'features/', 'components/']
  }
  return legacy
}

test('features, generic UI and infrastructure respect dependency boundaries', () => {
  const violations: string[] = []
  for (const entry of readdirSync(sourceRoot, { recursive: true })) {
    if (!/\.tsx?$/.test(entry)) continue
    const source = entry.split(sep).join('/')
    const file = resolve(sourceRoot, entry)
    const { importedFiles } = ts.preProcessFile(readFileSync(file, 'utf8'), true, true)
    for (const { fileName: specifier } of importedFiles) {
      let target: string
      if (specifier.startsWith('@/')) {
        target = resolve(sourceRoot, specifier.slice(2))
      } else if (specifier.startsWith('.')) {
        target = resolve(dirname(file), specifier)
      } else {
        continue
      }
      const dependency = relative(sourceRoot, target).split(sep).join('/')
      if (forbiddenDependencies(source).some(prefix => dependency.startsWith(prefix))) {
        violations.push(`${source} -> ${dependency}`)
      }
    }
  }
  assert.deepEqual(violations, [], violations.join('\n'))
})
