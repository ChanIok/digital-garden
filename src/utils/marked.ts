import { appEnv } from '@/config';
import { useStore } from '@/store';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import shell from 'highlight.js/lib/languages/shell';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';

const languages = [
  { name: 'javascript', lang: javascript },
  { name: 'typescript', lang: typescript },
  { name: 'plaintext', lang: plaintext },
  { name: 'python', lang: python },
  { name: 'shell', lang: shell },
  { name: 'json', lang: json },
  { name: 'css', lang: css },
  { name: 'markdown', lang: markdown },
];

languages.forEach((language) => {
  hljs.registerLanguage(language.name, language.lang);
});

const render = new marked.Renderer();
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
});
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

const renderer = {
  image(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }
    href = decodeURIComponent(href);
    const store = useStore();
    const url = appEnv.VITE_USE_LOCAL_WRITINGS
      ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${href}`
      : `${store.gateway}/${store.manifest?.paths[href!]?.id}`;

    let out = `<img src="${url}" path="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += '>';
    return out;
  },
  link(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }
    if (href.startsWith('http')) {
      let out = `<a href="${href}" path="${href}" target="_blank"`;
      if (title) {
        out += ' title="' + title + '"';
      }
      out += '>' + text + '</a>';
      return out;
    }
    let out = `<a path="${href}"`;
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  },
};

marked.use({ renderer });

export const getMarkedContent = (value: string) => {
  return marked(value);
};
