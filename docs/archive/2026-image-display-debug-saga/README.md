# 归档:2026 年"白鹭/图片显示"问题调试记录

## 这是什么

这一组 md 是 2026-05 前后反复调试"地图标记图片显示不出来"问题时留下的不同时期方案/记录,涉及白鹭(egret)以及一般化的 marker image 关联。问题已经在 2026-05-20 前后定稿(见 `docs/decisions/image-display.md`),本目录仅作历史归档。

## 文件清单

| 文件 | 大致内容 |
|---|---|
| `EGRET_IMAGE_ASSOCIATION.md` | 大白鹭图片与地图位置关联的初版说明 |
| `EGRET_IMAGE_ASSOCIATION_GUIDE.md` | 配套的实施指南 |
| `EGRET_JPG_ASSOCIATION.md` | 切到 JPG 后的关联说明 |
| `EGRET_MAP_FEATURE.md` | 当时围绕白鹭加的"特殊标记"尝试 |
| `HOW_TO_DISPLAY_EGRET_IMAGE.md` | 一步步"如何把白鹭图显示出来"教程 |
| `IMAGE_DISPLAY_SOLUTION.md` | 一次走通的方案 |
| `IMAGE_DISPLAY_FIX_SOLUTION.md` | 之后回退,又修了一版 |
| `SOLVE_IMAGE_DISPLAY_ISSUE.md` | 复盘根因 |
| `COMPLETE_EGRET_DISPLAY_SOLUTION.md` | 中期一度被当作"最终版" |
| `MAP_BIRD_ASSOCIATION.md` | 把"鸟-位置"映射讲清楚 |

> 这些文件之间互相覆盖、补全、推翻,正常阅读顺序不可考。**请直接看 [`../../decisions/image-display.md`](../../decisions/image-display.md) 获取最终决议。**

## 为什么归档而不是删除

- git 历史虽然能查到,但翻 commit 不直观;归档能让人在不知道问题起源时一次性看到全貌。
- 这些文档里记着当时被否决的方案与理由,有助于避免后人重蹈覆辙(例如"再给 marker 加 webp icon")。
- 当时"为什么没采用 X"的论证,往往比最终方案本身更有信息量。

## 归档日期

2026-06-07(在 `housekeeping-cleanup` change 内执行)