import * as R from 'ramda'
import fs from 'fs'
import path from 'path'
import glob from 'glob-promise'
import json2csv from 'json2csv'

import { parse } from './parser'

const json2csvParser = new json2csv.Parser()

const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')

class Handler {
  constructor (userId, rc) {
    this.userId = userId
    this.rc = rc
    this.flow = parse(markdown)
  }

  forward () {
    this.flow = R.tail(this.flow)
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

  save (selection) {
    const filePath = path.join(__dirname, '..', 'result', `${this.userId}.json`)
    let data = {}
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    data[this.question] = selection
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  }

  async report () {
    const jsons = []
    const files = await glob(path.join(__dirname, '..', 'result', '*.json'))
    for (const file of files) {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
      const userId = path.basename(file, path.extname(file))
      json.userId = userId
      const r = await this.rc.get(`/restapi/v1.0/glip/persons/${userId}`)
      json.name = `${r.data.firstName} ${r.data.lastName}`
      json.email = r.data.email
      jsons.push(json)
    }
    return {
      name: 'survey-report.csv',
      content: json2csvParser.parse(jsons)
    }
  }

  proceed () {
    const result = []
    while (R.contains(this.currentElement(), ['p', 'h2', 'h1'])) {
      let content = this.currentContent()
      if (this.currentElement() === 'h1') {
        content = `**${content}**`
      }
      if (this.currentElement() === 'h2') {
        this.question = content
        content = `**${content}**`
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

  async handle (text) {
    if (text === 'help') {
      return `I am a survey bot. Please reply **start** to start / restart the survey. Reply **download** to download the survey report`
    }
    if (text === 'start') {
      this.flow = parse(markdown)
      return this.proceed()
    }
    if (text === 'download') {
      return this.report()
    }
    if (this.options && R.test(/\d+/, text)) {
      if (parseInt(text) > this.options.length) { // out of index
        return `Please select 1 - ${this.options.length}, ${text} is out of range.`
      }
      const selection = this.options[parseInt(text) - 1]
      const result = [`You selected ${text}. ${selection}`]
      this.save(selection)
      this.question = undefined
      this.options = undefined
      return R.concat(result, this.proceed())
    }
    return `I couldn't understand you. Please type “help” to get more information on how I can help.`
  }
}

const handlers = {}
const getHandler = (userId, rc) => {
  if (handlers[userId] === undefined) {
    handlers[userId] = new Handler(userId, rc)
  }
  return handlers[userId]
}

export const handle = (text, creatorId, rc) => {
  text = R.toLower(text)
  return getHandler(creatorId, rc).handle(text)
}
