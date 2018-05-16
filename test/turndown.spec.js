/* eslint-env jest */
import Turndown from 'turndown'
import onml from 'onml'

const turndown = new Turndown({ headingStyle: 'atx' })

describe('demo', () => {
  test('turndown', () => {
    console.log(turndown.turndown('<h1>hello <strong>test</strong> world</h1>'))
    console.log(turndown.turndown('<p>hello <strong>test</strong> world</p>'))
  })

  test('turndown & onml', () => {
    const p = [
      'p',
      {},
      'You have done the survey! Thank you very much for your input! Reply ',
      [
        'strong',
        {},
        'download'
      ],
      ' if you want to see the survey report.'
    ]
    const html = onml.s(p)
    console.log(html)
    console.log(turndown.turndown(html))
  })
})
