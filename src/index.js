import RingCentral from 'ringcentral-js-concise'
import PubNub from 'ringcentral-js-concise/src/pubnub'
import dotenv from 'dotenv'
import * as R from 'ramda'

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
    console.log(message)
    const mentionAnyRegex = /!\[:(?:Person|Team)\]\(\d+\)/g
    const pureMessage = R.trim(R.replace(mentionAnyRegex, '', message.body.text))
    console.log(pureMessage)
    try {
      let reply = 'from the bot'
      if (groupMessage) {
        reply = `![:Person](${message.body.creatorId}) ` + reply
      }
      await rc.post(`/restapi/v1.0/glip/groups/${groupId}/posts`, {
        text: reply
      })
    } catch (e) {
      console.log(e.response.data)
    }
  })
  await pubnub.subscribe()
})()
