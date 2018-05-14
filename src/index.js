import RingCentral from 'ringcentral-js-concise'
import PubNub from 'ringcentral-js-concise/src/pubnub'
import dotenv from 'dotenv'

dotenv.config()

const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)

rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

console.log(rc.token())

const pubnub = new PubNub(rc, ['/restapi/v1.0/glip/posts'], message => {
  console.log(message)
})
pubnub.subscribe()
