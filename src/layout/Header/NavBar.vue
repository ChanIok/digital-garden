<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="(item, index) in writingStore.currentWritingPathArray" :key="index"
      @click="goToPath(item, index)">
      {{ item }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem } from "naive-ui";
import { useWritingStore } from "@/store";

const writingStore = useWritingStore()

const goToPath = (pathName: string, clickIndex: number) => {
  if (clickIndex == writingStore.currentWritingPathArray.length - 1) {
    return
  }
  const pathArray = writingStore.currentWritingPathArray
  const index = pathArray.indexOf(pathName);
  if (index != -1) {
    const temp = pathArray.slice(0, index + 1)
    temp.push('index.md')
    writingStore.setCurrentWritingPath(`/${temp.join("/")}`)
  }
}

</script>

<style lang="less" module></style>
