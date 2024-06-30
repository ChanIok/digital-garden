<template>
    <div id="comments">
        <div class="container">
            <div class="content">
                <iframe :src="url" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore()
const url = computed(() => {
    const s = store.isDark ? "dark" : "light";
    return `https://widget.0xecho.com?color-theme=${s}&desc=Hi&has-h-padding=true&has-v-padding=true&modules=comment%2Ctip&receiver=chaniok.eth&target_uri=https%3A%2F%2Fchaniok.eth.limo%2Fcomments%2Fd5d20`;
});
</script>

<style lang="less" scoped>
#comments {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    background-color: var(--theme-bg);
    transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0s;

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        iframe {
            width: 100%;
            height: 100%;
        }

        .header {
            padding: 20px;
        }

        .content {
            width: 100%;
            flex: 1;
        }
    }
}
</style>
  