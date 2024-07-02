<template>
  <div id="preview" ref="preview">
    <div v-html="content" class="content"></div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@/store';
  import { Ref, onMounted, ref } from 'vue';
  defineProps(['content']);
  const store = useStore();
  const preview = ref<HTMLElement | null>(null);

  const setLinks = (preview: Ref<HTMLElement | null>) => {
    if (!preview.value) {
      return;
    }
    const elements = Array.from(preview.value.querySelectorAll<HTMLAnchorElement>('a'));
    // 处理所有链接元素
    elements.forEach((link) => {
      const path = link.getAttribute('path');

      if (!path || path?.startsWith('http')) {
        return;
      }

      // 设置 a 标签的 href 属性
      link.setAttribute('href', `#/writings/${path}`);
      // 如果路径以 'index.md' 结尾且不在 store 的 manifest 路径中，直接返回
      if (path.endsWith('index.md') && !(path in store.manifest!.paths)) {
        return;
      }
      link.setAttribute('href', `#/writings/${path}`);
      link.onclick = async () => {
        preview.value?.setAttribute('style', 'display: none;');
      };
    });
  };
  onMounted(() => {
    setLinks(preview);
  });
</script>

<style lang="less" scoped></style>
