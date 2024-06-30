<template>
  <div id="welcome" :class="{ light: !store.isDark }">
    <div class="container">
      <div class="content">
        <n-h1> Hi，欢迎来到本站</n-h1>
        <n-p> 这里是我构筑于区块链的一心净土 </n-p>
        <n-p> </n-p>
        <n-ul>
          <n-li>
            <router-link to="/writings/index.md" #="{ navigate, href }" custom>
              <n-a :href="href" @click="navigate"> 数字花园 </n-a>
            </router-link>
          </n-li>
          <n-li>
            <router-link to="/comments" #="{ navigate, href }" custom>
              <n-a :href="href" @click="navigate"> 留言板 </n-a>
            </router-link>
          </n-li>
          <n-li>
            <router-link to="/status" #="{ navigate, href }" custom>
              <n-a :href="href" @click="navigate"> 交易状态 </n-a>
            </router-link>
          </n-li>
        </n-ul>
      </div>
      <div class="link">
        <div class="link-item">
          <n-button
            text
            tag="a"
            href="https://github.com/ChanIok/"
            target="_blank"
            color="#ffffffdf"
          >
            <template #icon>
              <n-icon>
                <LogoGithub />
              </n-icon>
            </template>
            Github
          </n-button>
        </div>
        <div class="link-item">
          <n-button text tag="a" href="mailto:chaniok@qq.com" target="_blank" color="#ffffffdf">
            <template #icon>
              <n-icon>
                <Mail />
              </n-icon>
            </template>
            Mail
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NIcon, NButton, NH1, NUl, NLi, NP, NA } from 'naive-ui';
  import { LogoGithub, Mail } from '@vicons/ionicons5';
  import { useStore } from '@/store';

  const store = useStore();
</script>

<style lang="less" scoped>
  @import url('@/styles/varibles.less');
  @color: rgba(252, 252, 252, 1);

  .light .content :deep(h1),
  .light .content :deep(li),
  .light .content :deep(p) {
    color: @color;
    text-shadow: 3px 3px 5px rgba(32, 32, 32, 0.6);
  }

  .light .content li :deep(a) {
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.8);
  }

  #welcome {
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      flex-direction: column;
      width: 50%;
      max-width: 800px;
      height: 100%;
      justify-content: center;
      align-items: start;
      z-index: inherit;

      .content {
        z-index: inherit;
      }

      .link {
        margin-top: 10px;
        display: flex;
        justify-content: space-around;

        .link-item {
          margin-right: 20px;
        }
      }

      @media only screen and (max-width: 480px) {
        width: 80%;
      }

      @media only screen and (max-width: 360px) {
        width: 350;
      }
    }
  }
</style>
