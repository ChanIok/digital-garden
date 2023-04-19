<template>
  <div id="background">
    <div
      class="background-img"
      :class="{
        'light-theme': !isDark,
      }"
      :style="{ backgroundImage: 'url(' + backgroundImg + ')' }"
    ></div>
    <div class="background-mask"></div>
  </div>
</template>

<script setup lang="ts">
import { Liyue } from "@/assets";
import { Venti } from "@/assets";
// import { isDark } from "@/store";
import { computed, ref } from "vue";

const isDark = ref(false);

const backgroundImg = computed(() => {
  if (isDark.value) {
    return Liyue;
  } else {
    return Venti;
  }
});
</script>

<style lang="less" scoped>
#background {
  width: 100%;
  height: 100%;
  position: fixed;
  .background-img {
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: 50% 50%;
    @media only screen and (max-width: 480px) {
      background-position: 25% 50%;
    }
    transition: all 1s;
  }
  .light-theme {
    background-position: 85% 50%;
  }
  .background-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
