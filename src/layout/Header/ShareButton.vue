<template>
  <div id="share-button" v-if="isButtonVisible">
    <n-button size="small" quaternary @click="onClickShare">
      <template #icon>
        <n-icon>
          <ShareSocialOutline />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useWritingStore, useStore } from '@/store';
  import { ShareSocialOutline } from '@vicons/ionicons5';
  import { useMessage, NButton, NIcon } from 'naive-ui';
  import { useClipboard } from '@vueuse/core';
  const { copy, isSupported } = useClipboard({ legacy: true });

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

    if (!manifest?.paths[currentWritingPath]) {
      return;
    }

    const link = manifest.paths[currentWritingPath].id.substring(0, 6);
    let currentURL = window.location.protocol + '//' + window.location.hostname;
    if (window.location.port) {
      currentURL += ':' + window.location.port;
    }
    currentURL += '/#/' + link;
    return currentURL;
  });

  const onClickShare = () => {
    if (!isSupported.value || !sharingLink.value) {
      message.error('复制失败');
      return;
    }
    copy(sharingLink.value);
    message.success(`已复制链接到剪贴板：${sharingLink.value}`);
  };
</script>

<style lang="less" scoped></style>
