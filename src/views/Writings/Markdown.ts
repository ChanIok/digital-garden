import { Ref, h, render } from 'vue';
import { Router } from 'vue-router';
import { NImage, NPopover, NConfigProvider, darkTheme } from 'naive-ui';
import Preview from './Preview.vue';
import { loadWriting } from './Writings';
import { getMarkedContent } from '@/utils/marked';
import { useStore } from '@/store';
import { appEnv } from '@/config';

export const setAnchors = (anchors: any, markdown: any) => {
  const content=markdown.value.querySelector('.markdown-content');
  const elements =content.querySelectorAll('h1,h2,h3,h4,h5,h6');
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
  const store = useStore();
  for (const image of images) {
    const path = image.getAttribute('path');
    const url = appEnv.VITE_USE_LOCAL_WRITINGS
      ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${path}`
      : `https://arweave.net/${store.manifest?.paths[path!]?.id}`;
    const nImageInstance = h(NImage, { src: url });
    let imgElement = document.createElement('div');
    render(nImageInstance, imgElement);
    image.replaceWith(imgElement);
  }
};

const createPopover = (writingText: string, link: HTMLAnchorElement) => {
  const maxWidth = Math.min(window.innerWidth - link.offsetLeft - 20, 720);
  const nPStyle = `max-height: 420px;max-width: ${maxWidth}px`;
  return h(
    NPopover,
    window.innerWidth < 480
      ? {
          trigger: 'hover',
          scrollable: true,
          style: nPStyle,
          class: 'pv-doc',
          show: false,
        }
      : {
          trigger: 'hover',
          scrollable: true,
          style: nPStyle,
          class: 'pv-doc',
        },
    {
      default: () => h(Preview, { content: getMarkedContent(writingText) }),
      trigger: () =>
        h(
          'a',
          {
            class: 'internal-link',
            onclick: () => {
              const previewElement = document.querySelector('.pv-doc');
              (previewElement as any).style.display = 'none';
            },
          },
          link.innerHTML
        ),
    }
  );
};

export const setLinks = async (markdown: Ref<HTMLElement>, router: Router) => {
  const store = useStore();
  const elements = Array.from(markdown.value.querySelectorAll<HTMLAnchorElement>('a'));

  const promises = elements.map(async (link) => {
    const path = link.getAttribute('path');

    if (!path || path?.startsWith('http')) {
      return;
    }
    link.onclick = () => {
      router.push(`/writings/${path}`);
    };
    if (path.endsWith('index.md')) {
      return;
    }

    const writingText = await loadWriting(true, path);
    const popverInstance = h(
      NConfigProvider,
      { theme: store.isDark ? darkTheme : undefined },
      { default: () => createPopover(writingText, link) }
    );

    let linkElement = document.createElement('div');
    render(popverInstance, linkElement);
    link.replaceWith(linkElement);
    linkElement.onclick = () => {
      router.push(`/writings/${path}`);
    };
  });

  await Promise.all(promises);
};
