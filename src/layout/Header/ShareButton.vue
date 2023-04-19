<template>
  <div id="share-button">
    <n-button
      size="small"
      quaternary
      class="btn"
      :data-clipboard-text="sharingLink"
      @click="onClickShare"
    >
      <template #icon>
        <n-icon><ShareSocialOutline /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ShareSocialOutline } from "@vicons/ionicons5";
import { useMessage, NButton,NIcon } from "naive-ui";
const route = useRoute();
const message = useMessage();
const sharingLink = computed(() => {
  let link = "";
  link = route.path.replace("/writings/", "").substring(0, 5);
  if (process.env.NODE_ENV === "development") {
    link = `http://localhost:5173/#/${link}`;
  } else {
    link = `http://chaniok.eth.limo/#/${link}`;
  }
  return link;
});

const onClickShare = () => {
  message.success(`已复制链接到剪贴板：${sharingLink.value}`);
};
</script>

<style lang="less" scoped></style>
