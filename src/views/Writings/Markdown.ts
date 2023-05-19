import { Ref, h, nextTick, ref, render } from 'vue';
import { Router } from 'vue-router';
import { IPosition } from '@/typings';
import { NImage, NPopover } from 'naive-ui';
import Preview from './Preview.vue';
import { useStore } from '@/store';
import { getSubPathsList } from './Writings';
import { appEnv } from '@/config';
import { getLocalWritingByPath } from '@/utils/dev';
import axios from 'axios';
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

export const setLinks = async (
  markdown: Ref<HTMLElement>,
  router: Router,
  previewLink: Ref<string>
) => {
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

    const writingText = ref<string>('');
    const loadWriting = async (currentWritingPath: string) => {
      const store = useStore();
      const manifest = store.manifest;
      if (!manifest) {
        return;
      }
      if (currentWritingPath.endsWith('/index.md')) {
        if (!(currentWritingPath in manifest.paths)) {
          writingText.value = getSubPathsList(
            manifest,
            currentWritingPath.slice(0, currentWritingPath.length - '/index.md'.length)
          );
          return;
        }
      }
      if (appEnv.VITE_USE_LOCAL_WRITINGS) {
        writingText.value = await getLocalWritingByPath(currentWritingPath);
      } else {
        writingText.value = (
          await axios.get(`https://arweave.net/${manifest!.paths[currentWritingPath].id}`)
        ).data;
      }
      await nextTick();
    };
    await loadWriting(path);
    const popverInstance = h(
      NPopover,
      { trigger: 'hover', scrollable: true, style: 'max-height: 420px;max-width: 720px' },
      {
        default: () => h(Preview, { content: getMarkedContent(writingText.value) }),
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

export const setLinksOld = (
  markdown: Ref<HTMLElement>,
  router: Router,
  previewLink: Ref<string>,
  isPreviewVisible: Ref<boolean>,
  previewPosition: IPosition,
  hidePreviewTimeout: Ref<number>
) => {
  const hide = () => {
    previewLink.value = '';
    isPreviewVisible.value = false;
  };
  const elements = Array.from(markdown.value.querySelectorAll<HTMLAnchorElement>('a'));
  const scrollbar = document.querySelector<HTMLElement>(
    '.writings-container .n-scrollbar-container'
  )!;

  for (const link of elements) {
    const path = link.getAttribute('path');
    if (!path) {
      continue;
    }
    link.onclick = () => {
      hide();
      router.push(path);
    };
    if (path.endsWith('index.md')) {
      continue;
    }
    link.onmouseenter = () => {
      previewLink.value = path;
      isPreviewVisible.value = true;
      previewPosition.height = 420;
      previewPosition.width = window.innerWidth < 420 ? 240 : 420;
      if (
        link.offsetTop + link.offsetHeight - scrollbar.scrollTop + previewPosition.height >
        window.innerHeight
      ) {
        previewPosition.top = link.offsetTop - scrollbar.scrollTop - previewPosition.height;
      } else {
        previewPosition.top = link.offsetTop + link.offsetHeight - scrollbar!.scrollTop;
      }
      if (link.offsetLeft < previewPosition.width / 2) {
        previewPosition.left = link.offsetLeft;
      } else {
        previewPosition.left = link.offsetLeft + link.offsetWidth - previewPosition.width / 2;
      }
    };

    link.onmouseleave = () => {
      (hidePreviewTimeout.value as any) = setTimeout(() => hide(), 10);
    };
  }
};
