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
  import { nextTick, onMounted, watch } from 'vue';
  import Markdown from '@/views/Writings/Markdown.vue';
  import { NScrollbar } from 'naive-ui';
  import { useStore, useWritingStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { checkPath, loadWriting } from '@/views/Writings/Writings.js';

  const writingStore = useWritingStore();
  const store = useStore();
  const route = useRoute();

  onMounted(async () => {
    await checkPath();
    loadWriting();
  });

  watch(
    () => writingStore.currentWritingPath,
    () => loadWriting()
  );

  watch(
    () => store.manifest,
    () => loadWriting()
  );

  watch(
    () => route.fullPath,
    async (val) => {
      if (val.startsWith('/writings') && val != '/writings') {
        writingStore.setCurrentWritingPath(decodeURIComponent(val.slice(10)));
      } else if (val == '/') {
        await nextTick();
        writingStore.$reset();
      }
    },
    { immediate: true }
  );
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
