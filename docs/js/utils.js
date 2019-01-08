import marked from 'marked';
import { includes } from 'lodash';
import { highlightAuto } from 'highlight.js';

marked.setOptions({
  breaks: false,
  gfm: true,
  highlight(code) {
    return highlightAuto(code).value;
  },
  pedantic: false,
  renderer: new marked.Renderer(),
  sanitize: false,
  smartLists: true,
  smartypants: false,
  tables: true,
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

// require.context() returns multiple matches for each level of subdirectories,
// this filters just the js files, thus ignoring the folders themselves, and
// then removes the suffix
export const filterContextKeys = contextKeys =>
  contextKeys.filter(n => includes(n, '.js')).map(s => s.replace('.js', ''));
