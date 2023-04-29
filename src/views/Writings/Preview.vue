<template>
    <div id="preview">
        <div class="markdown-popover" v-if="isPreviewVisible">
            <div v-html="content"></div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useStore } from '@/store';
import { getMarkedContent } from '@/utils/marked';
import { computed, nextTick, ref, watch } from 'vue';
import { getSubPathsList } from './Writings';
import { appEnv } from '@/config';
import { getLocalWritingByPath } from '@/utils/dev';
import axios from 'axios';


const props = defineProps(['previewLink', 'isPreviewVisible'])
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
    // const loadingBarStore = useLoadingBarStore();
    // loadingBarStore.startLoadingBar();
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
    // loadingBarStore.finishLoadingBar();
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
        max-width: 300px;
        max-height: 300px;
        background: aliceblue;
        overflow: auto;
    }

}
</style>
  