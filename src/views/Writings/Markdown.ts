import { Ref, h, render } from 'vue';
import { Router } from 'vue-router';
import { IPosition } from '@/typings';
import { NImage } from 'naive-ui';
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

export const setLinks = (
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
