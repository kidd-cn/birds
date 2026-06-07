## Context

仓库目前 4 类文件互相穿插:根目录有源码级验证脚本(且硬编码 Mac 路径),生产 utils 目录里混着 Jest 单元测试与一次性验证脚本,根目录还堆着 10 份"白鹭图片显示"问题的不同时期方案 md,`miniprogram/pages/index/index.wxss.bak` 是早一版的样式备份。这种"代码 - 测试 - 文档 - 历史包袱"四类文件混居的状态,让新进开发者要在 `miniprogram/utils/` 里数文件才知道哪些是产品代码、哪些是测试,也让 `npm test` 只覆盖了 `tests/` 下的 1 份测试,实际跑得到的覆盖率远低于仓库里实际存在的 12 份测试。

本 Change 的目标是在**完全不触碰任何业务代码、不改变任何运行时行为**的前提下,把仓库的形状重新对齐到"源码 / 测试 / 文档 / 配置"四类互不混居的目录约定,并把根目录 10 份历史 md 收编进 `docs/archive/` 保留可追溯性。

## Goals / Non-Goals

**Goals:**

- 让 `npm test`(Jest)能真实地跑到所有 12 份测试,而不是只跑到 `tests/` 下的 1 份。
- 让根目录的 `*.md` 数量从 ~15 降到 9 份(全部是规范文档),其余历史/救火文档进归档目录。
- 让 `miniprogram/utils/` 目录中只放真正被小程序运行时引用的生产模块。
- 维护一次性的"白鹭/图片显示"问题决议文档,记录最终方案与 git 链接,后人能从一处读到全貌。

**Non-Goals:**

- 不修改任何业务代码(`*.js` 业务文件、`*.wxml`、`*.wxss`、`*.json` 页面配置)。
- 不修改云函数、不重命名公共 API、不调整样式值。
- 不调整依赖版本(`package.json`/`package-lock.json` 里的依赖项保持)。
- 不动 `.gitignore`、`.DS_Store`、`.claude/`、`.agents/`、`.git/`。
- 不拆大文件、不合并重复 quiz 组件(留给 Change #2)。

## Decisions

### Decision 1: 测试目录采用 `tests/utils/` 子目录,而不是把测试散放回生产 utils 目录

**选项 A**(采用):新建 `tests/utils/` 子目录,按被测模块名命名(如 `tests/utils/points-system.test.js`),与现有 `tests/bird-knowledge-quiz.test.js` 平级。
**选项 B**:把测试搬回 `miniprogram/utils/`,与生产代码同居。
**选项 C**:把测试散在 `tests/` 根目录,不分子目录。

选 A 的理由:既符合 Jest 默认 `**/*.test.js` 模式,又避免了 WeChat 小程序构建器(只打 `.js` 到产物里)误把测试打进运行包;子目录让"测试的是哪个 utils 模块"在路径上就一目了然。

### Decision 2: 历史 md 用 `docs/archive/<slug>/` 归档,**不**直接删除

**选项 A**(采用):新建 `docs/archive/2026-image-display-debug-saga/`,把 10 份 md 全部归档进去,并在该目录加 `README.md` 指向"最终决议在 `docs/decisions/image-display.md`"。
**选项 B**:直接 `git rm` 删除这 10 份 md。
**选项 C**:合并成一份"白鹭图片显示"完整历史 md,放在 `docs/history/`。

选 A 的理由:保留当时的具体方案与尝试对将来排查"为什么 X 没被采用"有用;`git rm` 会让后人 git log 也得翻,归档则更直观。直接合并会丢一些细节。

### Decision 3: `index.wxss.bak` 走 `git rm`,不留归档

因为对比过内容,`.bak` 已经是**早一版**的样式,被当前 `index.wxss` 完整取代;而且 `index.wxss.bak` 名字本身表明它就是备份,没有信息量。归档反而制造干扰。

### Decision 4: `package.json` 调整 jest 配置以覆盖新位置,而不改 `test` 脚本名

**选项 A**(采用):在 `package.json` 的 jest 字段里加 `"testMatch": ["<rootDir>/tests/**/*.test.js"]`,让所有测试都进。
**选项 B**:改 `test` 脚本为 `jest --testPathPattern='(tests|miniprogram/utils)'`。

选 A 的理由:Jest 配置文件是声明式的,长期看更稳;选项 B 是 shell glob 拼接,以后再加位置容易漏。现状 `package.json` 没有 jest 字段,需要补上;同时 `scripts.test = "jest tests/"` 收紧为 `"jest"` 让 testMatch 接管。

### Decision 5: 不动 `app.js` 里 `wx.cloud.init({ env: 'release-env' })` 的硬编码

这是 Change #2 或后续云端化 change 的范围。本 change 严格限定"无行为变更",连环境 ID 的注释也不加。

## Risks / Trade-offs

- **测试导入路径断裂** → 迁移 12 份测试到 `tests/utils/` 后,所有 `require('../xxx')` 会变成 `require('../../miniprogram/utils/xxx')`。Mitigation:逐个 sed 调整并跑 `npm test` 验证。
- **Jest 配置失误导致 CI 红** → 改了 `test` 脚本和 testMatch 后,如果路径写错,jest 会"静默跑过"0 测试。Mitigation:`npm test` 必须在本地跑通且报告 12 份测试都被发现,合并前在最终 commit message 引用 `npm test` 的输出。
- **归档目录被遗忘** → `docs/archive/2026-image-display-debug-saga/` 没人会主动看。Mitigation:`README.md` 里"项目结构"小节标注"历史方案见 docs/archive/"。
- **`.DS_Store` 等 macOS 元数据未清理** → 这是 macOS 自动生成的,清不掉(下次 mac 端操作还会出现),且对仓库无害。Mitigation:不处理,留给既有 `.gitignore`/项目约定。
- **README 目录树更新滞后** → 如果以后又有人加新页/新组件而忘了更新 README,会出现文档与实际不符。Mitigation:本 change 顺手更新到当前实际状态,后续维护是常规纪律问题。

## Migration Plan

本 change 不需要分阶段发布,合并即生效:

1. 在 worktree 上开新分支 `codex/housekeeping-cleanup`(本会话内不实际 push)。
2. 按 tasks.md 顺序执行文件移动 / 删除。
3. 调整 `package.json` 的 jest 字段与 `scripts.test`。
4. 跑 `npm test` 验证 12 份测试全部被发现并通过。
5. 用 `git diff --stat` 自查改动是否符合预期(应只触及 .md / 测试文件 / 配置文件 / `.bak`)。
6. 提交。

**回滚策略:** 因 change 涉及大量文件移动,最稳的回滚方式是 `git revert <merge-commit>`,而不是手工复原。如果只想回退单个文件,git checkout 即可。

## Open Questions

- 12 份测试里是否有原本就 broken、跑不通的(会污染"清理后通过"的判定)? 需要在执行 tasks.md 之前先 `npm test` 一次确认基线。
- `comprehensive-badge-test.js`、`final-verification.js`、`validate-activity-utils.js`、`integration-test.js`、`activity-panel-component-test.js` 这几个名字不像标准 Jest 文件,可能用了 `node` 直接跑或自有 runner——迁移到 `tests/utils/` 后,它们的运行机制需要逐个确认。
