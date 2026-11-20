<div align="center">

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | **한국어**

# ai-web-creator

**Claude와 대화하는 것만으로, 예전에는 웹 제작 회사에 맡기던 규모의 웹사이트를 만들고 공개하고 계속 운영하기 위한 스킬과 프롬프트**

[![check-skills](https://img.shields.io/github/actions/workflow/status/tkc310/ai-web-creator/check-skills.yml?branch=main&label=check-skills&logo=githubactions&logoColor=white)](https://github.com/tkc310/ai-web-creator/actions/workflows/check-skills.yml)
[![Release](https://img.shields.io/github/v/release/tkc310/ai-web-creator?label=release&logo=github)](https://github.com/tkc310/ai-web-creator/releases/latest)
[![Release date](https://img.shields.io/github/release-date/tkc310/ai-web-creator?label=released)](https://github.com/tkc310/ai-web-creator/releases)
[![Last commit](https://img.shields.io/github/last-commit/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/commits/main)
[![Commit activity](https://img.shields.io/github/commit-activity/m/tkc310/ai-web-creator)](https://github.com/tkc310/ai-web-creator/pulse)
[![License: Proprietary](https://img.shields.io/badge/license-proprietary-lightgrey)](LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/tkc310/ai-web-creator?style=flat&logo=github&label=stars)](https://github.com/tkc310/ai-web-creator/stargazers)
[![Issues](https://img.shields.io/github/issues/tkc310/ai-web-creator?logo=github)](https://github.com/tkc310/ai-web-creator/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/tkc310/ai-web-creator?logo=github)](https://github.com/tkc310/ai-web-creator/pulls)
![README languages](https://img.shields.io/badge/README-EN%20%7C%20JA%20%7C%20ZH--CN%20%7C%20ZH--TW%20%7C%20KO-informational)

[![Claude](https://img.shields.io/badge/agent-Claude-D97757?logo=claude&logoColor=white)](https://claude.ai/)
[![Agent Skills](https://img.shields.io/badge/format-Agent_Skills-D97757?logo=anthropic&logoColor=white)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
[![design-nexus](https://img.shields.io/badge/design-design--nexus-6E56CF?logo=github&logoColor=white)](https://github.com/tkc310/design-nexus)
[![Astro](https://img.shields.io/badge/site-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Cloudflare Workers](https://img.shields.io/badge/hosting-Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Node.js LTS](https://img.shields.io/badge/runtime-Node.js_LTS-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/package-pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Lighthouse](https://img.shields.io/badge/quality-Lighthouse-F44B21?logo=lighthouse&logoColor=white)](https://developer.chrome.com/docs/lighthouse)

이 스킬이 도움이 되었다면 저장소에 ⭐ Star를 눌러 주시면 큰 힘이 됩니다.

[빠른 시작](#빠른-시작) ・ [특징](#특징) ・ [문서](#문서) ・ [스킬 구성](#스킬-구성) ・ [피드백](#피드백) ・ [라이선스](#라이선스)

</div>

---

웹사이트(랜딩 페이지, 기업 사이트, 블로그, 미디어 사이트)의 제작, 공개, 지속적인 운영을 AI 에이전트 Claude에게 맡기기 위한 스킬과 프롬프트입니다. IT에 익숙하지 않은 사람도 Claude와 대화하는 것만으로 안전하고 디자인이 좋은 사이트를 가질 수 있도록 하는 것을 목표로 합니다.

> [!IMPORTANT]
> 이 저장소는 누구나 읽을 수 있지만 오픈 소스가 아닙니다. note에서 판매하는 해설 기사 중 이 스킬의 이용 허락이 포함된다고 기사에 명시된 것(기사를 묶은 매거진 포함)을 구매한 분만 사용할 수 있습니다. 조건은 [LICENSE](LICENSE)와 이 페이지의 「[라이선스](#라이선스)」를 확인해 주세요.

> [!NOTE]
> 스킬, 문서, 프롬프트는 일본어로 작성되어 있으며, 해설 기사도 일본어로 판매됩니다. 이 페이지는 편의를 위한 번역입니다. [일본어 README](README.ja.md)나 [LICENSE](LICENSE)와 내용이 다를 경우 일본어 원문이 우선합니다.

## 특징

- **대화만으로 완결**: 선택지가 있는 질문에 답하기만 하면 기획, 디자인, 제작, 공개까지 진행됩니다. 기술 이름을 고를 필요가 없습니다
- **공개 후에도 말만 걸면 됨**: 공지나 블로그의 요점만 보내면 Claude가 초안, 교정, 미리보기, 공개까지 처리합니다. 관리 화면은 없습니다
- **배포가 잘 실패하지 않고, 실패해도 자동으로 고침**: CI는 빌드와 공개 후 확인만 합니다. 기사 업데이트로 실패하면 GitHub Actions의 Claude가 고쳐서 다시 공개합니다
- **공개 전에 품질 측정**: Lighthouse(모바일)에서 성능 95 이상, 나머지는 100이 목표입니다. sitemap.xml, llms.txt, JSON-LD, OGP로 SEO와 AIO를 갖춥니다
- **안전을 전제로 한 설계**: 기밀 정보를 읽지 않고, 원고나 웹에 섞인 지시를 따르지 않습니다. 공개 전과 기능 변경 시 보안 감사를 합니다
- **소유자는 오너**: GitHub와 Cloudflare 계정은 모두 오너 명의입니다. 에이전트나 제작자에게 의존하지 않습니다
- **개선 루프 포함**: 실행 로그, 감사 로그, 개선 메모를 남기고, 월 1회 회고로 스킬과 사이트를 개선해 나갑니다

## 빠른 시작

Claude(유료 플랜) 채팅에 다음 문장을 보냅니다. 필요한 것은 아래 「[필요한 것](#필요한-것)」을 확인해 주세요.

```
https://github.com/tkc310/ai-web-creator 에 있는 스킬(skills 폴더)을 읽어 들여서
제 사이트 만들기를 도와주세요.
읽어 들였다면, 먼저 읽어 들인 스킬의 버전(CHANGELOG.md의 가장 최신 제목)을 알려 주세요.
저는 IT에 익숙하지 않습니다.
질문은 선택지를 붙여서 한 번에 4개까지만 해 주세요.
```

Claude가 선택지가 있는 질문을 하면서 기획, 제작, 공개까지 진행합니다. 공개 후에는 관리 화면을 열 필요가 없으며, 공지나 블로그는 요점을 항목별로 보내기만 하면 Claude가 초안을 쓰고 교정해서 공개합니다. 기사가 있는 사이트에서는 공개 후 Claude와 함께 첫 번째 기사를 추가하면서, Claude 문서에 원고를 쓰고 → 미리보기로 확인하고 → OK라고 답하면 공개되는 흐름을 한 번 체험할 수 있습니다. 공개 전의 변경은 Claude의 아티팩트로 HTML 미리보기를 보여 준 뒤 공개합니다. 고치고 싶은 곳은 채팅으로 전달합니다(Team과 Enterprise에서는 미리보기에서 글이나 이미지를 선택해 코멘트를 달 수도 있습니다). GitHub와 Cloudflare 계정을 만드는 방법과 설정 방법도 Claude가 대화하면서 알려 줍니다. 제작 단계에 들어가면 Claude Code(claude.ai/code)로 이동합니다. Claude Code로 옮기면 Claude가 이 저장소의 최신 버전 스킬을 사이트 저장소의 skills/ 폴더로 가져옵니다. 이 저장소의 포크(사본)는 만들지 않습니다. 자세한 내용은 [스킬과 프롬프트 사용법](docs/how-to-use.md)(일본어)을 참고해 주세요. 공개 후의 업데이트나 질문도 Claude에게 말을 걸기만 하면 됩니다. 다른 요청 방법은 [prompts/README.md](prompts/README.md)(일본어)에 있습니다.

## 필요한 것

- Claude 유료 플랜(Pro 또는 Max). Team과 Enterprise에서도 사용할 수 있지만, Claude Code 프로젝트를 사용하지 않는 절차로 진행합니다([project-setup.md](skills/web-creator/references/project-setup.md)). 제작을 마친 뒤 정적 사이트는 업데이트하지 않는 달에 무료 플랜(Free)으로 내릴 수 있습니다(아래 「[주의](#주의)」)
- GitHub 계정(무료 플랜이면 됨)
- Cloudflare 계정(무료 플랜이면 됨)
- 사이트 주소로 쓸 도메인(없으면 도중에 취득)
- Claude 설정의 「Capabilities」에서 「Code execution and file creation」이 켜져 있을 것(GitHub에서 스킬을 읽어 들이는 데 사용합니다. 켤 수 없을 때의 방법은 [how-to-use.md](docs/how-to-use.md)의 「段階1」)

GitHub와 Cloudflare 계정은 작업 도중에 Claude가 만드는 방법을 안내합니다. 둘 다 한 사람당 하나의 로그인으로 사용하며, 회사 사이트는 GitHub 저장소를 회사의 Organization에 둡니다(GitHub 약관상 하나의 로그인을 여러 사람이 함께 쓸 수 없기 때문입니다. [account-setup.md](skills/web-creator/references/account-setup.md)). 자동 수정용 키는 선택 사항이며, 설정하지 않아도 공개할 수 있습니다(아래 「[주의](#주의)」). 방문자 수는 자체 도메인을 연결했을 때부터 Cloudflare Web Analytics(무료, Cookie를 사용하지 않음)로 집계하기 시작합니다([analytics.md](skills/web-creator/references/analytics.md)).

## 지원하지 않는 것

회사나 가게 소개 사이트, 랜딩 페이지, 블로그, 기사가 수천 개 이내인 미디어처럼 「정보를 보여 주는 사이트」가 대상입니다. 다음은 지원하지 않습니다. 그런 경우에도 웹 제작 회사에 넘길 시안이나 사양서를 만드는 데는 쓸 수 있습니다.

- 기사가 수천 개를 넘는 미디어
- 수탁 제작으로, 공개 후 고객이 관리 화면에서 글을 올리는 사이트(이 스킬로 만드는 사이트에는 관리 화면이 없으며, 업데이트는 Claude에게 요청합니다)
- 방문자가 가입하는 회원 기능, 방문자가 작성하는 댓글 기능
- 온라인 쇼핑몰(EC), 결제, 예약 시스템 같은 업무 시스템

## 문서

모든 문서는 일본어입니다.

- [Claude 계정 등록 가이드](docs/claude-account.md): 계정 만들기, 유료 플랜, 처음에 해 둘 설정, GitHub 연결 방법
- [스킬과 프롬프트 사용법](docs/how-to-use.md): 상담부터 제작, 공개, 운영까지의 진행 방법
- [문의 폼 만드는 법](docs/forms.md): Google 폼(링크, 임베드)과 사이트와 같은 디자인의 폼(Cloudflare Email Sending) 도입 방법, 다른 서비스 소개와 주의점
- [Cursor나 ChatGPT에서 사용하기](docs/other-agents.md): Claude 이외의 에이전트에서 스킬을 읽어 들이는 방법과 Claude에만 있는 기능의 대체

## 사용하는 모델

사용하는 모델과 생각의 깊이(effort) 구분은 [versions.md](skills/web-creator/references/versions.md)에 정리되어 있습니다. 기획과 디자인은 effort high, 구축(제작, 업데이트, 유지보수, 자동 수정)은 effort medium입니다. 설정은 스킬의 frontmatter, 서브에이전트 정의(templates/claude/agents/site-builder.md), 사이트 저장소의 `.claude/settings.json`, 자동 수정 워크플로의 인수에서 하며, 같은 값을 어디에 쓰고 있는지도 versions.md에 목록으로 정리되어 있습니다.

## 구성 요소

| 폴더 | 내용 |
|---|---|
| [skills/web-creator](skills/web-creator/SKILL.md) | 사이트 제작 전체를 진행하는 스킬. 히어링, 기술 선정, 계정 준비, 디자인과 제작, 공개 전 품질 점검, 공개, 자동 수정 |
| [skills/site-content-update](skills/site-content-update/SKILL.md) | 공개 후 기사와 공지 업데이트. 채팅, Google 문서, Claude 문서에서 원고를 읽어 공개합니다. 원고 위치 지정이 없으면 Claude 문서에 원고를 쓰게 하고, 미리보기에서 「OK」를 받은 뒤 공개합니다(표준 흐름) |
| [skills/site-maintenance](skills/site-maintenance/SKILL.md) | 유지보수가 필요한 구성의 사이트 정기 유지보수. 매월 1일과 15일에 스택을 최신으로 합니다. 작은 업데이트(패치와 마이너)는 확인 후 main에 넣고, 큰 업데이트(메이저와 GitHub Actions)는 풀 리퀘스트로 남겨 오너의 OK를 기다립니다 |
| [skills/site-review](skills/site-review/SKILL.md) | 실행 로그 회고. 개선점을 정리해 고치고, 오래된 로그는 월별로 요약해 삭제합니다. Claude를 무료 플랜으로 내리기 전 확인과 Pro로 되돌린 날의 작업도 여기서 합니다 |
| [tkc310/design-nexus](https://github.com/tkc310/design-nexus)(참조) | 디자인 스킬. 세 가지 안과 토큰 계획으로 방향을 정하고, DESIGN.md로 디자인을 통일하며, lint와 렌더 체크로 확인합니다. 이 저장소에는 두지 않고, 가져올 때 [external-skills.txt](skills/web-creator/references/external-skills.txt)의 버전을 사이트의 skills/design-nexus로 받아 옵니다 |
| [skills/runtime-update](skills/runtime-update/SKILL.md) | Node.js(최신 LTS), pnpm, 의존 패키지를 최신으로, Workers의 compatibility_date를 새롭게 유지합니다 |
| [prompts](prompts/README.md) | 사이트 오너가 복사해서 쓰는 프롬프트 모음 |
| [docs/verification](docs/verification/README.md) | 구성 검증 기록. 스킬에 넣기 전에 샘플을 만들어 측정한 결과를 남깁니다 |
| [.github](.github/workflows/check-skills.yml) | 이 저장소 자체의 점검(Markdown 안 bash 문법, YAML, check_text.py, MANIFEST.txt, 오래된 구성의 기술이 되살아나지 않았는지), 릴리스 워크플로, 개선점을 보내는 Issue 양식. 사이트 저장소에는 복사하지 않습니다 |

## 스킬 구성

```
skills/
├── web-creator/
│   ├── SKILL.md                 … 전체 진행 방식과 오너와의 대화 방법
│   ├── references/              … 단계별 상세(필요할 때 읽음)
│   │   ├── hearing.md
│   │   ├── stack-selection.md   … 모두 Astro. 지원 대상 여부, 정적인지 일부 SSR인지 판정
│   │   ├── versions.md          … 모델과 버전의 기준(다른 파일은 여기를 참조)
│   │   ├── external-skills.txt  … 참조하는 스킬(design-nexus)의 버전
│   │   ├── skills-install.md    … 스킬을 사이트 저장소의 skills/에 가져오고 업데이트
│   │   ├── account-setup.md
│   │   ├── connectors.md        … Cloudflare와 Google 조작에 쓰는 커넥터(MCP)
│   │   ├── project-setup.md     … 사이트별 Claude 프로젝트
│   │   ├── build.md
│   │   ├── quality-gate.md
│   │   ├── deploy-and-autofix.md … 공개, 공개 후 확인, 자동 수정(변경 가능한 범위와 횟수 상한)
│   │   ├── forms.md             … 문의 폼(Google 폼 / Cloudflare Email Sending)
│   │   ├── analytics.md         … 접속 분석(Cloudflare Web Analytics)
│   │   ├── migration.md         … WordPress나 STUDIO에서 이전
│   │   ├── client-handoff.md    … 수탁 제작에서 고객에게 사이트를 넘길 때(skills/를 제거하는 절차)
│   │   ├── preview.md
│   │   ├── article-tutorial.md  … 공개 후 오너와 첫 번째 기사를 추가하는 튜토리얼
│   │   ├── run-logs.md          … 실행 로그와 개선 루프
│   │   ├── audit-log.md         … 감사 로그
│   │   ├── security-audit.md    … 공개 전과 기능 변경 시 보안 감사
│   │   └── security-rules.md    … 안전을 위한 규칙(모든 스킬 공통)
│   ├── scripts/                 … fetch_external_skills.sh(design-nexus 가져오기), run_lighthouse.sh, check_mobile_width.py(iPhone SE 폭 확인), make_preview.py, check_text.py(기밀 정보와 오염 점검)
│   └── templates/               … SITE.md, AGENTS.md.tmpl과 CLAUDE.md.tmpl(사이트 루트에 둘 때 .tmpl을 뗌), 프로젝트 지시, 인계 문장(handoff.md), 로그, IMPROVEMENTS.md, 워크플로, smoke-test.txt와 scripts/smoke.sh(공개 후 확인), dependabot.yml(GitHub Actions만), pnpm-workspace.yaml, llms.txt, JSON-LD, 폼(forms/) 등
├── site-content-update/
│   ├── SKILL.md                 … 기사와 공지 추가의 표준 흐름
│   ├── scripts/                 … optimize_images.py(사진 메타데이터 삭제와 경량화)
│   └── templates/               … article-draft.md(Claude 문서 원고 템플릿)
├── site-maintenance/
│   ├── SKILL.md
│   └── references/              … 루틴 만드는 법과 프롬프트
├── site-review/
│   └── SKILL.md                 … 회고와 오래된 로그의 요약, 삭제
├── runtime-update/
│   └── SKILL.md
└── (design-nexus/)              … 디자인 스킬. 이 저장소에는 두지 않고, 사이트로 가져올 때 tkc310/design-nexus에서 받아 옴
```

## 설계 방침

### 사이트는 모두 Astro로 만든다

한 페이지짜리 랜딩 페이지도, 기사가 있는 사이트도 Astro로 만듭니다. 만드는 방법이 하나이므로, 나중에 랜딩 페이지에 공지나 페이지를 추가할 때도 같은 저장소에 추가하기만 하면 됩니다. 기술 이름은 오너가 고르지 않고, 에이전트가 다음 사항만 정합니다([stack-selection.md](skills/web-creator/references/stack-selection.md)).

- 지원 대상이 아닌지(위의 「[지원하지 않는 것](#지원하지-않는-것)」)
- 모든 페이지를 정적으로 출력(SSG)할지, 일부 페이지만 SSR로 할지. 기본은 SSG이며, 문의 폼 전송 처리처럼 접속할 때마다 처리가 필요한 페이지만 SSR로 합니다
- 페이지 형태(한 페이지 / 여러 페이지 / 기사 있음)

기사가 많은 미디어도 수천 개까지는 Astro의 정적 빌드로 충분합니다(3,000개에 약 7초, 1만 개에 약 18초. [검증 기록](docs/verification/2026-10-25_media-json-ssr/README.md)). 수천 개를 넘는 미디어를 대상에서 제외한 것은 빌드 시간 때문이 아니라, 기사 검색과 정리를 Markdown 파일로 계속하는 부담이 커지기 때문입니다.

회원 기능과 댓글 기능은 개인 정보의 보관이나 운영을 잘못하면 보안 구멍이 되기 쉽고, 개발에 익숙하지 않은 사용자에게는 권할 수 없기 때문에 대상에서 제외했습니다.

### 유지보수가 필요한 구성은 매월 2회 자동으로 유지보수한다

일부 페이지를 SSR로 한 경우, 공개된 사이트에서 의존 패키지의 코드가 실행되므로 「유지보수가 필요한 구성」으로 다룹니다.

- Claude의 예약 작업(옛 명칭: 루틴)이 매월 1일과 15일에 실행되어 Node.js(최신 LTS), pnpm, 의존 패키지를 최신으로, Workers의 compatibility_date를 새롭게 합니다. 작은 업데이트(패치와 마이너)는 빌드와 확인이 통과하면 main에 넣습니다. 큰 업데이트(메이저와 GitHub Actions)는 풀 리퀘스트로 남겨 두고, 다음 대화에서 오너의 OK를 받은 뒤 넣습니다. 사람이 없는 실행에서는 풀 리퀘스트를 머지하지 않습니다([site-maintenance](skills/site-maintenance/SKILL.md), [runtime-update](skills/runtime-update/SKILL.md))
- 공개된 지 3일이 지나지 않은 버전은 넣지 않습니다(탈취된 버전을 공개 직후에 넣는 공격을 피하기 위해). 취약점은 `pnpm audit`으로 확인하고 심각한 것부터 고칩니다
- Dependabot은 GitHub Actions 업데이트에만 사용합니다(이유는 [versions.md](skills/web-creator/references/versions.md)의 「時点つきの事実」). Dependabot의 풀 리퀘스트는 자동으로 머지하지 않고, 유지보수나 회고 때 Claude가 변경 내용을 읽고 오너에게 확인합니다
- 유료 플랜이나 새로운 Cloudflare 서비스가 필요한 업데이트, 라이선스가 바뀌는 업데이트는 자동으로 머지하지 않고 오너에게 확인합니다

정적인 페이지만 있는 사이트는 공개된 사이트에서 의존 패키지가 실행되지 않으므로 이 유지보수를 설정하지 않습니다. 대신 월 1회 회고([site-review](skills/site-review/SKILL.md)) 안에서 같은 방식으로 최신으로 합니다.

### 스택은 항상 최신 버전을 사용한다

Node.js는 최신 LTS(Node.js 공식이 프로덕션용으로 권장하는 버전. LTS가 되기 전의 Current와 홀수 버전은 쓰지 않음), 패키지 관리는 pnpm 최신 버전, 의존 패키지도 최신 버전으로 만들고, 위의 유지보수와 회고로 최신 상태를 유지합니다(기준은 [versions.md](skills/web-creator/references/versions.md), 만드는 방법은 [build.md](skills/web-creator/references/build.md)의 「使うツールとバージョン」).

### 개발은 클라우드에서, 공개는 GitHub와 Cloudflare로

개발은 에이전트의 클라우드 환경에서 하며, 오너의 컴퓨터에는 개발 도구를 설치하지 않습니다. 사이트의 내용은 GitHub에 저장하고, GitHub Actions에서 Cloudflare Workers로 공개합니다. 계정은 모두 오너 명의(회사 사이트라면 GitHub는 회사의 Organization)로 만들기 때문에 에이전트나 제작자에게 의존하지 않습니다.

### 스킬은 사이트 저장소로 가져온다

제작에 들어갈 때 Claude가 이 저장소의 최신 버전(태그. 태그가 없는 동안은 main의 커밋 하나를 정해 고정)을 사이트 저장소의 `skills/`에 복사하고, 버전을 `skills/VERSION`에 기록합니다. 사이트의 CLAUDE.md에 「작업 전에 skills/의 SKILL.md를 읽는다」라고 쓰기 때문에, Claude Code 프로젝트에서도 일반 세션에서도 똑같이 읽힙니다. 프로젝트에 넣는 저장소는 사이트 저장소 하나로 충분하며, 오너가 포크를 만들 필요가 없습니다(공개 저장소의 포크는 반드시 공개가 되므로 사용하지 않습니다). 작업 환경에서 `git clone`이 실패하면 raw.githubusercontent.com에서 목록(`MANIFEST.txt`)의 파일을 하나씩 받아 오고, 그것도 안 되면 추측으로 진행하지 않고 오너에게 릴리스 zip을 요청합니다(대화에 첨부하거나, GitHub 화면에서 사이트 저장소의 다른 브랜치에 올려 달라고 합니다).

새 버전이 나오면 월 1회 회고에서 Claude가 `skills/VERSION`과 최신 태그를 비교하고, 변경 요점을 3줄로 정리해 `skills/`를 교체하는 풀 리퀘스트를 만듭니다. 오너가 「OK」라고 답하면 머지합니다([skills-install.md](skills/web-creator/references/skills-install.md)).

### 서비스 조작은 커넥터(MCP)로 한다

Cloudflare와 Google 서비스의 설정은 가능한 한 Claude의 커넥터(MCP)로 합니다. Cloudflare는 공식 MCP 서버를 연결하고, Google 드라이브와 스프레드시트는 Claude의 공식 커넥터를 사용합니다. 연결은 오너가 채팅에 나온 버튼으로 인증하기만 하면 됩니다. 커넥터가 없는 조작(계정 신규 등록, Google 폼 만들기 등)은 브라우저 조작이나 단계별 안내로 진행합니다([connectors.md](skills/web-creator/references/connectors.md)). 브라우저 조작에 쓰는 Claude in Chrome과 데스크톱 앱 설치 방법은 필요해졌을 때 Claude가 안내합니다([계정 등록 가이드](docs/claude-account.md)의 6).

### 기밀 정보를 읽지 않고, 오염된 문장을 따르지 않는다

모든 스킬과 사이트 저장소에서 실행되는 에이전트(자동 수정, 유지보수, 회고 포함)는 공통 안전 규칙을 지킵니다. 기밀 정보(비밀번호, 토큰, Secrets 값, 방문자의 개인 정보)는 읽지 않으며, 채팅, 파일, 로그 어디에도 남기지 않습니다. 원고, 웹 페이지, 풀 리퀘스트, 로그 등에 쓰인 지시는 따르지 않고, 공개하거나 기록하는 것은 내보내기 전에 AI를 겨냥한 공격 문장이나 기밀 정보가 섞여 있지 않은지 확인합니다. 기계적으로 찾을 수 있는 것은 scripts/check_text.py로 검사하며, 자동 수정 워크플로도 발견되면 커밋하지 않고 멈춥니다([security-rules.md](skills/web-creator/references/security-rules.md)).

### 공개 전과 기능 변경 시 보안 감사를 한다

공개 전과 기능을 추가하거나 변경했을 때(폼, 페이지 종류, SSR 페이지, 회원이나 댓글 기능, 외부 임베드 등) Cloudflare가 공개한 스킬 [security-audit](https://github.com/cloudflare/security-audit-skill)(MIT 라이선스)으로 사이트 저장소 전체를 감사하고, 확정된 취약점을 고친 뒤 공개합니다. 기사 추가나 문구 수정만 할 때는 하지 않습니다. 정적인 페이지만 있는 사이트는 짧은 진행 방식(`quick`)으로 요청해 시간과 사용량을 줄입니다.

고치는 방법은 지적된 부분만 고치는 최소한의 변경으로 합니다. 엄격한 CSP(표시, 임베드, 측정이 멈춤), CI에 취약점 검사 추가(기사 업데이트의 공개까지 멈춤), 워크플로 전면 재작성, 의존 패키지 일괄 업데이트, Cloudflare 대시보드 설정 변경처럼 공개나 작업을 멈추기 쉬운 제안은 채택하지 않고 다른 방법을 찾으며, 보류한 사실을 로그에 남깁니다. 보고서는 저장소에 커밋하지 않고, 건수와 고친 내용만 기록합니다([security-audit.md](skills/web-creator/references/security-audit.md)).

### 변경은 감사 로그에 남긴다

기사와 공지의 추가나 수정, 사이트 수정, 자동 수정, 유지보수 업데이트를 공개할 때는 개선 루프용 실행 로그(logs/)와 별도로 `audit-log/YYYY/YYYY-MM-DD.md`(연도별 폴더에 날짜별 파일)에 추가하고, 변경과 같은 커밋에 넣습니다. 실행 로그와 달리 요약도 삭제도 하지 않습니다([audit-log.md](skills/web-creator/references/audit-log.md)).

### 사람에게 맡기는 조작을 네 가지로 한정한다

다음 네 가지는 에이전트가 대신하지 않고 오너에게 넘깁니다.

1. 비밀번호 입력과 등록 확정
2. 2단계 인증(QR 코드와 복구 코드가 표시되는 화면 포함. 복구 코드는 오너가 보관하고 어디에도 적지 않음)
3. 결제, 약관 동의, 외부 서비스 권한 허용(GitHub 앱 설치, 커넥터 연결)
4. API 토큰 등 비밀 문자열 붙여넣기

조작 목록과 총 소요 시간(30~40분 정도)은 시작하기 전에 오너에게 보여 줍니다([account-setup.md](skills/web-creator/references/account-setup.md)의 「オーナーの操作の一覧」).

도메인 전환이나 기존 사이트 삭제처럼 되돌릴 수 없는 조작은 무슨 일이 일어나는지 설명하고 오너의 동의를 받은 뒤 진행합니다.

### 배포가 잘 실패하지 않게 하고, 실패해도 자동으로 고친다

CI에서 확인하는 것은 「빌드가 통과하는지」와 공개 후 주요 페이지를 볼 수 있는지뿐입니다. 공개 후 확인에서는 사이트 저장소의 `.github/smoke-test.txt`에 적은 페이지가 200(줄마다 `405` 같은 상태도 지정 가능)을 반환하고 정해진 문자를 포함하는지 확인합니다. Cloudflare의 보안 확인 화면이 반환된 페이지는 실패가 아니라 경고로 처리합니다(`.github/scripts/smoke.sh`). 풀 리퀘스트에서는 모든 사이트에서 빌드만 확인합니다. 린터와 테스트는 에이전트가 작업 중에 실행합니다.

빌드나 공개 단계에서 실패하면 GitHub Actions에서 Claude가 원인을 조사해 고치고 다시 공개합니다([autofix.yml](skills/web-creator/templates/github/workflows/autofix.yml)). Claude가 바꿀 수 있는 것은 기사, 이미지, 로그(`src/content/`, `src/assets/`, `public/`의 이미지, `logs/`, `audit-log/`)뿐입니다. 원인이 페이지 부품이나 레이아웃(.astro), 설정(package.json, astro.config.* 등)에 있거나 범위 밖의 파일을 바꾼 경우에는 push하지 않고 Issue로 오너에게 알린 뒤 멈춥니다. 오너는 그 Issue를 Claude에게 보여 주고 고쳐 달라고 합니다. 자동 수정은 24시간에 3회까지이며, 자동 수정 Issue(라벨 autofix)가 열려 있는 동안에는 실행되지 않습니다. Claude를 실행하지 않는 알림 Issue(라벨 deploy-notice)는 열려 있어도 자동 수정을 막지 않습니다. 자동 수정용 키가 거부되었을 때(Claude를 무료 플랜으로 내린 달 등)는 「Claude를 사용할 수 없어 자동 수정이 멈춰 있습니다. Pro로 되돌리거나 GitHub 화면에서 고쳐 주세요」라는 Issue(라벨 autofix-paused)를 하나만 만들고, 이후에는 코멘트를 추가합니다. 이 Issue도 자동 수정을 막지 않으며, 자동 수정이 다시 실행되면 닫습니다.

deploy 워크플로는 빌드(build), 공개(publish), 공개 후 확인(smoke)의 세 작업으로 나뉘어 있으며, autofix는 어느 작업이 실패했는지에 따라 동작을 바꿉니다. Claude를 실행하는 것은 빌드가 실패했을 때뿐입니다. 공개 단계만의 실패(Cloudflare 키 만료 등)와 공개 후 확인만의 실패(사이트는 새 버전으로 공개되어 있음)는 Claude를 실행하지 않고 Issue로 알립니다. Issue에는 공개 중인 사이트가 이전 버전인지 새 버전인지, Claude가 조사한 원인, 오너가 Claude에게 보낼 요청 문장을 적습니다. 되돌릴 때는 Claude에게 요청합니다([deploy-and-autofix.md](skills/web-creator/references/deploy-and-autofix.md)의 「表示がおかしいときに戻す」). 빌드나 공개 단계에서 실패한 경우에는 Cloudflare의 이전 사이트가 그대로 표시됩니다. 자동 수정용 키를 설정하지 않은 사이트에서는 Claude가 실행되지 않고 Issue로 알리기만 합니다.

### 디자인은 design-nexus 스킬로 정하고 다듬으며, iPhone SE 폭까지 확인한다

디자인 안 만들기부터 마무리까지 작성자가 공개한 [design-nexus](https://github.com/tkc310/design-nexus) 스킬로 진행합니다. 주제에 뿌리를 둔 세 가지 안 중에서 오너가 고르고, 색과 서체 토큰을 DESIGN.md에 모아 페이지 간 디자인을 통일하며, lint와 렌더 체크로 접근성의 최저선을 확인한 뒤 강평으로 마무리합니다. 템플릿 같은 모습을 피하기 위해서입니다. 이 저장소에는 복사하지 않고, 사이트로 스킬을 가져올 때 정해 둔 버전([external-skills.txt](skills/web-creator/references/external-skills.txt))을 받아 사이트의 skills/design-nexus에 두므로, 오너가 스킬을 활성화하는 조작은 필요 없습니다. 스마트폰 표시는 일반적인 iPhone 폭뿐 아니라 iPhone SE 폭(375px)과 320px에서도 가로 스크롤, 넘침, 헤더나 버튼의 줄바꿈이 없는지를 [check_mobile_width.py](skills/web-creator/scripts/check_mobile_width.py)와 스크린샷으로 확인합니다([build.md](skills/web-creator/references/build.md)).

### 공개 전에 품질을 측정한다

Lighthouse(모바일)에서 성능 95 이상, 접근성, 권장사항, SEO는 100을 목표로 합니다. sitemap.xml, robots.txt, llms.txt, 구조화 데이터(JSON-LD), OGP를 갖춥니다. 구조화 데이터에는 페이지에 표시하는 내용만 적습니다. 측정은 Claude의 클라우드 작업 환경에서 톱 페이지 등 주요 페이지(페이지 종류별 대표 하나)만 하며, 공개 후에는 실제 사이트에서도 측정합니다. 작업 환경에서 실제 사이트에 접근할 수 없으면 채팅과 Code 중 어느 쪽을 쓰는지 물은 뒤, Claude가 네트워크 허용 목록에 사이트 주소를 추가하는 절차를 안내합니다. 기준의 자세한 내용은 [quality-gate.md](skills/web-creator/references/quality-gate.md)에 있습니다.

### 사이트마다 Claude 프로젝트를 만든다

제작과 운영은 사이트마다 만드는 Claude Code 프로젝트 안에서 진행합니다. 프로젝트 지시에 오너의 환경(컴퓨터, 브라우저, 원고 보관 위치 등)과 작업 규칙을 적어 두므로, 대화할 때마다 다시 설명할 필요가 없습니다. 오너는 프로젝트 대화에 요청을 쓰기만 하면 됩니다. 프로젝트를 쓸 수 없는 계정에서는 같은 내용을 SITE.md에 적고 새 세션에서 요청합니다([project-setup.md](skills/web-creator/references/project-setup.md)).

### 공개 후에도 인계할 수 있게 한다

사이트 저장소에는 인계 메모(SITE.md), 오너용 설명(README.md), 실행 로그(logs/), 스킬 사본(skills/)을 둡니다. 다른 날 새 대화를 시작해도 에이전트는 SITE.md를 읽고 이어서 작업할 수 있습니다.

### 실행 로그로 개선 루프를 돌린다

에이전트가 실행될 때마다(오너의 요청, 자동 수정, 유지보수, 회고) 사이트 저장소의 logs/에 실행 로그를 하나 씁니다. 다음에 고칠 가치가 있는 점은 logs/IMPROVEMENTS.md에 모아 다음 작업 전에 읽습니다. 월 1회 회고([site-review](skills/site-review/SKILL.md))에서 개선점을 정리하고, 보관 기간(기본 90일)이 지난 로그는 월별로 요약해 삭제합니다. 스킬 쪽 개선점도 사이트의 logs/IMPROVEMENTS.md에 종류 「スキル」로 남기는 것까지가 기본입니다. 배포처로 보내는 것은 선택이며, 보낼 경우 오너의 동의를 받고 개인 정보를 제거한 뒤 note 창구나 이 저장소의 Issue로 보냅니다([run-logs.md](skills/web-creator/references/run-logs.md)).

## 주의

- 요금과 서비스 사양은 바뀝니다. 스킬 안의 수치는 작성 시점의 것이며, 에이전트는 작업할 때 최신 정보를 확인합니다
- 자동 수정용 키(`CLAUDE_CODE_OAUTH_TOKEN` 또는 `ANTHROPIC_API_KEY`)는 선택 사항입니다. 설정하지 않으면 실패했을 때 Issue(와 GitHub 메일)로 알리기만 합니다. `CLAUDE_CODE_OAUTH_TOKEN`을 발급하려면 컴퓨터에 Claude Code를 설치하고 명령을 한 줄 입력해야 합니다([account-setup.md](skills/web-creator/references/account-setup.md)의 3)
- 유지보수 루틴은 Claude의 예약 작업으로 실행되므로 Claude 사용량을 씁니다(Pro 이상 플랜에서 사용 가능)
- 정적 사이트는 업데이트하지 않는 달에 Claude를 무료 플랜(Free)으로 내릴 수 있습니다. Free에서는 Claude Code와 예약 작업을 쓸 수 없습니다([요금 페이지](https://claude.com/pricing), 2026-10-31 확인). 사이트 표시와 GitHub 화면에서 고친 문장의 공개는 계속됩니다. 월 1회 회고, 예약 게시, 자동 수정(Claude 플랜 키인 경우)은 멈춥니다. 유지보수가 필요한 구성의 사이트는 부품 취약점을 계속 고치기 위해 내리지 않습니다. 내리기 전 확인과 Pro로 되돌린 날의 작업은 [site-review](skills/site-review/SKILL.md)의 「無料のプランに下げる前と、Pro に戻した日」, 무료인 달에 문장을 고치는 방법은 사이트 저장소의 README.md([README.owner.md](skills/web-creator/templates/README.owner.md))의 「Claude を無料のプランにしている月」에 있습니다

## 기여하기

버그 보고와 개선 제안을 환영합니다. 라이선스 사정상 풀 리퀘스트로 코드를 기여받지는 않습니다.

- 버그나 이해하기 어려운 설명: [Issue](https://github.com/tkc310/ai-web-creator/issues/new/choose)(양식 「スキルの改善点」)나 note 창구로 알려 주세요. 자세한 내용은 아래 「[피드백](#피드백)」
- 변경 이력: [CHANGELOG.md](CHANGELOG.md)
- 개선 기록: [docs/logs/](docs/logs/README.md)
- 이 저장소를 고치는 에이전트의 규칙: [AGENTS.md](AGENTS.md)
- 버전 부여와 릴리스 절차(작성자용, 일본어): 일본어 README의 「[版の付け方（作者向け）](README.ja.md#版の付け方作者向け)」

## 피드백

제대로 동작하지 않은 절차나 이해하기 어려웠던 설명은 note 창구나 이 저장소의 Issue(양식 「スキルの改善点」)로 알려 주세요. 보낼지 여부는 자유입니다. Issue는 누구나 읽을 수 있으므로 사이트 URL이나 개인 정보는 적지 마세요. 사이트 저장소에서 Claude가 찾은 개선점은 logs/IMPROVEMENTS.md에 남아 있습니다(보내는 방법은 [run-logs.md](skills/web-creator/references/run-logs.md)의 「スキルの改善点を配布元に送る（任意）」).

이 스킬이 도움이 되었다면 저장소에 Star를 눌러 주시면 큰 힘이 됩니다(선택 사항이며, 누르지 않아도 사용 방법은 전혀 달라지지 않습니다). 스킬도 첫 공개가 끝나고 오너가 만족했을 때 한 번만 같은 부탁을 전합니다.

받은 의견을 바탕으로 개선한 기록은 [docs/logs/](docs/logs/README.md)에 남겨 두었습니다.

## 라이선스

[LICENSE](LICENSE)의 조건으로 사용할 수 있습니다. 요점은 다음과 같습니다.

- note에서 판매하는 해설 기사 중 이용 허락이 포함된다고 기사에 명시된 것(매거진 포함)의 구매자만 사용할 수 있습니다. 구매자가 회사나 단체를 위해 사용하는 경우, 그 회사나 단체 안에서 사용할 수 있습니다. 담당자가 바뀌어도 후임 담당자가 같은 사이트를 위해 계속 사용할 수 있습니다
- 자신이나 자사 사이트의 제작, 공개, 업데이트, 유지보수에 사용할 수 있습니다. 이를 위해 스킬을 사이트의 비공개 저장소에 복사하고 새 버전으로 업데이트할 수 있습니다
- 다른 사람의 의뢰를 받아 고객의 사이트를 만드는 일이나 유지보수에도 사용할 수 있습니다. 고객마다 추가 구매는 필요 없습니다. 고객 사이트의 비공개 저장소에 skills/를 둘 수 있는 것은 제작이나 유지보수를 계속하는 동안입니다. 손을 뗄 때는 고객 본인이 구매자가 아니라면 skills/를 제거합니다(스킬의 재배포에 해당하기 때문입니다. 절차는 [client-handoff.md](skills/web-creator/references/client-handoff.md))
- 스킬이나 프롬프트의 배포, 판매, 구매자가 아닌 사람에게 넘기는 것, 비슷한 것을 만들어 배포하는 것은 할 수 없습니다
- AI 학습이나 학습용 데이터셋, RAG 인덱스, 구매자 이외의 사람에게 답하는 지식 베이스에 넣는 것과 이를 위한 크롤링은 금지합니다. 구매자가 자신의 AI 에이전트에 읽혀 사용하는 것은 문제없습니다
- 스킬로 만든 사이트의 페이지, 문장, 코드, 로그는 구매자의 것입니다. 자유롭게 사용할 수 있습니다. 사이트 저장소를 다른 사람에게 넘길 때는 skills/를 제거해 주세요(상대도 구매자라면 제거하지 않아도 됩니다)
- 보증은 없습니다

[LICENSE](LICENSE)의 일본어 원문이 우선합니다.
