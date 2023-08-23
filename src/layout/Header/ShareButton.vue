<template>
  <div id="share-button" v-if="isButtonVisible">
    <n-button size="small" quaternary class="copyBtn" :data-clipboard-text="sharingLink" @click="onClickShare">
      <template #icon>
        <n-icon>
          <ShareSocialOutline />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWritingStore, useStore } from "@/store";
import { ShareSocialOutline } from "@vicons/ionicons5";
import { useMessage, NButton, NIcon } from "naive-ui";
import { appEnv } from "@/config";
const store = useStore();
const writingStore = useWritingStore();
const message = useMessage();

const isButtonVisible = computed(() => {
  const manifest = store.manifest;
  const currentWritingPath = writingStore.currentWritingPath;
  return manifest?.paths[currentWritingPath];
});

const sharingLink = computed(() => {
  const manifest = store.manifest;
  const currentWritingPath = writingStore.currentWritingPath;
  let link = "";
  if (!manifest?.paths[currentWritingPath]) {
    return;
  }
  link = manifest!.paths[currentWritingPath].id.substring(0, 6);
  if (appEnv.MODE == "development") {
    link = `http://localhost:5173/#/${link}`;
  } else {
    link = `http://chaniok.eth.limo/#/${link}`;
  }
  return link;
});

const onClickShare = () => {
  message.success(`已复制链接到剪贴板：${sharingLink.value}`);
};
</script>

<style lang="less" scoped></style>
