import { useWritingStore } from '@/store';
import { nextTick } from 'vue';

export const loadWritingData = async (visibleList: any, hiddenList: any) => {
  const offset = 100;
  const writingStore = useWritingStore();
  await nextTick();
  visibleList.value = writingStore.currentWritingPathArray.slice();
  visibleList.value.unshift('');
  visibleList.value = visibleList.value.map((item: any, index: number) => {
    let label = item.replace(/%20/g, ' ');
    if (index == 0) {
      label = '数字花园';
      return { label, key: '/' };
    } else if (index == visibleList.value.length - 1 && item == 'index.md') {
      label = '目录';
    }
    return { label, key: item };
  });
  hiddenList.value = [];
  await nextTick();

  const navBarUlWidth = getNavBarUlWidth();
  const navBarLiEls = getNavBarLiEls();
  const totalWidth = getTotalWidth(navBarLiEls);
  if (totalWidth > navBarUlWidth) {
    adjustVisibleList(navBarUlWidth, totalWidth, offset, navBarLiEls, visibleList, hiddenList);
  }
};

const getNavBarUlWidth = (): number => {
  return (document.querySelector('#nav-bar>ul') as any).offsetWidth;
};

const getNavBarLiEls = (): NodeListOf<Element> => {
  return document.querySelectorAll('#nav-bar>ul>li');
};

const getTotalWidth = (navBarLiEls: NodeListOf<Element>): number => {
  let totalWidth = 0;
  navBarLiEls.forEach((item) => {
    totalWidth += (item as any).offsetWidth;
  });
  return totalWidth;
};

const adjustVisibleList = (
  navBarUlWidth: number,
  totalWidth: number,
  offset: number,
  navBarLiEls: NodeListOf<Element>,
  visibleList: any,
  hiddenList: any
) => {
  totalWidth += offset;
  for (let i = 2; i < navBarLiEls.length; i++) {
    totalWidth -= (navBarLiEls[i] as any).offsetWidth;
    const item = visibleList.value.shift();
    hiddenList.value.push(item);

    if (totalWidth < navBarUlWidth) {
      return;
    }
  }
};
