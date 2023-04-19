<template>
  <div id="writings">
    <div class="writings-container">
      <div class="content">
        <Markdown />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from "vue";
import axios from "axios";
import { useStore } from "@/store";
import Markdown from "@/views/Writings/Markdown.vue";

import { getFullPath, getWritingsList } from "@/utils/artools";
import { useRoute } from "vue-router";
import { getWritingLocally } from "@/utils/dev";

const route = useRoute();
const store = useStore();
const manifest = store.manifest;

const isListloadCompleted = ref<boolean>(false);
const writingList = ref<any>([]);
const writingListKey = ref<string>("about");

const loadWriting = async () => {
  const txIdTemp = route.params.txId;
  if (route.params.txId == undefined || route.params.txId == "") {
    return;
  }
  const path = await getFullPath(txIdTemp as string);
  if (path == "") {
    return;
  }
  writingListKey.value = path;
  store.setLoadingBarAction("start");

  if (process.env.NODE_ENV === "development") {
    const text = await getWritingLocally(manifest!.paths[path].id);
    store.setCurrentWritingText(text);
  } else {
    const text = (
      await axios.get(`https://arweave.net/${manifest!.paths[path].id}`)
    ).data;
    store.setCurrentWritingText(text);
  }

  await nextTick();
  store.setLoadingBarAction("finish");
};
watch(
  () => route.params.txId,
  () => {
    loadWriting();
  }
);

onMounted(async () => {
  store.setLoadingBarAction("start");
  try {
    writingList.value = await getWritingsList();
    isListloadCompleted.value = true;
    loadWriting();
  } catch (error) {
    console.log(error);
  }
  store.setLoadingBarAction("finish");
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
      height: 100%;
      flex: 1;
      overflow: auto;
      @media only screen and (max-width: 960px) {
        padding: 10px 10px 0 10px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
