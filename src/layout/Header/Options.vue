<template>
  <div id="options">
    <div class="share-wrapper">
      <ShareButton></ShareButton>
    </div>
    <n-button size="small" quaternary @click="toggleTheme">
      <template #icon>
        <n-icon>
          <SunnyOutline v-if="!store.isDark" />
          <MoonSharp v-else />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NIcon } from 'naive-ui';
  import { SunnyOutline, MoonSharp } from '@vicons/ionicons5';
  import { useStore } from '@/store';
  import ShareButton from './ShareButton.vue';

  const store = useStore();

  const toggleTheme = () => {
    store.isDark = !store.isDark;
  };
</script>

<style lang="less">
  #options {
    display: flex;
    align-items: center;

    .share-wrapper {
      margin-right: 5px;
    }

    .n-button {
      padding: 0 5px;
    }
  }
</style>
