<template>
  <div id="markdown" ref="markdown">
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

    <div class="markdown-outline">
      <n-anchor
        v-if="anchors.length > 0 && anchors[0].node"
        affix
        :trigger-top="80"
        :bound="80"
        ignore-gap
        offset-target="#writings"
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
import { useWritingStore } from "@/store";
import { useRouter } from "vue-router";
const writingStore = useWritingStore();
const router = useRouter();
const onClickAnchor = (e: PointerEvent) => {
  e.preventDefault();
};
const content = computed(() => {
  return getMarkedContent(writingStore.currentWritingText);
});
const anchors = ref<any>([]);
const markdown = ref<any>(null);

const setAnchors = () => {
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

const setLinks = () => {
  const elements = markdown.value.querySelectorAll("a");
  for (let i = 0; i < elements.length; i++) {
    elements[i].onclick = () => {
      const path = elements[i].getAttribute("path");
      router.push(path);
    };
  }
};

watch(
  () => content.value,
  async () => {
    await nextTick();
    try {
      setAnchors();
      setLinks();
    } catch (error) {
      console.log(error);
    }
  }
);
</script>

<style lang="less" scoped>
@import url("@/styles/md.less");
#markdown {
  display: flex;
  justify-content: center;

  .markdown-content {
    padding: 30px 40px 0 40px;
    box-sizing: border-box;
    flex: 1;

    max-width: 880px;
    margin-bottom: 30px;

    :deep(img) {
      display: block;
      // width: 100%;
      max-width: 720px;
      cursor: zoom-in;
    }
    @media only screen and (max-width: 960px) {
      padding: 10px 10px 0 10px;
    }
  }

  .markdown-outline {
    width: 300px;
    position: fixed;
    left: calc(50% + 440px);
    @media only screen and (max-width: 1260px) {
      display: none;
    }
  }
}
</style>
