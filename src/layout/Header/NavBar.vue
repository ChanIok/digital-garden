<template>
  <n-breadcrumb id="nav-bar" ref="nav-bar">
    <n-breadcrumb-item>
      <router-link to="/">首页</router-link>
    </n-breadcrumb-item>

    <n-breadcrumb-item v-if="hiddenList.length">
      <n-dropdown :options="hiddenList" @select="handleSelect">
        <div class="trigger"> ... </div>
      </n-dropdown>
    </n-breadcrumb-item>

    <n-breadcrumb-item v-for="(item, index) in visibleList" :key="index" @click="goToPath(item, index)">
      <n-ellipsis style="max-width: 100%">
        {{ item.label }}
      </n-ellipsis>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem, NDropdown, NEllipsis } from 'naive-ui';
import { useWritingStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { loadWritingData } from './NavBar';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const router = useRouter();
const route = useRoute();
const writingStore = useWritingStore();
const visibleList = ref<any>([]);
const hiddenList = ref<any>([]);
const isLoadingBreadcrumb = ref<boolean>(false);

const loadBreadcrumbData = async () => {
  if (route.fullPath == '/') {
    visibleList.value = [];
    hiddenList.value = [];
  } else if (route.fullPath.startsWith('/comments')) {
    visibleList.value = [{ label: '留言板', key: 'comments' }];
  } else if (route.fullPath.startsWith('/status')) {
    visibleList.value = [{ label: '区块状态', key: 'status' }];
  } else if (route.fullPath.startsWith('/writings')) {
    await loadWritingData(visibleList, hiddenList);
  }
};

onMounted(async () => {
  await loadBreadcrumbData();
});

watch(
  () => route.fullPath,
  async (val) => {
    loadBreadcrumbData();
  }
);
watch(
  () => width.value,
  async (val) => {
    if (isLoadingBreadcrumb.value) {
      return;
    }
    isLoadingBreadcrumb.value = true;
    loadBreadcrumbData();
    setTimeout(() => {
      isLoadingBreadcrumb.value = false;
    }, 100);
  }
);

const goToPath = (item: any, clickIndex: number) => {
  if (clickIndex == writingStore.currentWritingPathArray.length) {
    return;
  } else if (item.key == '/') {
    router.push('/writings/index.md');
    return;
  }
  const pathArray = writingStore.currentWritingPathArray;
  const index = pathArray.indexOf(item.key);
  if (index != -1) {
    const temp = pathArray.slice(0, index + 1);
    temp.push('index.md');
    router.push(`/writings/${temp.join('/')}`);
  }
};
const handleSelect = (key: string) => {
  if (key == '/') {
    router.push('/writings/index.md');
    return;
  }
  const pathArray = writingStore.currentWritingPathArray;
  const index = pathArray.indexOf(key);
  if (index != -1) {
    const temp = pathArray.slice(0, index + 1);
    temp.push('index.md');
    router.push(`/writings/${temp.join('/')}`);
  }
};
</script>

<style lang="less" scoped>
#nav-bar {
  max-width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;

  :deep(> ul) {
    display: flex;
  }

  :deep(> ul > li:last-child) {
    min-width: 40px;
    flex-shrink: 1;
    overflow: hidden;
  }

  :deep(> ul > li:last-child > .n-breadcrumb-item__link) {
    flex-shrink: 1;
    overflow: hidden;
  }

  .trigger {
    padding: 4px;
    margin: -4px;
    border-radius: inherit;
  }
}
</style>
