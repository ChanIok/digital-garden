# 我的数字花园

这是一个建立在 [Arweave](https://www.arweave.org/) 上的数字花园，整个项目被我高度定制化，没啥复用性，仅供参考

## 灵感来源

第一次见到数字花园是这个网站：[**oldwinterの数字花园**](https://notes.oldwinter.top/)。我日常记录内容本来就是用 `Obsidian` 进行管理的，所以我想以这个为参照，建立我自己的数字花园。

## 技术框架

- 前端部分：Vue3 + Vite2 + TypeScript + Navie UI
- 区块链部分：Arweave + Bundlr

## 主要设计

不同于传统的博客框架，我把网站本体和文章内容拆分成两部分，存放到不同的 `manifest` 中进行管理，加载网站本体时，通过 [`Arweave GraphQL`](https://arweave.net/graphql) 获取最新的 `Markdown` 文章内容，再由 `marked.js` 渲染到页面中。

这样设计的原因是避免日常更新文章时，项目需要被重新打包然后重新上传到 `Arweave`，造成额外开销。在利用 `Bundlr` 的上传脚本中，我在 `manifest.json` 加入了哈希值校验，只上传有变化的文件。

## 预览

- [digital-garden.4everland.app](digital-garden.4everland.app)