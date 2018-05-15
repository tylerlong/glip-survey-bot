import * as R from 'ramda'
import fs from 'fs'
import path from 'path'

import { parse } from './parser'

const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')

class Handler {
  constructor () {
    this.flow = parse(markdown)
  }

  forward () {
    this.flow = R.tail(this.flow)
    if (this.flow.length === 0) {
      console.log('done')
    }
  }

  currentElement () {
    if (this.flow.length === 0) {
      return undefined
    }
    return this.flow[0][0]
  }

  currentContent () {
    if (this.flow.length === 0) {
      return undefined
    }
    return this.flow[0][2]
  }

  proceed () {
    const result = []
    while (R.contains(this.currentElement(), ['p', 'h2', 'h1'])) {
      let content = this.currentContent()
      if (this.currentElement() === 'h1') {
        content = `**${content}**`
      }
      if (this.currentElement() === 'h2') {
        content = `**Q: ${content}**`
      }
      result.push(content)
      this.forward()
    }
    if (R.contains(this.currentElement(), ['ul', 'ol'])) {
      this.options = R.pipe(
        R.tail,
        R.tail,
        R.map(o => o[2])
      )(this.flow[0])
      result.push(R.addIndex(R.map)((o, idx) => `${idx + 1}. ${o}`, this.options).join('\n'))
      this.forward()
    }
    return result
  }

  handle (text) {
    if (text === 'help') {
      return `I am a survey bot. Please reply **start** to start / restart the survey.`
    }
    if (text === 'start') {
      this.flow = parse(markdown)
      return this.proceed()
    }
    if (this.options && R.test(/\d+/, text)) {
      if (parseInt(text) > this.options.length) { // out of index
        return `Please select 1 - ${this.options.length}, ${text} is out of range.`
      }
      const result = [`You selected ${text}. ${this.options[parseInt(text) - 1]}`]
      this.options = undefined
      return R.concat(result, this.proceed())
    }
    return `I couldn't understand you. Please type “help” to get more information on how I can help.`
  }
}

const handlers = {}
const getHandler = userId => {
  if (handlers[userId] === undefined) {
    handlers[userId] = new Handler()
  }
  return handlers[userId]
}

export const handle = (text, creatorId) => {
  text = R.toLower(text)
  return getHandler(creatorId).handle(text)
}
