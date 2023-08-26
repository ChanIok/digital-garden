<template>
  <div id="status">
    <div class="container">
      <div class="content">
        <n-h1>区块状态</n-h1>
        <n-h2>文章入口</n-h2>
        <n-timeline>
          <n-timeline-item
            v-for="(item, index) in writingsEdges"
            :type="index == 0 ? 'success' : 'info'"
            :key="index"
            :title="`${item.node.id}`"
            :content="`Height: ${item.node.block.height}`"
            :time="dayjs.unix(item.node.block.timestamp).format('YYYY-MM-DD HH:mm:ss')"
            :line-type="index == writingsEdges.length - 1 ? 'dashed' : 'default'"
            @click="onClick(item.node.id)"
          />
          <n-timeline-item content="......" />
        </n-timeline>

        <n-h2>站点入口</n-h2>
        <n-timeline>
          <n-timeline-item
            v-for="(item, index) in AppEdges"
            :type="index == 0 ? 'success' : 'info'"
            :key="index"
            :title="`${item.node.id}`"
            :content="`Height: ${item.node.block.height}`"
            :time="dayjs.unix(item.node.block.timestamp).format('YYYY-MM-DD HH:mm:ss')"
            :line-type="index == AppEdges.length - 1 ? 'dashed' : 'default'"
            @click="onClick(item.node.id)"
          />
          <n-timeline-item content="......" />
        </n-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NTimeline, NTimelineItem, NH1, NH2 } from 'naive-ui';
  import { getLatestManifest } from '@/utils/artools';
  import { nextTick, onMounted, ref } from 'vue';
  import dayjs from 'dayjs';

  const writingsEdges = ref<any>(null);
  const AppEdges = ref<any>(null);
  const onClick = (txId: string) => {
    window.open(`https://viewblock.io/arweave/tx/${txId}`, '_blank');
  };
  const a = async () => {
  const [writingsResponse, appResponse] = await Promise.all([
    getLatestManifest(),
    getLatestManifest(true)
  ]);

  writingsEdges.value = writingsResponse.data.transactions.edges;
  AppEdges.value = appResponse.data.transactions.edges;
};

  onMounted(() => a());
</script>

<style lang="less" scoped>
  #status {
    width: 100%;
    height: 100%;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    display: flex;

    .container {
      padding: 20px;
      box-sizing: border-box;
      max-width: 880px;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      //   display: flex;
      //   flex-direction: column;

      .content {
        width: 880px;
        max-width: 100%;
        :deep(.n-timeline-item-content__title) {
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
        }
        :deep(.n-timeline-item-content) {
          cursor: pointer;
        }
      }
    }
  }
</style>
