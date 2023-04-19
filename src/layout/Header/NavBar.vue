<template>
  <n-breadcrumb>
    <n-breadcrumb-item> 北京总行</n-breadcrumb-item>
    <n-breadcrumb-item> 天津分行</n-breadcrumb-item>
    <n-breadcrumb-item> 平山道支行</n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NBreadcrumb, NBreadcrumbItem } from "naive-ui";
const a = ref(0);
</script>

<style lang="less" module></style>
