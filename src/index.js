import RingCentral from 'ringcentral-js-concise'
import PubNub from 'ringcentral-js-concise/src/pubnub'
import dotenv from 'dotenv'
import * as R from 'ramda'

import { handle } from './handler'

dotenv.config()
const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)
rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

;(async () => {
  const r = await rc.get('/restapi/v1.0/glip/persons/~')
  const botId = r.data.id
  const mentionBotRegex = new RegExp(`!\\[:Person\\]\\(${botId}\\)`)

  const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts'], async message => {
    if (message.body.creatorId === botId) {
      return // ignore messages from itself.
    }
    const groupId = message.body.groupId
    const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
    const groupMessage = r.data.members.length > 2
    if (groupMessage && !R.test(mentionBotRegex, message.body.text)) {
      return // It is a group message which doesn't mention the bot
    }
    const mentionAnyRegex = /!\[:(?:Person|Team)\]\(\d+\)/g
    const pureMessage = R.trim(R.replace(mentionAnyRegex, '', message.body.text))
    try {
      let reply = await handle(pureMessage, message.body.creatorId)
      if (Array.isArray(reply)) {
        reply = reply.join('\n\n')
      }
      if (reply.name) { // upload file
        await rc.post('/restapi/v1.0/glip/files', reply.content, {
          groupId,
          name: reply.name
        })
        return
      }
      if (groupMessage) {
        reply = `![:Person](${message.body.creatorId}) ` + reply + `\n\nIf you want to talk to me, please @ mention me (![:Person](${botId})) because this conversation has more than the two of us.`
      }
      await rc.post(`/restapi/v1.0/glip/groups/${groupId}/posts`, {
        text: reply
      })
    } catch (e) {
      console.error(e)
    }
  })
  await pubnub.subscribe()
})()
