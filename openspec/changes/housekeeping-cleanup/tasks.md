## 1. Baseline & prep

- [x] 1.1 Run `npm test` in repo root and record the current pass/fail status of every test file in `miniprogram/utils/` and `tests/`. Save the output as `docs/archive/2026-image-display-debug-saga/baseline-test-output.txt` (or just paste into the PR description) so the "after" run can be compared honestly.
- [x] 1.2 Confirm `package.json` has no `jest` field today; record current `scripts.test` value. (Expected: `"jest tests/"`.)
- [x] 1.3 Confirm `miniprogram/pages/index/index.wxss.bak` is a strict subset / older version of `miniprogram/pages/index/index.wxss` (i.e. safe to delete) by diffing them and recording the result in the PR.


- [x] 1.4 `node_modules/` was empty in this checkout, so `npm test` could not run for the baseline. Ran `npm install` (283 packages, no errors). Also added `.gitignore` at repo root (was missing) covering `node_modules/`, `*.bak`, `.DS_Store`, `miniprogram_npm/`, and standard env/coverage output. This is in-scope for housekeeping; it lets the upcoming commit stay clean. With the new `.gitignore`, `git status` drops from 210 untracked files to 2 (`.gitignore` itself and `openspec/changes/`).
## 2. Move tests out of production source dir

- [x] 2.1 Create `tests/utils/` directory.
- [x] 2.2 Move the 6 `*.test.js` files from `miniprogram/utils/` to `tests/utils/`, preserving filenames:
  - `activity-utils.test.js`
  - `avatar-system.test.js`
  - `badge-data.test.js`
  - `badge-data-integration.test.js`
  - `points-system.test.js`
  - `activity-panel.test.js`
- [x] 2.3 Move the 6 one-off test/verification scripts from `miniprogram/utils/` to `tests/utils/`, preserving filenames:
  - `activity-panel-component-test.js`
  - `comprehensive-badge-test.js`
  - `final-verification.js`
  - `integration-test.js`
  - `test-runner.js`
  - `validate-activity-utils.js`
- [x] 2.4 Rewrote internal 
equire() paths in 7 files (5 standard *.test.js + 2 one-off scripts; the rest used only built-ins or inline data). Pattern: 
equire('./xxx(.js)?') to 
equire('../../miniprogram/utils/xxx.js'). Verified by reading each file end-to-end., rewrite internal `require()` paths so the relative path resolves from the new location. Most will need `../foo` 闂?`../../miniprogram/utils/foo`. Verify by reading each file end-to-end (the test files are < 5 KB each, the script files range from < 1 KB to 24 KB).
- [x] 2.5 Re-ran `npm test` after path rewrites but before jest config changes. Reality: jest is still pointed at `tests/` glob (old config), so it only ran the 1 pre-existing test suite (`tests/bird-knowledge-quiz.test.js`), still 2/4 pass + 2/4 pre-existing fail. The 6 newly-moved `*.test.js` files are sitting in `tests/utils/` but not yet discovered 闂?that''s task 3. The 6 one-off scripts are organizational, not jest-discoverable; they will be runnable as `node tests/utils/<name>.js` for ad-hoc verification, and the testMatch should NOT include them.


- [x] 2.6 Verify surfaced during openspec-verify: 3 more *.test.js files live in miniprogram/ outside of utils/ and were missed in the initial scope. Move them too:
  - miniprogram/components/checkin-activity/checkin-activity.test.js → 	ests/components/checkin-activity/checkin-activity.test.js
  - miniprogram/components/checkin-activity/checkin-activity-files.test.js → 	ests/components/checkin-activity/checkin-activity-files.test.js
  - miniprogram/pages/index/index.test.js → 	ests/pages/index/index.test.js
- [x] 2.7 Update internal equire() paths in the moved files. The two checkin-activity files use only s/path (no local requires). index.test.js has equire('./index'); rewrite to equire('../../../miniprogram/pages/index/index') so it resolves from the new location.
- [x] 2.8 Re-ran ind miniprogram -name "*.test.js" after the moves. Result: 0 files. Spec scenario S1 is now satisfied.
## 3. Wire Jest to the new test location

- [x] 3.1 In `package.json`, add a top-level `jest` field with `testMatch: ["<rootDir>/tests/**/*.test.js"]` so the existing glob covers both `tests/*.test.js` and `tests/utils/*.test.js`.
- [x] 3.2 Change `scripts.test` from `"jest tests/"` to `"jest"` so `testMatch` is the single source of truth.
- [x] 3.3 Run `npm test` again; report the discovered test count.

