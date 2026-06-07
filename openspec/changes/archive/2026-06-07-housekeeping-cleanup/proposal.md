## Why

仓库从 MVP 走到游戏化平台的过程中,根目录堆叠了大量救火/单次跑过的临时文件,生产源码目录里混着 Jest 测试和一次性验证脚本,白鹭图片问题留下了 10 份互相覆盖的方案文档,导致新进开发者很难判断哪些文件是规范的、哪些是历史包袱。在动手做结构性重构(Change #2)之前,先做一次"无行为变更"的清理,把仓库的形状重新对齐到"源码、测试、文档、配置"四类互不混居,同时把"测试位置"和"文档布局"这两条项目级约定沉淀为可被后续 change 引用的 capability。

## What Changes

- 删除根目录中三个一次性验证脚本(`test_homepage_components.js`、`comprehensive_test_homepage_components.js`、`verification_results.js`),它们硬编码了 `/Users/adder.chia/...` 路径,既不可移植、也不在 `npm test` 的运行范围内。
- 删除 `miniprogram/pages/index/index.wxss.bak`(与当前 `index.wxss` 重复,且为旧版样式,确认未被引用)。
- 将 `miniprogram/utils/` 下 12 个 `*.test.js` 与一次性测试辅助脚本(共 12 个文件)迁出生产源码目录,统一放进 `tests/utils/`,与现有 `tests/bird-knowledge-quiz.test.js` 同居;同时更新 `package.json` 的 jest 配置以覆盖新位置。
- 在根目录新增 `docs/decisions/image-display.md` 一份,作为"白鹭/图片显示"问题的最终决议文档;同时把 10 份零散历史 md(`EGRET_*`、`HOW_TO_DISPLAY_EGRET_IMAGE.md`、`IMAGE_DISPLAY_*`、`SOLVE_IMAGE_DISPLAY_ISSUE.md`、`COMPLETE_EGRET_DISPLAY_SOLUTION.md`、`MAP_BIRD_ASSOCIATION.md`)从根目录移到 `docs/archive/2026-image-display-debug-saga/`,并在该目录加 `README.md` 说明归档原因。
- 更新 `README.md` 的目录树,反映清理后的真实结构。
- **不**触碰任何业务逻辑、组件代码、云函数、依赖版本;**不**调整样式。

## Capabilities

### New Capabilities

- `repo-hygiene`:沉淀"测试位置"和"文档布局"两条项目级约定。`tests/` 才是测试的归属、`docs/decisions/` + `docs/archive/` 才是文档的归属。这两条后续 change 可以直接引用而不必再讨论。

### Modified Capabilities

无。

## Impact

- 受影响路径:
  - `test_homepage_components.js`、`comprehensive_test_homepage_components.js`、`verification_results.js`(删除)
  - `miniprogram/pages/index/index.wxss.bak`(删除)
  - `miniprogram/utils/{activity-panel.test.js,activity-utils.test.js,avatar-system.test.js,badge-data-integration.test.js,badge-data.test.js,points-system.test.js,activity-panel-component-test.js,comprehensive-badge-test.js,final-verification.js,integration-test.js,test-runner.js,validate-activity-utils.js}` → `tests/utils/`
  - 根目录 10 份 `EGRET_*` / `IMAGE_DISPLAY_*` / `MAP_BIRD_ASSOCIATION.md` → `docs/archive/2026-image-display-debug-saga/`
  - 新建 `docs/decisions/image-display.md`、`docs/archive/2026-image-display-debug-saga/README.md`
  - `package.json`(jest 配置扩展到 `tests/utils/`)
  - `README.md`(目录树更新)
- 风险:
  - 测试迁移需保证导入路径仍可解析(被测模块相对路径写法 `require('../xxx')` 改为 `require('../../miniprogram/utils/xxx')`),需要逐个跑一次确认。
  - 归档不是删除,git 历史仍可回查,回退成本极低。
- 不受影响:云函数、所有 `.js`/`.wxml`/`.wxss`/`.json` 业务文件、`.gitignore`、依赖版本。
