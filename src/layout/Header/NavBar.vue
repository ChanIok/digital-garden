<template>
  <n-breadcrumb id="nav-bar" ref="nav-bar">
    <n-breadcrumb-item>
      <router-link to="/">首页</router-link>
    </n-breadcrumb-item>

    <n-breadcrumb-item v-if="hiddenList.length">
      <n-dropdown :options="hiddenList" @select="handleSelect">
        <div class="trigger">
          ...
        </div>
      </n-dropdown>
    </n-breadcrumb-item>

    <n-breadcrumb-item v-for="(item, index) in visibleList" :key="index" @click="goToPath(item, index)">
      <n-ellipsis style="max-width: 100%">
        {{ item.replace(/%20/g, " ") }}
      </n-ellipsis>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem, NDropdown, NEllipsis } from "naive-ui";
import { useWritingStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import { nextTick, onMounted, ref, watch } from "vue";
import { loadWritingData } from "./NavBar";

const router = useRouter();
const route = useRoute();
const writingStore = useWritingStore();

const visibleList = ref<any>([]);
const hiddenList = ref<any>([]);

const loadBreadcrumbData = async () => {
  if (route.fullPath == "/") {
    visibleList.value = []
    hiddenList.value = []
  } else if (route.fullPath.startsWith("/writings")) {
    await loadWritingData(visibleList, hiddenList)
    console.log(visibleList.value)
  }
}

onMounted(async () => {
  await loadBreadcrumbData()
})

watch(
  () => route.fullPath,
  async (val) => {
    loadBreadcrumbData()
  }
);

const goToPath = (pathName: string, clickIndex: number) => {
  if (clickIndex == writingStore.currentWritingPathArray.length - 1) {
    return;
  }
  const pathArray = writingStore.currentWritingPathArray;
  const index = pathArray.indexOf(pathName);
  if (index != -1) {
    const temp = pathArray.slice(0, index + 1);
    temp.push("index.md");
    router.push(`/${temp.join("/")}`);
  }
};
const handleSelect = (key: string) => {
  const pathArray = writingStore.currentWritingPathArray;
  const index = pathArray.indexOf(key);
  if (index != -1) {
    const temp = pathArray.slice(0, index + 1);
    temp.push("index.md");
    router.push(`/${temp.join("/")}`);
  }
}

</script>

<style lang="less" scoped>
#nav-bar {
  max-width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;

  :deep(>ul) {
    display: flex;
  }

  :deep(>ul>li:last-child) {
    min-width: 80px;
    flex-shrink: 1;
    overflow: hidden;
  }

  :deep(>ul>li:last-child>.n-breadcrumb-item__link) {
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
