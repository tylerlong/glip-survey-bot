/* eslint-env jest */
import RingCentral from 'ringcentral-js-concise'
import dotenv from 'dotenv'
// import fs from 'fs'
// import path from 'path'

dotenv.config()
const rc = new RingCentral('', '', process.env.RINGCENTRAL_SERVER_URL)
rc.token(JSON.parse(process.env.RINGCENTRAL_TOKEN))

describe('demo', () => {
  test('upload file', async () => {
    // const content = fs.readFileSync(path.join(__dirname, '..', 'result', '230919004.json'))
    // try {
    //   const r = await rc.post('/restapi/v1.0/glip/files', content, {
    //     groupId: '151764994',
    //     name: 'test.json'
    //   })
    //   console.log(r.data)
    // } catch (e) {
    //   console.log(e)
    // }
  })
})
