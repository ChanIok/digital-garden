<template>
  <div id="options">
    <div class="share-wrapper" v-if="isShareButtonShow">
      <ShareButton></ShareButton>
    </div>
    <n-switch v-model:value="store.isDark" size="medium" :rail-style="railStyle">
      <template #checked-icon>
        <n-icon :component="MoonSharp" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="SunnyOutline" />
      </template>
    </n-switch>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from "vue";
import { NIcon, NSwitch } from "naive-ui";
import { SunnyOutline, MoonSharp } from "@vicons/ionicons5";
import { useStore } from "@/store";
import ShareButton from "./ShareButton.vue";
const isShareButtonShow = true;

const store = useStore();

const railStyle = ({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#F1F1F1";
    if (focused) {
      style.boxShadow = "0 0 0 2px #F1F1F140";
    }
  } else {
    style.background = "#7E7E7E";
    if (focused) {
      style.boxShadow = "0 0 0 2px #7E7E7E40";
    }
  }
  return style;
};
</script>

<style lang="less">
#options {
  display: flex;
  align-items: center;

  .share-wrapper {
    margin-right: 5px;
  }
}
</style>
