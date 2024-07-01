<template>
  <div id="home">
    <Starfield />
    <Background />
    <Welcome />
  </div>
</template>

<script setup lang="ts">
  import Starfield from '@/views/Home/Starfield.vue';
  import Background from '@/views/Home/Background.vue';
  import Welcome from '@/views/Home/Welcome.vue';
</script>

<style lang="less" scoped>
  #home {
    width: 100%;
    height: 100%;
  }
</style>
