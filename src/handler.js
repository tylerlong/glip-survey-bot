import * as R from 'ramda'
import fs from 'fs'
import path from 'path'

import { parse } from './parser'

const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')
const result = parse(markdown)

export const handle = (text, creatorId) => {
  text = R.toLower(text)
  switch (text) {
    case 'help':
      return `I am a survey bot. The current survey topic is **${result[0][2]}**. Please reply **start** to start the survey.`
    case 'start':
      return `Now the survey starts. Stay tuned!`
    default:
      return `I couldn't understand you. Please type “help” to get more information on how I can help.`
  }
}
