<template>
  <div id="header">
    <NavBar></NavBar>
    <Options></Options>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/layout/Header/NavBar.vue";
import Options from "@/layout/Header/Options.vue";
import { ref } from "vue";
const a = ref(0);
</script>

<style lang="less">
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
