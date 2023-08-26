<template>
  <div id="header">
    <NLoadingBarProvider>
      <LoadingBar></LoadingBar>
    </NLoadingBarProvider>
    <NavBar></NavBar>
    <Options></Options>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/layout/Header/NavBar.vue";
import Options from "@/layout/Header/Options.vue";
import LoadingBar from "@/layout/Header/LoadingBar.vue";
import { NLoadingBarProvider } from "naive-ui";
</script>

<style lang="less">
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  height: 40px;
}
</style>
