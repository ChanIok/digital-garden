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

    // 如果当前写作路径不存在于 manifest 中，则返回 null
    if (!manifest?.paths[currentWritingPath]) {
      return null;
    }
    // 获取链接的前 6 个字符作为分享 ID
    const shareId = manifest.paths[currentWritingPath].id.slice(0, 6);
    // 获取 worker 域名
    const getWorkerDomain = () => {
      const metaElement = document.querySelector('meta[name="x-worker-domain"]');
      return metaElement ? metaElement.getAttribute('content') : '';
    };
    // 构建基础 URL
    const buildBaseUrl = () => {
      const { protocol, hostname, port } = window.location;
      const workerDomain = getWorkerDomain();
      const domain = workerDomain || hostname;
      const portSuffix = port ? `:${port}` : '';
      return `${protocol}//${domain}${portSuffix}`;
    };
    // 构建完整的分享链接
    const buildShareLink = (baseUrl: string) => {
      const pathname = window.location.pathname;
      return pathname.length > 1 ? `${baseUrl}${pathname}#/${shareId}` : `${baseUrl}/#/${shareId}`;
    };

    return buildShareLink(buildBaseUrl());
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
