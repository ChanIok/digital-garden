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
      {{ item.replace(/%20/g, " ") }}
    </n-breadcrumb-item>

  </n-breadcrumb>
</template>

<script setup lang="ts">
import { NBreadcrumb, NBreadcrumbItem, NDropdown } from "naive-ui";
import { useWritingStore } from "@/store";
import { useRouter } from "vue-router";
import { nextTick, onMounted, ref } from "vue";
const router = useRouter();
const writingStore = useWritingStore();

const visibleList = ref<any>([]);
const hiddenList = ref<any>([]);

const loadBreadcrumbData = async () => {
  visibleList.value = writingStore.currentWritingPathArray.slice()
  hiddenList.value = []
  await nextTick()
  const navBarUl = document.querySelector('#nav-bar>ul');
  while ((navBarUl as any).offsetWidth > window.innerWidth - 100) {
    const item = visibleList.value.shift()
    hiddenList.value.push({
      label: item,
      key: item
    });
    await nextTick()
  }
}
onMounted(async () => {
  loadBreadcrumbData();
})

writingStore.$subscribe((mutation, state) => {
  if ((mutation.events as any).key == "currentWritingPath") {
    loadBreadcrumbData();
  }
});

const goToPath = (pathName: string, clickIndex: number) => {
  if (clickIndex == writingStore.currentWritingPathArray.length - 1) {
    return;
  }
  console.log(pathName)
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
  console.log(key, pathArray)
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

  :deep(>ul) {
    display: flex;
  }

  .trigger {
    padding: 4px;
    margin: -4px;
    border-radius: inherit;
  }
}
</style>
