<template>
    <div id="preview">
        <transition name="fade">
            <div class="markdown-popover" v-if="isPreviewVisible"
                :style="{ width: `${previewPosition.width}px`, height: `${previewPosition.height}px` }">
                <n-scrollbar>
                    <div v-html="content" class="content"></div>
                </n-scrollbar>
            </div>
        </transition>
    </div>
</template>
  
<script setup lang="ts">
import { useStore } from '@/store';
import { getMarkedContent } from '@/utils/marked';
import { computed, nextTick, ref, watch } from 'vue';
import { getSubPathsList } from './Writings';
import { appEnv } from '@/config';
import { getLocalWritingByPath } from '@/utils/dev';
import { NScrollbar } from "naive-ui";
import axios from 'axios';

const props = defineProps(['previewLink', 'isPreviewVisible', 'previewPosition'])
const writingText = ref<string>('')
const loadWriting = async (currentWritingPath: string) => {
    const store = useStore();
    const manifest = store.manifest;
    if (!manifest) {
        return;
    }
    if (currentWritingPath.endsWith("/index.md")) {
        if (!(currentWritingPath in manifest.paths)) {
            writingText.value = getSubPathsList(
                manifest,
                currentWritingPath.slice(
                    0,
                    currentWritingPath.length - "/index.md".length
                )
            );
            return;
        }
    }
    if (appEnv.VITE_USE_LOCAL_WRITINGS) {
        writingText.value = await getLocalWritingByPath(currentWritingPath);

    } else {
        writingText.value = (
            await axios.get(
                `https://arweave.net/${manifest!.paths[currentWritingPath].id}`
            )
        ).data;

    }
    await nextTick();
};


const content = computed(() => {
    return getMarkedContent(writingText.value);
});

watch(() => props.previewLink, (val: string) => {
    if (val != '') {
        loadWriting(val)
    }
})
</script>
  
<style lang="less" scoped>
#preview {

    .markdown-popover {

        background-color: #fff;
        box-shadow: 0 0 6px 6px rgba(0, 0, 0, 0.05);
        overflow: auto;

        .content {
            font-size: 13px;
            padding: 10px;
            box-sizing: border-box;
        }
    }

    .fade-enter-active {
        transition: opacity .3s;
    }

    .fade-enter {
        opacity: 0;
    }

    .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-leave-to {
        opacity: 0;
    }
}
</style>
  