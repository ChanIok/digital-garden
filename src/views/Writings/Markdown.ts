import { Ref, h, render } from 'vue';
import { Router } from 'vue-router';
import { NImage, NPopover } from 'naive-ui';
import Preview from './Preview.vue';
import { loadWriting } from './Writings';
import { getMarkedContent } from '@/utils/marked';
export const setAnchors = (anchors: any, markdown: any) => {
  const elements = markdown.value.querySelectorAll('h1,h2,h3,h4,h5,h6');
  const tree: any = [{ node: elements[0], children: [] }];
  const nodeLi = [tree[0]];

  for (let i = 1; i < elements.length; i++) {
    const t = { node: elements[i], children: [] };
    nodeLi.some((node, j) => {
      if (parseInt(elements[i].tagName.charAt(1)) > parseInt(node.node.tagName.charAt(1))) {
        nodeLi.splice(j + 1, 0, t);
        node.children.push(t);
        return true;
      }
    }) || tree.push(t);
  }
  anchors.value = tree;
};

export const setImgs = (markdown: Ref<HTMLElement>) => {
  const images = Array.from(markdown.value.querySelectorAll<HTMLImageElement>('img'));

  for (const image of images) {
    const nImageInstance = h(NImage, { src: image.src });
    let imgElement = document.createElement('div');
    render(nImageInstance, imgElement);
    image.replaceWith(imgElement);
  }
};

export const setLinks = async (markdown: Ref<HTMLElement>, router: Router) => {
  const elements = Array.from(markdown.value.querySelectorAll<HTMLAnchorElement>('a'));
  for (const link of elements) {
    const path = link.getAttribute('path');
    if (!path) {
      continue;
    }

    link.onclick = () => {
      router.push(path);
    };
    if (path.endsWith('index.md')) {
      continue;
    }

    const writingText = await loadWriting(true, path);
    const popverInstance = h(
      NPopover,
      { trigger: 'hover', scrollable: true, style: 'max-height: 420px;max-width: 720px' },
      {
        default: () => h(Preview, { content: getMarkedContent(writingText) }),
        trigger: () => h('a', link.innerHTML),
      }
    );
    let linkElement = document.createElement('div');
    render(popverInstance, linkElement);
    link.replaceWith(linkElement);
    linkElement.onclick = () => {
      router.push(path);
      console.log(path);
    };
  }
};
