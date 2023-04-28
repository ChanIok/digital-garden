import { useRouter } from "vue-router";

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

export const setLinks = (markdown: any) => {
  const router = useRouter();
  const elements = markdown.value.querySelectorAll("a");
  for (let i = 0; i < elements.length; i++) {
    elements[i].onclick = () => {
      const path = elements[i].getAttribute("path");
      router.push(path);
    };
  }
};
