<script setup lang="ts">
import { useLoadingBar } from "naive-ui";
import { watch } from "vue";
import { useLoadingBarStore } from "@/store";
const loadingBar = useLoadingBar();
const store = useLoadingBarStore();

store.$subscribe((mutation, state) => {
  const action = state.loadingBarAction
  if (action == "start") {
    loadingBar.start();
  } else if (action == "finish") {
    loadingBar.finish();
  } else if (action == "error") {
    loadingBar.error();
  }
})

</script>

<template></template>

<style lang="less" scoped></style>
