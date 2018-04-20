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
  },
});

export function renderMarkdown(string) {
  return { __html: marked(string) };
}

export function isActivePage(item) {
  // If hosted on s3, we use hash instead of browser history
  const path =
    window.location.hostname === 'localhost'
      ? window.location.pathname
      : window.location.hash;

  const [, p, page] = path.split('/');

  return item.toLowerCase() === p || item.toLowerCase() === page;
}
