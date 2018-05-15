/* eslint-env jest */
import RingCentral from 'ringcentral-js-concise'
import dotenv from 'dotenv'

dotenv.config()
const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)
rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

describe('demo', () => {
  test('subscription list', async () => {
    const r = await rc.get('/restapi/v1.0/subscription')
    console.log(r.data)
  })
})
