import MarkdownIt from 'markdown-it'

const mi = MarkdownIt()

export const parse = markdown => {
  return mi.render(markdown)
}
