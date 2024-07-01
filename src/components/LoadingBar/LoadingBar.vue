<script setup lang="ts">
  import { useLoadingBar } from 'naive-ui';
  import { useGlobalLoadingBar } from './LoadingBar';
  const loadingBar = useLoadingBar();
  const globalLoadingBar = useGlobalLoadingBar();
  globalLoadingBar.setLoadingBar(loadingBar);
</script>
<template></template>

<style lang="less" scoped></style>
