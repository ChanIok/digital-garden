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

    let out = `<img path="${href}" alt="${text}"`;
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
