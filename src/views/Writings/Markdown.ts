import { Ref, h, render } from 'vue';
import { Router } from 'vue-router';
import { NImage, NPopover, NConfigProvider, darkTheme } from 'naive-ui';
import Preview from './Preview.vue';
import { loadWriting } from './Writings';
import { getMarkedContent } from '@/utils/marked';
import { useStore } from '@/store';
import { appEnv } from '@/config';
import { UseClipboardReturn } from '@vueuse/core';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

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

export const setCopyButton = (
  markdown: Ref<HTMLElement>,
  clipboard: UseClipboardReturn<false>,
  message: MessageApiInjection
) => {
  const elements = Array.from(markdown.value.querySelectorAll<HTMLImageElement>('pre>code'));
  elements.forEach((item) => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/>
    </svg>
  `;
    item.appendChild(button);
    button.onclick = () => {
      const text = item.textContent || '';
      clipboard.copy(text);

      if (!clipboard.isSupported.value || !text) {
        message.error('写入剪贴板失败');
        return;
      }
      message.success('已写入剪贴板');
    };
  });
};

/**
 * 创建Markdown内容预览的弹出框组件
 * @param writingText - 预览内容的文本
 * @param link - 触发弹出框的链接元素
 * @returns 弹出框组件
 */
const createPopover = (writingText: string, link: HTMLAnchorElement) => {
  const maxWidth = Math.min(window.innerWidth - link.offsetLeft - 20, 720);
  const nPopoverStyle = `max-height: 420px; max-width: ${maxWidth}px;`;

  return h(
    NPopover,
    {
      trigger: 'hover',
      scrollable: true,
      style: nPopoverStyle,
      class: 'pv-doc',
      show: window.innerWidth < 480 ? false : undefined,
    },
    {
      default: () => h(Preview, { content: getMarkedContent(writingText) }),
      trigger: () => h('span', { class: 'internal-link' }, link.innerHTML),
    }
  );
};

/**
 * 设置 Markdown 内容中的链接
 * @param markdown - 包含 Markdown 内容的 Ref 对象
 * @param router - Vue 路由实例
 */
export const setLinks = async (markdown: Ref<HTMLElement>, router: Router) => {
  const store = useStore();
  const elements = Array.from(markdown.value.querySelectorAll<HTMLAnchorElement>('a'));

  // 处理所有链接元素
  const promises = elements.map(async (link) => {
    const path = link.getAttribute('path');

    if (!path || path?.startsWith('http')) {
      return;
    }

    // 设置 a 标签的 href 属性
    link.setAttribute('href', `#/writings/${path}`);

    // 如果路径以 'index.md' 结尾且不在 store 的 manifest 路径中，直接返回
    if (path.endsWith('index.md') && !(path in store.manifest!.paths)) {
      return;
    }

    const writingText = (await loadWriting(true, path)) as string;
    const popverInstance = h(
      NConfigProvider,
      { theme: store.isDark ? darkTheme : undefined },
      { default: () => createPopover(writingText, link) }
    );
    // 创建一个新的 a 元素来替换原始的链接
    let linkElement = document.createElement('a');
    render(popverInstance, linkElement);
    link.replaceWith(linkElement);
    // 设置点击事件以导航并滚动到顶部
    linkElement.setAttribute('href', `#/writings/${path}`);
    linkElement.onclick = () => {
      document.querySelector('.writings-container .n-scrollbar-container')!.scrollTop = 0;
      document.querySelector('.pv-doc')?.setAttribute('style', 'display: none;');
    };
  });

  await Promise.all(promises);
};
