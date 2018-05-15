import * as R from 'ramda'
import fs from 'fs'
import path from 'path'

import { parse } from './parser'

const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')
const flow = parse(markdown)

const steps = {}

export const handle = (text, creatorId) => {
  text = R.toLower(text)
  switch (text) {
    case 'help':
      return `I am a survey bot. The current survey topic is **${flow[0][2]}**. Please reply **start** to start / restart the survey.`
    case 'start':
      steps[creatorId] = 1
      return nextSteps(creatorId)
    default:
      return `I couldn't understand you. Please type “help” to get more information on how I can help.`
  }
}

const nextSteps = creatorId => {
  const result = []
  let currentStep = steps[creatorId]
  while (flow[currentStep][0] === 'p') {
    result.push(flow[currentStep][2])
    currentStep += 1
  }

  if (flow[currentStep][0] === 'h2') {
    result.push(`**Q: ${flow[currentStep][2]}**`)
    currentStep += 1
    while (flow[currentStep][0] === 'p') {
      result.push(flow[currentStep][2])
      currentStep += 1
    }
    if (flow[currentStep][0] === 'ul') {
      const options = R.pipe(
        R.tail,
        R.tail,
        R.map(li => li[2]),
        R.addIndex(R.map)((o, idx) => `${idx}. ${o}`)
      )(flow[currentStep]).join('\n')
      result.push(options)
      currentStep += 1
    }
  }

  steps[creatorId] = currentStep
  return result
}
