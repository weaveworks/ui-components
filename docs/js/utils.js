import marked from 'marked';
import { highlightAuto } from 'highlight.js';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code) {
    return highlightAuto(code).value;
  }
});

export function renderMarkdown(string) {
  return { __html: marked(string) };
}
