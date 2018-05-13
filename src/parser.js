import MarkdownIt from 'markdown-it'
import onml from 'onml'
import * as R from 'ramda'

const mi = MarkdownIt()

export const parse = markdown => {
  const html = mi.render(markdown)
  const jsonArray = onml.p(`<root>${html}</root>`)
  return R.tail(R.tail(jsonArray))
}
