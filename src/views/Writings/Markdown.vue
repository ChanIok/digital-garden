<template>
  <div id="markdown" ref="markdown">
    <div v-html="content" class="markdown-content vp-doc"></div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, reactive, } from 'vue';
import { getMarkedContent } from '@/utils/marked';
import { computed } from '@vue/reactivity';
import { NBackTop, NAnchor, NAnchorLink, NEllipsis, } from 'naive-ui';
import { useWritingStore } from '@/store';
import { setAnchors, setLinks, setImgs } from './Markdown';
import { useRouter } from 'vue-router';

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

watch(
  () => content.value,
  async () => {
    await nextTick();
    try {
      setAnchors(anchors, markdown);
      setLinks(markdown, router);
      setImgs(markdown);
    } catch (error) {
      console.log(error);
    }
  }
);
</script>

<style lang="less" scoped>
@import url('@/styles/md.less');

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
      max-width: 100%;
      cursor: zoom-in;
    }

    overflow: hidden;

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

  #preview-wrapper {
    position: absolute;
  }
}</style>
