<template>
  <div id="markdown" ref="markdown">
    <n-scrollbar>
      <div
        v-html="content"
        v-viewer="{
          movable: false,
          toolbar: false,
          navbar: false,
          title: false,
        }"
        class="markdown-content"
      ></div>
      <n-back-top :right="50" />
    </n-scrollbar>
    <div class="markdown-outline">
      <n-anchor
        affix
        :trigger-top="80"
        :bound="80"
        ignore-gap
        offset-target="#markdown"
        @click="onClickAnchor"
      >
        <n-ellipsis style="max-width: 240px">
          <n-anchor-link
            v-for="item in anchors"
            :title="item.node.innerText"
            :href="`#${item.node.id}`"
          >
            <n-anchor-link
              v-for="itemChild in item.children"
              :title="itemChild.node.innerText"
              :href="`#${itemChild.node.id}`"
            />
          </n-anchor-link>
        </n-ellipsis>
      </n-anchor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { getMarkedContent } from "@/utils/marked";
import { computed } from "@vue/reactivity";

import {
  NScrollbar,
  NBackTop,
  NAnchor,
  NAnchorLink,
  NEllipsis,
} from "naive-ui";
import { useStore } from "@/store";
const store = useStore();
const currentWritingText = store.currentWritingText;

const onClickAnchor = (e: PointerEvent) => {
  e.preventDefault();
};
const content = computed(() => {
  return getMarkedContent(currentWritingText);
});
const anchors = ref<any>([]);
const markdown = ref<any>(null);

const setAnchors = () => {
  const elements = markdown.value.querySelectorAll("h1,h2,h3,h4,h5,h6");
  const tree: any[] = [];
  tree.push({
    node: elements[0],
    children: [],
  });
  const nodeLi: any[] = [];
  nodeLi.push(tree[0]);
  for (let i = 1; i < elements.length; i++) {
    let flag = false;
    const t = {
      node: elements[i],
      children: [],
    };
    nodeLi.push(t);
    for (let j = i - 1; j >= 0; j--) {
      if (
        parseInt(elements[i].tagName.charAt(1)) >
        parseInt(elements[j].tagName.charAt(1))
      ) {
        nodeLi[j].children.push(t);

        flag = true;
        break;
      }
    }
    if (!flag) {
      tree.push(t);
    }
  }
  anchors.value = tree;
};

watch(
  () => content.value,
  async () => {
    await nextTick();
    try {
      setAnchors();
    } catch (error) {
      console.log(error);
    }
  }
);
</script>

<style lang="less" scoped>
#markdown {
  height: 100%;
  width: 100%;

  display: flex;
  .markdown-content {
    padding: 30px 40px 0 40px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    @media only screen and (max-width: 960px) {
      padding: 10px 10px 0 10px;
    }
  }
  .markdown-outline {
    width: 300px;
    @media only screen and (max-width: 1260px) {
      display: none;
    }
  }
}
</style>
<style lang="less">
#markdown {
  .markdown-content {
    img {
      display: block;
      width: 100%;
      max-width: 720px;
      cursor: zoom-in;
    }
    margin-bottom: 30px;
  }
}
</style>
