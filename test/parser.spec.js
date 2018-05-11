/* eslint-env jest */
import fs from 'fs'
import path from 'path'

import { parse } from '../src/parser'

describe('parser', () => {
  test('parse', () => {
    const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')
    const result = parse(markdown)
    console.log(result)
  })
})
