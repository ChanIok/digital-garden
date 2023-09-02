<template>
  <div id="status" ref="status">
    <n-scrollbar>
      <div class="container">
        <div class="content">
          <n-h1>交易状态</n-h1>
          <n-h2>文章入口</n-h2>
          <n-timeline>
            <n-timeline-item
              v-for="(item, index) in writingsEdges"
              :type="index == 0 ? 'success' : 'info'"
              :key="index"
              :title="`${item.node.id}`"
              :content="
                item.node.block != null ? `Height: ${item.node.block.height}` : 'Pending...'
              "
              :time="
                item.node.block != null
                  ? dayjs.unix(item.node.block.timestamp).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              "
              :line-type="index == writingsEdges.length - 1 ? 'dashed' : 'default'"
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
              :content="
                item.node.block != null ? `Height: ${item.node.block.height}` : 'Pending...'
              "
              :time="
                item.node.block != null
                  ? dayjs.unix(item.node.block.timestamp).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              "
              :line-type="index == AppEdges.length - 1 ? 'dashed' : 'default'"
            />
            <n-timeline-item content="......" />
          </n-timeline>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { NTimeline, NTimelineItem, NH1, NH2, NScrollbar } from 'naive-ui';
  import { getLatestManifest } from '@/utils/artools';
  import { onMounted, ref, h, render } from 'vue';
  import dayjs from 'dayjs';

  const status = ref<any>(null);
  const writingsEdges = ref<any>(null);
  const AppEdges = ref<any>(null);

  const getManifests = async () => {
    const [writingsResponse, appResponse] = await Promise.all([
      getLatestManifest(),
      getLatestManifest(true),
    ]);
    writingsEdges.value = writingsResponse.data.transactions.edges;
    AppEdges.value = appResponse.data.transactions.edges;
  };

  const setLinks = () => {
    const elements = Array.from(status.value.querySelectorAll('.n-timeline-item-content__title'));
    elements.map((item: any) => {
      const txId = item.innerHTML;
      const aInstance = h(
        'a',
        {
          href: `https://viewblock.io/arweave/tx/${txId}`,
          target: '_blank',
        },
        txId
      );

      let aElement = document.createElement('div');
      render(aInstance, aElement);
      item.replaceWith(aElement);
    });
  };

  onMounted(async () => {
    await getManifests(), setLinks();
  });
</script>

<style lang="less" scoped>
  #status {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .container {
      align-items: center;
      justify-content: center;
      display: flex;

      width: 100%;

      .content {
        padding: 40px;
        box-sizing: border-box;
        width: 880px;
        max-width: 100%;

        :deep(a) {
          text-decoration: none;
          color: inherit;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          display: inline-block;
          font-size: 14px;
        }
      }
    }
  }
</style>
