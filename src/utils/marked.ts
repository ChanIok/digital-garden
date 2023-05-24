import { marked } from "marked";

const render = new marked.Renderer();
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
});

const renderer = {
  link(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }
    let out = `<a path="/writings/${href}"`;
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  },
};

marked.use({ renderer });

export const getMarkedContent = (value: string) => {
  return marked(value);
};
