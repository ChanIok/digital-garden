import { useWritingStore } from "@/store";
import { nextTick } from "vue";

type ListItem = {
  label: string;
  key: string;
};

export const loadWritingData = async (visibleList: any, hiddenList: any) => {
  const offset = 50;
  const writingStore = useWritingStore();
  await nextTick();
  visibleList.value = writingStore.currentWritingPathArray.slice();
  hiddenList.value = [];
  await nextTick();

  const navBarUlWidth = getNavBarUlWidth();
  const navBarLiEls = getNavBarLiEls();
  const totalWidth = getTotalWidth(navBarLiEls);
  console.log(totalWidth, navBarUlWidth);
  if (totalWidth > navBarUlWidth) {
    adjustVisibleList(
      navBarUlWidth,
      totalWidth,
      offset,
      navBarLiEls,
      visibleList,
      hiddenList
    );
  }
};

const getNavBarUlWidth = (): number => {
  return (document.querySelector("#nav-bar>ul") as any).offsetWidth;
};

const getNavBarLiEls = (): NodeListOf<Element> => {
  return document.querySelectorAll("#nav-bar>ul>li");
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
  for (let i = 2; i < navBarLiEls.length ; i++) {
    totalWidth -= (navBarLiEls[i] as any).offsetWidth;
    const item = visibleList.value.shift();
    hiddenList.value.push({
      label: item,
      key: item,
    });

    if (totalWidth < navBarUlWidth) {
      return;
    }
  }
};
