import RingCentral from 'ringcentral-js-concise'
import PubNub from 'ringcentral-js-concise/src/pubnub'
import dotenv from 'dotenv'

dotenv.config()
const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)
rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

;(async () => {
  const r = await rc.get('/restapi/v1.0/glip/persons/~')
  const botId = r.data.id

  const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts'], async message => {
    if (message.body.creatorId === botId) {
      return // ignore messages from itself.
    }
    console.log(message)
    try {
      await rc.post(`/restapi/v1.0/glip/groups/${message.body.groupId}/posts`, { text: 'reply from bot' })
    } catch (e) {
      console.log(e.response.data)
    }
  })
  await pubnub.subscribe()
})()
