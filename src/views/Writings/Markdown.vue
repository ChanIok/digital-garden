<template>
  <div id="markdown" ref="markdown" class="vp-doc">
    <div v-html="content" v-viewer="{
        movable: false,
        toolbar: false,
        navbar: false,
        title: false,
      }" class="markdown-content"></div>
    <n-back-top :right="50" />

    <div class="markdown-outline">
      <n-anchor v-if="anchors.length > 0 && anchors[0].node" affix :trigger-top="100" :bound="80" ignore-gap
        offset-target="#writings" @click="onClickAnchor" :show-background="false">
        <n-ellipsis style="max-width: 240px">
          <n-anchor-link v-for="item in anchors" :title="item.node.innerText" :href="`#${item.node.id}`">
            <n-anchor-link v-for="itemChild in item.children" :title="itemChild.node.innerText"
              :href="`#${itemChild.node.id}`" />
          </n-anchor-link>
        </n-ellipsis>
      </n-anchor>
    </div>
    <div class="markdown-popover">

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { getMarkedContent } from "@/utils/marked";
import { computed } from "@vue/reactivity";
import { NBackTop, NAnchor, NAnchorLink, NEllipsis, NPopover, NButton } from "naive-ui";
import { useWritingStore } from "@/store";
import { setAnchors, setLinks } from "./Markdown";
const writingStore = useWritingStore();
const onClickAnchor = (e: PointerEvent) => {
  e.preventDefault();
};
const content = computed(() => {
  return getMarkedContent(writingStore.currentWritingText);
});
const anchors = ref<any>([]);
const markdown = ref<any>(null);



watch(
  () => content.value,
  async () => {
    await nextTick();
    try {
      setAnchors(anchors, markdown);
      setLinks(markdown);
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
