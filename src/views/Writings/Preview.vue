<template>
  <div id="preview">
    <div v-html="content" class="content"></div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps(['content']);
</script>

<style lang="less" scoped></style>
