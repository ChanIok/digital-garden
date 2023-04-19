<template>
  <div id="main">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const a = ref(0);
</script>

<style lang="less" scoped>
#main {
  width: 100%;
  height: 100%;
}
</style>
