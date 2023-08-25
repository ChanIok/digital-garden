<template>
  <div id="home">
    <Universe />
    <Background />
    <Welcome />
  </div>
</template>

<script setup lang="ts">
  import Universe from '@/views/Home/Universe.vue';

  import Background from '@/views/Home/Background.vue';
  import Welcome from '@/views/Home/Welcome.vue';
</script>

<style lang="less" scoped>
  #home {
    width: 100%;
    height: 100%;
  }
</style>
