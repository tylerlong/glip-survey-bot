import RingCentral from 'ringcentral-js-concise'
import dotenv from 'dotenv'

dotenv.config()

const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)

rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

console.log(rc.token())
