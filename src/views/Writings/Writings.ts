import { appEnv } from '@/config';
import { useLoadingBarStore } from '@/store/modules/loading-bar';
import { nextTick } from 'vue';
import { useStore, useWritingStore } from '@/store';
import axios from 'axios';
import { IManifest } from '@/typings';

/**
 * 根据路径获取本地写作内容
 * @param path - 文件路径
 * @returns 写作内容字符串
 */
export const getLocalWritingByPath = async (path: string): Promise<string> => {
  let res = '';
  const store = useStore();
  const manifest = store.manifest;

  // 如果 manifest 不存在，直接返回空字符串
  if (!manifest) {
    return res;
  }

  // 发送请求获取本地写作内容
  res = (await axios.get(`${appEnv.VITE_LOCAL_REQUEST_URL}/${path}`)).data;
  return res;
};

/**
 * 获取子路径列表并生成 Markdown 格式的链接列表
 * @param manifest - manifest 对象
 * @param targetPath - 目标路径
 * @returns Markdown 格式的链接列表字符串
 */
export const getSubPathsList = (manifest: IManifest, targetPath: string): string => {
  const paths = manifest.paths;
  const subPaths: Record<string, string> = {};
  let markdownList = '';

  // 遍历所有路径，筛选出以目标路径开头的子路径
  for (const path in paths) {
    if (path.startsWith(targetPath)) {
      const pathSegments = path.slice(targetPath.length).split('/');
      const subPathKey = pathSegments[1];
      const subPathValue =
        pathSegments.length > 2
          ? `${targetPath}/${subPathKey}/index.md`
          : `${targetPath}/${subPathKey}`;

      // 处理路径中的空格
      subPaths[subPathKey] = subPathValue.replace(/\s/g, '%20');
    }
  }

  // 生成 Markdown 格式的链接列表
  for (const path in subPaths) {
    markdownList += `[${path}](${subPaths[path]})\n\n`;
  }

  return markdownList;
};

/**
 * 加载写作内容
 * @param isReturnTextDirectly - 是否直接返回文本内容
 * @param path - 文件路径
 * @returns 如果 isReturnTextDirectly 为 true，则返回文本内容，否则无返回值
 */
export const loadWriting = async (
  isReturnTextDirectly = false,
  path = '/index.md'
): Promise<string | void> => {
  const store = useStore();
  const writingStore = useWritingStore();
  const loadingBarStore = useLoadingBarStore();
  const manifest = store.manifest;
  const currentWritingPath = isReturnTextDirectly ? path : writingStore.currentWritingPath;

  // 如果 manifest 不存在，直接返回
  if (!manifest) {
    return;
  }

  // 如果当前路径是 /index.md 且不在 manifest 中，获取子路径列表
  if (currentWritingPath.endsWith('/index.md') && !(currentWritingPath in manifest.paths)) {
    const text = getSubPathsList(
      manifest,
      currentWritingPath.slice(0, currentWritingPath.length - '/index.md'.length)
    );
    if (isReturnTextDirectly) {
      return text;
    } else {
      writingStore.setCurrentWritingText(text);
      return;
    }
  }

  if (!isReturnTextDirectly) {
    loadingBarStore.startLoadingBar();
  }

  // 根据配置获取请求 URL
  const url = appEnv.VITE_USE_LOCAL_WRITINGS
    ? `${appEnv.VITE_LOCAL_REQUEST_URL}/${currentWritingPath}`
    : `${store.gateway}/${manifest?.paths[currentWritingPath]?.id}`;

  // 发送请求获取写作内容
  const { data } = await axios.get(url);

  if (isReturnTextDirectly) {
    return data;
  } else {
    writingStore.setCurrentWritingText(data);
    await nextTick();
  }

  if (!isReturnTextDirectly) {
    loadingBarStore.finishLoadingBar();
  }
};
