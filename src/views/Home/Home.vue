<template>
  <div id="home">
    <Background />
    <Universe />
    <div class="home-container">
      <div class="card" :class="{
        'light-theme': !isDark,
      }">
        <div class="header">
          <div class="header-left">ChanIok</div>
          <div class="header-right">.eth</div>
        </div>
        <div class="content">
          <span> Hi，欢迎来到本站， </span>
          <span> 这里是我构筑于区块链的一心净土 </span>
          <div class="link">
            <div class="link-item">
              <n-button text tag="a" href="https://github.com/ChanIok/" target="_blank" color="#ffffffdf">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import Universe from "@/views/Home/Universe.vue";
import { NIcon, NButton } from "naive-ui";
import Background from "@/views/Home/Background.vue";
import { LogoGithub, Mail } from "@vicons/ionicons5";
import { useStore } from "@/store";

const store = useStore()
const isDark = store.isDark;

</script>

<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;

  .home-container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .light-theme {
      text-shadow: 3px 3px 5px rgba(78, 78, 78, 0.5);
    }

    .card {
      z-index: 1;
      display: flex;
      flex-direction: column;
      max-width: 500px;

      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        color: rgb(255, 255, 255);
        line-height: 48px;

        .header-right {
          margin-left: 10px;
          margin-top: 20px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .content {
        font-size: 18px;
        color: rgb(255, 255, 255);
        margin-bottom: 20px;

        @media only screen and (max-width: 480px) {
          margin-top: 20px;
          line-height: 32px;

          span {
            text-align: center;
            display: block;
          }
        }

        .link {
          margin-top: 10px;
          display: flex;
          justify-content: space-around;

          .link-item {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
