<template>
  <div id="writings">
    <div class="writings-container">
      <div class="content">
        <n-scrollbar> <Markdown /></n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Markdown from "@/views/Writings/Markdown.vue";
import { NScrollbar } from "naive-ui";
import { useStore, useWritingStore } from "@/store";
import { checkPath, loadWriting } from "@/views/Writings/Writings.js";
const writingStore = useWritingStore();
const store = useStore();

onMounted(async () => {
  await checkPath();
});

writingStore.$subscribe((mutation, state) => {
  if ((mutation.events as any).key == "currentWritingPath") {
    loadWriting();
  }
});

store.$subscribe((mutation, state) => {
  if ((mutation.events as any).key == "manifest") {
    loadWriting();
  }
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

  .sidebar-wrapper {
    width: 250px;
    height: 100%;
    box-sizing: border-box;
    padding: 0px;
    border-right: 1px solid var(--theme-border);

    @media only screen and (max-width: 960px) {
      display: none;
    }
  }

  .local-nav-wrapper {
    display: none;
    z-index: 99;
    width: 100%;
    border-bottom: 1px solid var(--theme-border);
    box-sizing: border-box;
    flex: 0;

    @media only screen and (max-width: 960px) {
      display: block;
    }
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
    }
  }
}
</style>
