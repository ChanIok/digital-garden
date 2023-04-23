<template>
  <n-config-provider
    id="n-config-provider"
    :theme="isDark ? darkTheme : lightTheme"
  >
    <n-global-style />
    <NMessageProvider>
      <router-view></router-view>
    </NMessageProvider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
} from "naive-ui";

import { init } from "@/utils/init";

import { useDark } from "@vueuse/core";
const isDark = useDark();

init();
</script>

<style lang="less" scoped>
#n-config-provider {
  width: 100%;
  height: 100%;
}
</style>
