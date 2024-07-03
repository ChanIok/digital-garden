<template>
  <div id="markdown" ref="markdown">
    <div class="markdown-container">
      <div class="markdown-header vp-doc">
        <h1 class="title">{{ title }}</h1>
        <n-p v-if="date" class="date">Date: {{ date }}</n-p>
        <n-a
          class="tx-id"
          :href="`https://viewblock.io/arweave/tx/${txId}`"
          target="_blank"
          v-if="txId"
        >
          Transaction: <span> {{ txId }}</span>
        </n-a>
      </div>
      <n-divider />
      <div class="skeleton" v-if="isSkeletonVisible">
        <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
      </div>
      <div v-html="content" class="markdown-content vp-doc"></div>
      <n-back-top :right="width < 480 ? 30 : 50" />
    </div>

    <div class="markdown-outline">
      <n-anchor
        v-if="anchors.length > 0 && anchors[0].node"
        affix
        :trigger-top="100"
        :bound="80"
        ignore-gap
        offset-target="#writings"
        @click="onClickAnchor"
        :show-background="false"
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
  import { ref, nextTick, watch } from 'vue';
  import { getMarkedContent } from '@/utils/marked';
  import { computed } from '@vue/reactivity';
  import {
    NBackTop,
    NAnchor,
    NAnchorLink,
    NEllipsis,
    NSkeleton,
    NP,
    NDivider,
    NA,
    useMessage,
  } from 'naive-ui';
  import { useStore, useWritingStore } from '@/store';
  import { setAnchors, setLinks, setImgs, setCopyButton } from './Markdown';
  import { useWindowSize } from '@vueuse/core';
  import dayjs from 'dayjs';
  import { useClipboard } from '@vueuse/core';

  const clipboard = useClipboard({ legacy: true });
  const message = useMessage();
  const isSkeletonVisible = ref<boolean>(true);
  const { width } = useWindowSize();
  const writingStore = useWritingStore();
  const store = useStore();

  const txId = computed(() => {
    return store.manifest?.paths[writingStore.currentWritingPath]?.id;
  });
  const date = computed(() => {
    const timestamp = store.manifest?.paths[writingStore.currentWritingPath]?.date;
    if (timestamp) {
      return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
  });
  const title = computed(() => {
    if (writingStore.currentWritingPathArray.length == 1) {
      return 'ChanIok 的数字花园';
    }
    if (
      writingStore.currentWritingPathArray[writingStore.currentWritingPathArray.length - 1] ==
      'index.md'
    ) {
      return writingStore.currentWritingPathArray[writingStore.currentWritingPathArray.length - 2];
    }
    return writingStore.currentWritingPathArray[
      writingStore.currentWritingPathArray.length - 1
    ].replace(/\.md$/, '');
  });

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
    async (val) => {
      if (val == '') {
          isSkeletonVisible.value = true;
      } else {
        isSkeletonVisible.value = false;
      }
      await nextTick();
      try {
        setAnchors(anchors, markdown);
        await setLinks(markdown);
        setImgs(markdown);
        setCopyButton(markdown, clipboard, message);
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

    .markdown-container {
      padding: 30px 40px 0 40px;
      box-sizing: border-box;
      flex: 1;
      width: 100%;
      max-width: 880px;
      margin-bottom: 30px;
      @media only screen and (max-width: 960px) {
        padding: 10px 20px 0 20px;
      }
      .markdown-header {
        .tx-id {
          font-size: 12px;
          text-decoration: none;
          border-bottom: 0;
          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .date {
          font-size: 12px;
          margin-bottom: 0;
        }
      }
      .markdown-content {
        :deep(img) {
          display: block;
          max-width: 100%;
          cursor: zoom-in;
        }
        :deep(a) {
          text-decoration: none;
        }
        overflow: hidden;
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
  }
</style>
