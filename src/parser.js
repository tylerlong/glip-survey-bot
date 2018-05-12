import MarkdownIt from 'markdown-it'
import onml from 'onml'

const mi = MarkdownIt()

export const parse = markdown => {
  const html = mi.render(markdown)
  return onml.p(`<root>${html}</root>`)
}
