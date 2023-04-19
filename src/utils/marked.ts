import { marked } from "marked";

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

    let out = `<img οnclick="showMarkedImage(event, '${href}')" src="./writings/${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += ">";
    return out;
  },
  link(href: string, title: string, text: string) {
    if (href === null) {
      return text;
    }
    let out = `<a href="'./writings/${href}'"`;
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
