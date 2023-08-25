<template>
  <n-layout id="layout">
    <LoadingMask />
    <div id="layout-container">
      <n-layout-header>
        <Header></Header>
      </n-layout-header>
      <n-layout-content id="layout-content">
        <Main></Main>
      </n-layout-content>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
  import { NLayoutHeader, NLayoutContent, NLayout } from 'naive-ui';
  import Header from '@/layout/Header/Header.vue';
  import Main from '@/layout/Main/Main.vue';
  import LoadingMask from '@/layout/LoadingMask.vue';
</script>

<style lang="less" scoped>
  #layout {
    width: 100%;
    height: 100%;
    #layout-container {
      width: 100%;
      height: 100%;
      flex-direction: column;
      display: flex;
    }
  }
</style>
