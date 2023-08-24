import { appEnv } from '@/config';
import { useStore } from '@/store';
import { marked } from 'marked';

const render = new marked.Renderer();
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
});

const renderer = {
  image(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }
    href = decodeURIComponent(href);
    const store = useStore();
    const url = appEnv.VITE_USE_LOCAL_WRITINGS
      ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${href}`
      : `https://arweave.net/${store.manifest?.paths[href!]?.id}`;

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
