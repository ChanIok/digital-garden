import { Ref, h, render } from 'vue';
import { Router } from 'vue-router';
import { NImage, NPopover, NConfigProvider, darkTheme } from 'naive-ui';
import Preview from './Preview.vue';
import { loadWriting } from './Writings';
import { getMarkedContent } from '@/utils/marked';
import { useStore } from '@/store';
import { appEnv } from '@/config';

export const setAnchors = (anchors: any, markdown: any) => {
  const content = markdown.value.querySelector('.markdown-content');
  const headers = Array.from(content.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  // 创建一个虚拟的根节点
  let root = { node: null, children: [] };
  // 定义递归函数
  function createTree(headers: HTMLElement[], parent: Record<string, any>) {
    while (headers.length > 0) {
      let current = headers[0];
      let anchor = {
        node: current,
        children: [],
      };
      parent.children.push(anchor);
      // 检查下一个元素的级别
      if (headers[1] && headers[1].tagName > current.tagName) {
        // 下一个元素的级别更高，所以将其作为子节点
        headers.shift();
        createTree(headers, anchor);
      } else if (!headers[1] || headers[1].tagName == current.tagName) {
        // 下一个元素的级别相同，所以将其作为兄弟节点
        headers.shift();
      } else {
        // 下一个元素的级别更低，跳出
        headers.shift();
        return;
      }
    }
  }
  createTree(headers as HTMLElement[], root);
  anchors.value = root.children;
};

export const setImgs = (markdown: Ref<HTMLElement>) => {
  const images = Array.from(markdown.value.querySelectorAll<HTMLImageElement>('img'));
  const store = useStore();
  for (const image of images) {
    const path = image.getAttribute('path');
    const url = appEnv.VITE_USE_LOCAL_WRITINGS
      ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${path}`
      : `${store.gateway}/${store.manifest?.paths[path!]?.id}`;
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
    if (path.endsWith('index.md') && !(path in store.manifest!.paths)) {
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
