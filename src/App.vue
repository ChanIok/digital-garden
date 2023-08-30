<template>
  <n-config-provider
    id="n-config-provider"
    :theme="store.isDark ? darkTheme : lightTheme"
    :class="{ dark: store.isDark }"
  >
    <!-- <n-global-style /> -->
    <NMessageProvider>
      <router-view></router-view>
    </NMessageProvider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { darkTheme, lightTheme, NConfigProvider, NGlobalStyle, NMessageProvider } from 'naive-ui';

  import { init } from '@/utils/init';
  import { useStore, useWritingStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { nextTick, watch } from 'vue';
  const store = useStore();
  const route = useRoute();
  const writingStore = useWritingStore();

  init();

  watch(
    () => route.fullPath,
    async (val) => {
      let title = '一心净土 - 无念无想，四海归寂';
      if (val.startsWith('/writings')) {
        await nextTick()
        const pathArray = writingStore.currentWritingPathArray;
        console.log(pathArray)
        if (val == '/writings/index.md') {
          title = '数字花园 | 一心净土';
        } else if (
          pathArray[pathArray.length - 1].length >= 2 &&
          pathArray[pathArray.length - 1] === 'index.md'
        ) {
          title = pathArray[pathArray.length - 2].replace(/\.md$/, '');
          title += ' | 数字花园';
        } else {
          title = pathArray[pathArray.length - 1].replace(/\.md$/, '');
          title += ' | 数字花园';
        }
      } else if (val.startsWith('/comments')) {
        title = '留言板 | 一心净土';
      } else if (val.startsWith('/status')) {
        title = '区块状态 | 一心净土';
      }
      document.title = title;
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  #n-config-provider {
    width: 100%;
    height: 100%;
  }
</style>
