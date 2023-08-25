<template>
  <transition name="loading-mask">
    <div id="loading-mask" v-if="isShow" ref="loadingMask">
      <div class="container">
        <div class="loading-bar-background"></div>
        <div class="loading-bar-prospect"></div>
      </div>
      <div class="loading-tips">
        {{ tips }}
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { loadingbarImg } from '@/assets/loadingbarImg';
  import { useStore } from '@/store';
  import { computed, watch, onMounted, ref } from 'vue';

  const isShow = ref<boolean>(true);
  const barValue = ref<string>('0');
  const background = computed(() => {
    return `url(${loadingbarImg}) no-repeat`;
  });
  const tips = ref<string>('');
  const opacityRef = ref<string>('0');
  let c = 0;
  const updateAnimation: any = (progress: number, time: number) => {
    const update: any = () => {
      if (c >= progress) {
        return window.cancelAnimationFrame(update);
      }
      c += progress / (60 * time);
      barValue.value = c.toFixed(2) + '%';
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };

  const setTips = () => {
    const store = useStore();
    setTimeout(() => {
      if (store.loadingProgress <= 1) {
        tips.value = '嗯哼♪ 你的网络似乎有点慢';
        opacityRef.value = '1';
        setTimeout(() => {
          if (!store.isLoadError) {
            opacityRef.value = '0';
            setTimeout(() => {
              opacityRef.value = '1';
              tips.value = '或者切换下代理？';
            }, 1000);
          }
        }, 5000);
      }
    }, 5000);
  };

  const start = async () => {
    updateAnimation(35, 5);
    setTips();
  };

  const continueLoading = () => {
    updateAnimation(80, 5);
  };

  const finish = () => {
    updateAnimation(100, 0.2);
    setTimeout(() => {
      isShow.value = false;
    }, 300);
  };

 
  watch(
    () => useStore().loadingProgress,
    (val) => {
      if (val == 1) {
        continueLoading();
      } else if (val == 2) {
        finish();
      }
    }
  );

  watch(
    () => useStore().isLoadError,
    (val) => {
      if (val) {
        opacityRef.value = '0';
        setTimeout(() => {
          opacityRef.value = '1';
          tips.value = '哎呀，你的网络无法前往区块链的大门';
        }, 1000);
      }
    }
  );

  onMounted(() => {
    const image = new Image();
    image.src = loadingbarImg;
    image.onload = () => {
      start();
    };
  });
</script>

<style lang="less" scoped>
  .loading-mask-leave-active {
    transition: opacity 0.5s;
  }
  .loading-mask-leave-to {
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
      opacity: v-bind(opacityRef);
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
        width: v-bind(barValue);
        background: v-bind(background);
        background-size: 400px 50px;
        filter: drop-shadow(0 -50px 0 var(--theme-loadingbar-prospect-color));
      }
    }
  }
</style>
