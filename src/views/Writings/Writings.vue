<template>
  <div id="writings">
    <div class="writings-container">
      <div class="content">
        <n-scrollbar>
          <Markdown />
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, watch, onUnmounted } from 'vue';
  import Markdown from '@/views/Writings/Markdown.vue';
  import { NScrollbar } from 'naive-ui';
  import { useStore, useWritingStore } from '@/store';
  import { useRoute, useRouter } from 'vue-router';
  import { loadWriting } from '@/views/Writings/Writings.js';
  import { getFullPath } from '@/utils/artools';

  const writingStore = useWritingStore();
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const checkPath = async () => {
    const txId = route.params.txId;
    if (txId == undefined || txId == '') {
      return;
    }
    const path = await getFullPath(txId as string);
    if (path == '' || path == undefined) {
      return;
    }
    await nextTick();
    router.push(`/writings/${path}`);
  };

  watch(
    () => writingStore.currentWritingPath,
    () => loadWriting()
  );

  watch(
    () => store.manifest,
    async () => {
      await checkPath();
    }
  );

  watch(
    () => route.fullPath,
    async (val) => {
      if (val.startsWith('/writings')) {
        writingStore.setCurrentWritingPath(decodeURIComponent(val.slice(10)));
        writingStore.setCurrentWritingText('');
      }
    },
    { immediate: true }
  );
  
  onUnmounted(() => {
    writingStore.$reset();
  });
</script>

<style lang="less" scoped>
  #writings {
    width: 100%;
    display: flex;
    height: 100%;
    background-color: var(--theme-bg);
    transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
      background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;

    @media only screen and (max-width: 960px) {
      flex-direction: column;
    }

    .writings-container {
      display: flex;
      width: 100%;
      flex: 1;
      overflow: auto;

      .content {
        box-sizing: border-box;
        flex: 1;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        @media only screen and (max-width: 960px) {
          padding: 10px 10px 0 10px;
          flex-shrink: 0;
        }

        @media only screen and (max-width: 480px) {
          padding: 10px 0px 0 0px;
          flex-shrink: 0;
        }
      }
    }
  }
</style>
