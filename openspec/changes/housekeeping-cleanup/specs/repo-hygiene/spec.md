## ADDED Requirements

### Requirement: Jest tests live under the `tests/` directory

The repository MUST keep all Jest test files (matching `*.test.js` or `*.integration.test.js`) under a `tests/` directory at the repo root, organized by subdirectory when the tests target a specific module family (e.g. `tests/utils/` for tests of files in `miniprogram/utils/`). Production source directories under `miniprogram/` MUST NOT contain `*.test.js` files.

#### Scenario: Production source is free of test files
- **WHEN** a developer runs `find miniprogram -name "*.test.js"`
- **THEN** no files are returned

#### Scenario: `npm test` discovers every test in the repo
- **WHEN** a developer runs `npm test` in the repo root
- **THEN** the discovered test count equals the count of `*.test.js` files anywhere under `tests/`
- **AND** every discovered test that was passing before the move is still passing

### Requirement: Historical and decision documents follow the `docs/` layout

The repository MUST keep active, normative documentation at the repo root or under `docs/decisions/`. Documents that record a specific historical debugging session, abandoned approach, or snapshot-in-time investigation MUST live under `docs/archive/<slug>/` and be accompanied by a `README.md` in that directory that points readers to the canonical decision doc under `docs/decisions/`.

#### Scenario: Root directory contains no archived debugging history
- **WHEN** a developer lists `*.md` files at the repo root
- **THEN** the list contains only currently-maintained documents (README, MVP_COMPLETE, PROJECT_SUMMARY, PROJECT_STATUS, DEVELOPMENT_GUIDE, CLOUD_DEPLOY_GUIDE, CHANGELOG, REAL_DATA_INFO, USAGE_NOTE)
- **AND** the legacy `EGRET_*`, `IMAGE_DISPLAY_*`, `SOLVE_IMAGE_DISPLAY_ISSUE.md`, `COMPLETE_EGRET_DISPLAY_SOLUTION.md`, `MAP_BIRD_ASSOCIATION.md`, `HOW_TO_DISPLAY_EGRET_IMAGE.md` files are NOT among them

#### Scenario: Archived saga has a pointer to the canonical decision
- **WHEN** a reader opens `docs/archive/2026-image-display-debug-saga/README.md`
- **THEN** the file lists the archived files, the date range, and a link to `docs/decisions/image-display.md`