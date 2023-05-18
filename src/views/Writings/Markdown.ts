import { Ref } from "vue";
import { Router } from "vue-router";
import { IPosition } from "@/typings";
export const setAnchors = (anchors: any, markdown: any) => {
  const elements = markdown.value.querySelectorAll("h1,h2,h3,h4,h5,h6");
  const tree: any = [{ node: elements[0], children: [] }];
  const nodeLi = [tree[0]];

  for (let i = 1; i < elements.length; i++) {
    const t = { node: elements[i], children: [] };
    nodeLi.some((node, j) => {
      if (
        parseInt(elements[i].tagName.charAt(1)) >
        parseInt(node.node.tagName.charAt(1))
      ) {
        nodeLi.splice(j + 1, 0, t);
        node.children.push(t);
        return true;
      }
    }) || tree.push(t);
  }
  anchors.value = tree;
};

export const setLinks = (
  markdown: any,
  router: Router,
  previewLink: Ref<string>,
  isPreviewVisible: Ref<boolean>,
  previewPosition: IPosition,
  hidePreviewTimeout: Ref<number>
) => {
  const hide = () => {
    previewLink.value = "";
    isPreviewVisible.value = false;
  };
  const elements = markdown.value.querySelectorAll("a");
  for (let i = 0; i < elements.length; i++) {
    const path = elements[i].getAttribute("path");
    elements[i].onclick = () => {
      hide();
      router.push(path);
    };
    if (!path || path.endsWith("index.md")) {
      continue;
    }
    elements[i].onmouseover = () => {
      previewLink.value = path;
      isPreviewVisible.value = true;

      // previewPosition.top =
      // elements[i].getBoundingClientRect().top - 30 + elements[i].offsetHeight;
      previewPosition.top =
        elements[i].offsetTop +
        elements[i].offsetHeight -
        elements[i].getBoundingClientRect().top +
        window.scrollY;
      previewPosition.left = elements[i].offsetLeft;
    };
    elements[i].onmouseout = () => {
      (hidePreviewTimeout.value as any) = setTimeout(() => {
        hide();
      }, 10);
    };
  }
};
