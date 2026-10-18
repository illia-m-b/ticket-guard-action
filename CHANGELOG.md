# Changelog

## [0.0.0](https://github.com/illia-m-b/ticket-guard-action/compare/v0.0.0...v0.0.0) (2026-10-18)


### Features

* **action:** introduce `Action` contract and `ticketGuard` object ([#141](https://github.com/illia-m-b/ticket-guard-action/issues/141)) ([04c15b6](https://github.com/illia-m-b/ticket-guard-action/commit/04c15b6e1386c28f9dc2b7b0a08d1c78a572cb77))
* **action:** wire runtime composition root and error handling in `index.ts` ([#150](https://github.com/illia-m-b/ticket-guard-action/issues/150)) ([2b1aa38](https://github.com/illia-m-b/ticket-guard-action/commit/2b1aa3852e7edaf6599e2ba0ad90474c9f5df28f))
* **backlog:** introduce `Backlog` and `Ticket` domain contracts with GitHub adapter ([#40](https://github.com/illia-m-b/ticket-guard-action/issues/40)) ([339d597](https://github.com/illia-m-b/ticket-guard-action/commit/339d597bcb27e32260e6829e3fe98e140d30c069))
* **check:** add envelope and chained check composite implementations ([#59](https://github.com/illia-m-b/ticket-guard-action/issues/59)) ([1cb53c1](https://github.com/illia-m-b/ticket-guard-action/commit/1cb53c1ec4affa014d5b8b1cc485fcacf14daec2))
* **check:** implement `ckTraceability` composite check ([#130](https://github.com/illia-m-b/ticket-guard-action/issues/130)) ([e56461e](https://github.com/illia-m-b/ticket-guard-action/commit/e56461ec9c7a717d32f8c88eafdbc504196b7b63))
* **check:** introduce `Check` contract, `ckOk`, `ckFailed`, and `fkCheck` ([#46](https://github.com/illia-m-b/ticket-guard-action/issues/46)) ([13fbd41](https://github.com/illia-m-b/ticket-guard-action/commit/13fbd411131e8c18ac2276b705147a739a6f2476))
* **check:** introduce `ckBypassed` check decorator ([#105](https://github.com/illia-m-b/ticket-guard-action/issues/105)) ([c075502](https://github.com/illia-m-b/ticket-guard-action/commit/c075502a4924a14e610366596bc1fb7f54e87bec))
* **check:** introduce `ckScope` check for repository scope validation ([#119](https://github.com/illia-m-b/ticket-guard-action/issues/119)) ([b00fbe5](https://github.com/illia-m-b/ticket-guard-action/commit/b00fbe538fedc52eaff2e10445306257877b1131))
* **check:** introduce all required labels check implementation ([#74](https://github.com/illia-m-b/ticket-guard-action/issues/74)) ([8c199d1](https://github.com/illia-m-b/ticket-guard-action/commit/8c199d1b2fe1967aa47a7559bb09aa81e47cd505))
* **check:** introduce any required label check implementation ([#76](https://github.com/illia-m-b/ticket-guard-action/issues/76)) ([6c21f36](https://github.com/illia-m-b/ticket-guard-action/commit/6c21f363babb4a554bae7cd0b7bf2e8c969c06d5))
* **check:** introduce author assignment check implementation ([#78](https://github.com/illia-m-b/ticket-guard-action/issues/78)) ([a527d20](https://github.com/illia-m-b/ticket-guard-action/commit/a527d201f315cf53cd2d692c6c6e6ce5518742c3))
* **check:** introduce ckWhen conditional check wrapper ([#102](https://github.com/illia-m-b/ticket-guard-action/issues/102)) ([cddfd30](https://github.com/illia-m-b/ticket-guard-action/commit/cddfd3009e557ee47bbc76830190a74aec5fa039))
* **check:** introduce forbidden labels check implementation ([#70](https://github.com/illia-m-b/ticket-guard-action/issues/70)) ([22c49d1](https://github.com/illia-m-b/ticket-guard-action/commit/22c49d180277a47ef24d2021139d0f9b86057227))
* **check:** introduce issue status check implementation ([#67](https://github.com/illia-m-b/ticket-guard-action/issues/67)) ([832c04e](https://github.com/illia-m-b/ticket-guard-action/commit/832c04e7c7e420712c917393f705d1e0dc342b3c))
* **check:** introduce reference presence check implementation ([#63](https://github.com/illia-m-b/ticket-guard-action/issues/63)) ([0cca38c](https://github.com/illia-m-b/ticket-guard-action/commit/0cca38c2c176662914884f4c2f81820e704cf39d))
* **check:** introduce required-labels check with strategy delegation ([#107](https://github.com/illia-m-b/ticket-guard-action/issues/107)) ([0a5cca8](https://github.com/illia-m-b/ticket-guard-action/commit/0a5cca8f570dbd4637c81a96bb7aa685b7ef1693))
* **check:** introduce ticket presence check implementation ([#65](https://github.com/illia-m-b/ticket-guard-action/issues/65)) ([9725675](https://github.com/illia-m-b/ticket-guard-action/commit/9725675fcdb1f86552d7ef3f8b77e4696de200e1))
* **grip:** introduce `Grip` type and its real-time and sticky implementations ([#86](https://github.com/illia-m-b/ticket-guard-action/issues/86)) ([3c38ec1](https://github.com/illia-m-b/ticket-guard-action/commit/3c38ec154a3a197f541df965b939280520b5161e))
* **inputs:** introduce action inputs contract and implementations ([#20](https://github.com/illia-m-b/ticket-guard-action/issues/20)) ([4ab419c](https://github.com/illia-m-b/ticket-guard-action/commit/4ab419c1d761c337ff0e6584c90ee36349b7474a))
* **outputs:** introduce `Outputs` contract, its realtime and fake implementations ([#137](https://github.com/illia-m-b/ticket-guard-action/issues/137)) ([04b3b3f](https://github.com/illia-m-b/ticket-guard-action/commit/04b3b3fc6f5825ba51c9c544621cf7787ed8f6bc))
* **pull-request:** introduce `PullRequest` interface and GitHub adapter ([#26](https://github.com/illia-m-b/ticket-guard-action/issues/26)) ([9c70c63](https://github.com/illia-m-b/ticket-guard-action/commit/9c70c630caa56f4ade85de29afbc7be9bcf11489))
* **reference:** implement `rfTargets` multi-target scanner ([#134](https://github.com/illia-m-b/ticket-guard-action/issues/134)) ([5e92482](https://github.com/illia-m-b/ticket-guard-action/commit/5e9248264bb1047258cccce71eb121517e43c9d0))
* **reference:** introduce issue reference contract and GitHub extractor ([#18](https://github.com/illia-m-b/ticket-guard-action/issues/18)) ([cddc481](https://github.com/illia-m-b/ticket-guard-action/commit/cddc48154c95bdc9939b5fd091c4864fb86ddac8))
* **repository:** introduce `Repository` coordinates contract, its plain text and url implementations ([#116](https://github.com/illia-m-b/ticket-guard-action/issues/116)) ([54ae0ef](https://github.com/illia-m-b/ticket-guard-action/commit/54ae0ef07963c7b113b997a68d600660f4409017))
* **sticky:** introduce sticky memoized supplier implementation ([#84](https://github.com/illia-m-b/ticket-guard-action/issues/84)) ([93f6f06](https://github.com/illia-m-b/ticket-guard-action/commit/93f6f069bc096c11da929af0b7d169bbb414d1be))


### Bug Fixes

* **readme:** correct action usage examples ([#166](https://github.com/illia-m-b/ticket-guard-action/issues/166)) ([2795185](https://github.com/illia-m-b/ticket-guard-action/commit/2795185f1a6c5c6416a08891904ccf7bb46cf40f))


### Continuous Integration

* **release:** automate releases with `release-please-action` ([#158](https://github.com/illia-m-b/ticket-guard-action/issues/158)) ([c378944](https://github.com/illia-m-b/ticket-guard-action/commit/c3789449a1cb5c949e5098a539bab6a525415404)), closes [#152](https://github.com/illia-m-b/ticket-guard-action/issues/152)
* **release:** configure release tags ([#163](https://github.com/illia-m-b/ticket-guard-action/issues/163)) ([da4c78a](https://github.com/illia-m-b/ticket-guard-action/commit/da4c78a45788a3fb51611dbeeaf0f78982e2c4e0))

## 0.0.0 (2026-10-18)


### Features


* **Issue Reference Extraction**: Automatically detect local issue numbers (`#42`), cross-repository references (`owner/repo#42`), and full GitHub issue URLs from pull request titles and descriptions.
* **Scope Boundary Enforcement**: Restrict accepted ticket references to `current-repo`, `same-org`, or `any` repository.
* **Lifecycle State Verification**: Enforce ticket status requirements (e.g. Link only `open` issues).
* **Label Governance**:
    * Assert mandatory issue labels using `require-all-labels: true` or `require-all-labels: false` (any-of matching).
    * Reject pull requests referencing tickets with forbidden labels (e.g. `wontfix`, `blocked`, `duplicate`).
* **Author Assignment Check**: Optional verification (`require-author-assigned: 'true'`) ensuring the pull request author is an assignee on the linked ticket.
* **Automated Bot Bypasses**: Automatically exempt automated actors (e.g. `dependabot[bot]`, `renovate[bot]`) from ticket validation.
* **Machine-Readable Outputs**: Export diagnostic status codes (`error-message`) and ticket metadata (`ticket-id`, `ticket-url`, `ticket-status`, `ticket-labels`, `is-valid`) for downstream workflow steps (e.g., sticky PR feedback comments).
