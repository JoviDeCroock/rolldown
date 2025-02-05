import { test } from 'vitest'
import type { TestConfig } from './src/types'
import { InputOptions, OutputOptions, rolldown } from 'rolldown'
import nodePath from 'node:path'

main()

function main() {
  const testConfigPaths = import.meta.glob<TestConfig>(
    './fixtures/**/_config.ts',
    { import: 'default', eager: true },
  )
  for (const [testConfigPath, testConfig] of Object.entries(testConfigPaths)) {
    const dirPath = nodePath.dirname(testConfigPath)
    const testName = dirPath.replace('./fixtures/', '')

    test.skipIf(testConfig.skip)(testName, async () => {
      try {
        const output = await compileFixture(
          nodePath.join(import.meta.dirname, dirPath),
          testConfig,
        )
        if (testConfig.afterTest) {
          testConfig.afterTest(output)
        }
      } catch (err) {
        throw new Error(`Failed in ${testConfigPath}`, { cause: err })
      }
    })
  }
}

async function compileFixture(fixturePath: string, config: TestConfig) {
  let outputOptions: OutputOptions = config.config?.output ?? {}
  delete config.config?.output
  outputOptions = {
    dir: outputOptions.dir ?? nodePath.join(fixturePath, 'dist'),
    ...outputOptions,
  }

  const inputOptions: InputOptions = {
    input: config.config?.input ?? nodePath.join(fixturePath, 'main.js'),
    ...config.config,
  }
  const build = await rolldown(inputOptions)
  return await build.write(outputOptions)
}
