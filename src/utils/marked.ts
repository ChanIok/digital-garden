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


marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

const extension = {
  useNewRenderer: true,
  renderer: {
    image(token: any) {
      if (!token.href) {
        return token.text;
      }

      const href = decodeURIComponent(token.href);
      const store = useStore();
      const url = appEnv.VITE_USE_LOCAL_WRITINGS
        ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${href}`
        : `${store.gateway}/${store.manifest?.paths[href]?.id}`;

      let out = `<img src="${url}" path="${href}" alt="${token.text}"`;
      if (token.title) {
        out += ` title="${token.title}"`;
      }
      out += '>';
      return out;
    },
    link(token: any) {
      if (!token.href) {
        return token.text;
      }

      if (token.href.startsWith('http')) {
        let out = `<a href="${token.href}" path="${token.href}" target="_blank"`;
        if (token.title) {
          out += ` title="${token.title}"`;
        }
        out += `>${token.text}</a>`;
        return out;
      }

      let out = `<a path="${token.href}"`;
      if (token.title) {
        out += ` title="${token.title}"`;
      }
      out += `>${token.text}</a>`;
      return out;
    },
  },
};

marked.use(extension);

export const getMarkedContent = (value: string) => {
  return marked(value);
};
