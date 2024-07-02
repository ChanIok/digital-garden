<template>
  <transition name="loading-mask">
    <div id="loading-mask" v-show="isShow" ref="loadingMask">
      <div class="container" ref="container">
        <div class="loading-bar-background"></div>
        <div class="loading-bar-prospect" ref="progressBar"></div>
      </div>
      <transition name="fade">
        <div class="loading-tips" v-if="showTip">
          {{ tipTexts[tipState] }}
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { loadingbarImg } from '@/assets/loadingbarImg';
  import { useStore } from '@/store';
  import { computed, watch, onMounted, ref, onUnmounted } from 'vue';

  enum TipState {
    Initial,
    SlowNetwork,
    SwitchProxy,
    LoadError,
  }
  const tipTexts: Record<TipState, string> = {
    [TipState.Initial]: '',
    [TipState.SlowNetwork]: '嗯哼♪ 你的网络似乎有点慢',
    [TipState.SwitchProxy]: '或者切换下代理？',
    [TipState.LoadError]: '哎呀，你的网络无法前往区块链的大门',
  };
  const store = useStore();
  const isShow = ref(true);
  const tips = ref('');
  const tipsOpacity = ref(0);
  const container = ref<HTMLElement | null>(null);
  const progressBar = ref<HTMLElement | null>(null);
  const background = computed(() => `url(${loadingbarImg}) no-repeat`);
  const tipState = ref<TipState>(TipState.Initial);
  const showTip = ref(false);

  let animationFrame: number | null = null;

  const updateAnimation = (targetProgress: number, duration: number) => {
    const startTime = performance.now();
    const startWidth = progressBar.value ? progressBar.value.offsetWidth : 0;
    const containerWidth = container.value ? container.value.offsetWidth : 400;
    const targetWidth = (targetProgress / 100) * containerWidth;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const currentWidth = (startWidth + (targetWidth - startWidth) * easeProgress).toFixed();
      if (progressBar.value) {
        progressBar.value.style.width = `${currentWidth}px`;
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(animate);
  };

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const setTips = async () => {
    await delay(3000);
    if (store.loadingProgress <= 1) {
      tipState.value = TipState.SlowNetwork;
      showTip.value = true;
      await delay(3000);
      if (!store.isLoadError) {
        showTip.value = false;
        await delay(1000);
        tipsOpacity.value = 1;
        tipState.value = TipState.SwitchProxy;
        showTip.value = true;
      }
    }
  };

  const start = () => {
    updateAnimation(80, 6000);
    setTips();
  };

  const finish = () => {
    updateAnimation(100, 200);
    setTimeout(() => {
      isShow.value = false;
    }, 300);
  };

  watch(
    () => store.loadingProgress,
    (val) => {
      if (val >= 1) {
        finish();
      }
    }
  );

  watch(
    () => store.isLoadError,
    async (val) => {
      if (val) {
        showTip.value = false;
        await delay(1000);
        tipState.value = TipState.LoadError;
        showTip.value = true;
      }
    }
  );

  onMounted(() => {
    const image = new Image();
    image.src = loadingbarImg;
    image.onload = start;
  });

  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<style lang="less" scoped>
  .loading-mask-enter-active,
  .loading-mask-leave-active {
    transition: opacity 0.5s;
  }

  .loading-mask-enter-from,
  .loading-mask-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  #loading-mask {
    height: 100%;
    width: 100%;
    z-index: 998;
    overflow: hidden;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    background: var(--theme-loading-mask-bg);

    .loading-tips {
      font-size: 16px;
      color: var(--theme-text);
      position: absolute;
      top: calc(50% + 50px);
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      transition: opacity 1s;
    }

    .container {
      overflow: hidden;
      min-width: 400px;
      height: 50px;

      @media only screen and (max-width: 540px) {
        transform: scale(0.85);
      }

      @media only screen and (max-width: 420px) {
        transform: scale(0.7);
      }

      .loading-bar-background {
        height: 50px;
        width: 400px;
        background: v-bind(background);
        background-size: 400px 50px;
        transform: translateY(100%);
        filter: drop-shadow(0 -50px 0 var(--theme-loadingbar-background-color));
      }

      .loading-bar-prospect {
        height: 50px;
        width: 0;
        background: v-bind(background);
        background-size: 400px 50px;
        filter: drop-shadow(0 -50px 0 var(--theme-loadingbar-prospect-color));
        // transition: width 0.1s linear;
      }
    }
  }
</style>