## 4. Delete dead code in repo root

- [x] 4.1 `git rm` the three hardcoded-path scratch scripts:
  - `test_homepage_components.js`
  - `comprehensive_test_homepage_components.js`
  - `verification_results.js`
- [x] 4.2 `git rm` `miniprogram/pages/index/index.wxss.bak`.

## 5. Consolidate image-display history docs

- [x] 5.1 Create `docs/decisions/` directory.
- [x] 5.2 Write `docs/decisions/image-display.md`: a 1-page "what we finally decided" doc for the 闂傚倸鍊搁崐鎼佸磹瀹勬噴褰掑炊椤掍礁鍓銈嗗姧缁犳垹澹曢崗鑲╃瘈濠电姴鍊归崳浠嬫煕濮楀棗鐏﹂柡?/ map-marker image display problem, with: (a) the current authoritative implementation (pointer to `miniprogram/utils/birdData.js` `imageUrl` field), (b) the marker strategy decision (system marker + text label, not custom image), (c) a "why we did not X" section listing the rejected approaches. Keep it short; this is the canonical entry point.
- [x] 5.3 Create `docs/archive/2026-image-display-debug-saga/` directory.
- [x] 5.4 `git mv` the 10 legacy md files from repo root into the archive directory:
  - `EGRET_IMAGE_ASSOCIATION.md`
  - `EGRET_IMAGE_ASSOCIATION_GUIDE.md`
  - `EGRET_JPG_ASSOCIATION.md`
  - `EGRET_MAP_FEATURE.md`
  - `HOW_TO_DISPLAY_EGRET_IMAGE.md`
  - `IMAGE_DISPLAY_FIX_SOLUTION.md`
  - `IMAGE_DISPLAY_SOLUTION.md`
  - `SOLVE_IMAGE_DISPLAY_ISSUE.md`
  - `COMPLETE_EGRET_DISPLAY_SOLUTION.md`
  - `MAP_BIRD_ASSOCIATION.md`
- [x] 5.5 Write `docs/archive/2026-image-display-debug-saga/README.md` that lists the files, the date range, and points readers to the canonical decision doc.

## 6. Update README

- [x] 6.1 Update the `## 濠电姷鏁告慨鐑姐€傞鐐潟闁哄洢鍨圭壕濠氭煙鏉堝墽鐣辩痪鎯х秺閺岋繝宕堕埡浣稿闂佸吋婢樺锟犲蓟濞戞鏃堝礃瑜忛梻顖氣攽閻愬弶鈻曞ù婊勭矌缁濡烽敂杞扮盎闂佸搫鍊搁悘婵嬪煕閺冨牊鐓ユ繛鎴炵懅閻帗鎱ㄦ繝鍛仩闁瑰弶鎸冲畷鐔碱敃閵忕姌鎴炰繆閻愵亜鈧牕煤閿曞倸鐭楅柛鎰靛枛閺勩儵鏌嶈閸撴岸濡甸崟顖氱闁瑰瓨绺鹃崑鎾广亹閹?section in `README.md` to reflect: (a) no `.bak` files, (b) no root test/scratch files, (c) tests under `tests/` and `tests/utils/`, (d) new `docs/decisions/` and `docs/archive/` directories.
- [x] 6.2 Re-read README to confirm no other references to deleted files.

## 7. Self-verify before commit

- [x] 7.1 Run `git status -s` and confirm changed paths match the proposal exactly (no surprise edits to business code, no missing moves).
- [x] 7.2 Run `git diff --stat` and confirm the file count and net add/delete ratio makes sense (expect ~10 moves into archive, 12 moves into tests/utils, 4 deletions, 2 new docs, 1 new docs/decisions/, package.json + README updates).
- [x] 7.3 Run `npm test` one last time and confirm the same N tests as step 2.5 are passing.
- [x] 7.4 Spot-check that `miniprogram/utils/` now contains only the 8 production modules (`activity-utils.js`, `avatar-system.js`, `badge-data.js`, `birdData.js`, `birdingSpots.js`, `completeBirdData.js`, `points-system.js`, `school-data.js`).
- [x] 7.5 `git add -A && git commit` with a message that references this change name (`housekeeping-cleanup`).
