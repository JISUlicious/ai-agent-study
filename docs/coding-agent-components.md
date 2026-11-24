# 최신 코딩 에이전트의 구성요소

2026-11-19에 ai-wiki 세션에 문의해 받은 답을 정리한 문서입니다.
발전 흐름 그래프의 뒷부분(에이전트 구성요소)을 다듬을 때 근거로 씁니다.

## 조사 범위와 한계

- 출처는 ai-wiki뿐입니다. 위키에 없는 내용은 "위키에 없음"으로 두고 쓰지 않습니다.
- 위키의 2026-11-18자 조사 페이지 11개와 비교 페이지는 그 시점에 커밋 전이었습니다.
- 코드 조사는 2026-11-18 최신 커밋의 소스를 읽은 것이고, 문서 조사는 공식 문서와 공개 저장소만 본 것입니다. 직접 실행해 확인한 것은 없습니다.

| 구분 | 에이전트 |
|---|---|
| 코드 조사 | Codex CLI, OpenHands, Goose, Cline, Hermes Agent, Pi, OpenClaw, opencode |
| 문서 조사 | Claude Code, Antigravity, Cursor |
| 얕게만 다룸 | Gemini CLI, Aider, Devin, SWE-agent |
| 구성요소 근거 없음 | GitHub Copilot, Zed |

## 구성요소별 정리

근거 강도는 ai-wiki가 붙인 값입니다.

| 구성요소 | 근거 | 내용 |
|---|---|---|
| Agent loop | 강 | 도구 호출이 없는 응답이 나오면 끝남. 상한은 제품마다 다름(OpenHands 500회와 비용 예산, Goose 1000턴, Hermes 기본 무제한, Pi 코어는 상한 없음) |
| 파일·셸 도구 | 강 | 읽기, 편집, 셸 실행은 모두 있음. 이름만 다름(Codex `exec_command`·`apply_patch`, opencode `read`·`edit`·`shell`) |
| 검색·웹 도구 | 중 | opencode `websearch`·`webfetch`, Cursor web search·browser, OpenHands browser. 의미 기반 코드 인덱스는 위키에 없음 |
| MCP | 강 | 조사한 에이전트 모두에 나옴. Pi는 2026-09-29부터 |
| ACP | 중 | opencode, Hermes, OpenClaw, Goose, Cline, Cursor, Antigravity. Codex·Pi는 없음 |
| 지시 파일 | 강 | `AGENTS.md`가 사실상 공통. Claude Code는 `CLAUDE.md`와 `.claude/rules/`, Cursor는 `.cursor/rules/*.mdc`도 읽음 |
| Skills | 강 | 대부분 `SKILL.md`. Cursor와 Goose는 `.claude/skills`도 읽음. Cursor는 slash command를 skills로 통합 |
| Sub-agents | 강 | Pi 코어만 없음. 깊이와 동시 실행 수가 다름(Claude Code 3단계·20개, Codex 1단계·6 threads, OpenClaw 5단계) |
| 클라우드 에이전트 | 중 | Cursor cloud agents, codex cloud, Claude Code Cloud, Cline cloud handoff, OpenHands Cloud |
| Compaction | 강 | 오래된 도구 출력을 먼저 정리하고 그다음 LLM 요약. 트리거는 창의 80~90% 부근 |
| 세션 간 memory | 강 | Claude Code auto memory, Codex memories, Hermes 4층 구조, OpenClaw 파일과 벡터 검색. opencode·Pi는 장기 저장소 없음 |
| Plan mode | 중 | Cursor, Antigravity, Cline, opencode, Claude Code. Pi는 없음. Codex는 위키에 없음 |
| Todo·task list | 중 | Codex `update_plan`, OpenHands `task_tracker`, opencode `todowrite` 등 7개 이상 |
| Permission | 강 | allow·ask·deny 규칙이 일반적. Claude Code는 auto mode 분류기, Codex는 Starlark execpolicy |
| Sandbox | 강 | 기본으로 켜진 것은 Codex뿐. Claude Code·OpenClaw는 기본 꺼짐, Goose·Cline·Pi는 없거나 opt-in |
| Hooks | 강 | 10개 모두 있음. 이벤트 수는 6개(OpenHands)부터 48개(Hermes)까지 |
| 검증 | 중 | 멈추기 전 검증을 기본으로 강제하는 것은 Hermes뿐. 리뷰는 Codex review mode, Cursor Bugbot. 테스트를 자동으로 돌리는 구성요소는 거의 확인 안 됨(약) |
| Checkpoint·rewind | 중 | Cline, Cursor, Antigravity, opencode, Gemini CLI. Claude Code는 위키에 없음 |
| 실행 환경 | 강 | 엔진 하나를 프로토콜 뒤에 두고 CLI, IDE, 데스크톱, 클라우드가 붙는 구조가 다수 |

## 공통인 것과 특정 제품에만 있는 것

공통(강): 루프, 도구 레지스트리, MCP, 지시 파일, SKILL.md skills, hooks, permission gate, compaction, 세션 저장.
거의 공통: sub-agents, goal loop.

특정 제품에만 있는 것:

- 기본 sandbox 켜짐: Codex
- 검증 강제: Hermes
- 네트워크 결과가 들어오면 owner-only 도구를 잠그는 turn taint: OpenClaw
- 시크릿 placeholder 프록시: Codex
- 모든 도구 스키마에 `security_risk`: OpenHands
- 클라우드 VM 에이전트와 Bugbot: Cursor
- 장기 memory 중심 구조: OpenClaw, Hermes

## 구성요소를 분류한 문헌

| 문헌 | 분류 |
|---|---|
| Lin 2026 | 수정 가능한 산출물 6개: System prompt, Tools, Middleware, Skills, Sub-agents, Long-term memory |
| Ning 2026 survey | 메커니즘 범주 5개: Planning, Memory & Context Engineering, Tool Use, Plan-Execute-Verify loop, Adaptive Optimization |
| Böckeler 2026 | Guide(사전)/Sensor(사후) × Computational/Inferential. Guide는 AGENTS.md·skills, Sensor는 tests·linters·AI code review |

위키가 직접 종합한 분류(외부 문헌 아님)로는 보편 8개가 있습니다.
Loop, Tool registry, Sandbox, System prompt와 context assembly, Memory, Permission, Hooks, Persistence입니다.

## 발전 흐름 그래프와의 대조

그래프 뒷부분 노드 14개를 대조한 결과입니다.

근거가 강한 노드: Agent loop, Tool use, MCP, Skills, Sub-agents, Compaction, Instruction file, Sandbox, Hook, Permission.

근거가 약하거나 손볼 노드:

| 노드 | 문제 |
|---|---|
| General purpose agents | 이 용어의 개념 페이지가 위키에 없음 |
| External memory | 위키 용어는 long-term memory, project memory. opencode·Pi에는 없어 공통 구성요소로 보기 어려움 |
| Plan-Execute-Verify | Ning survey의 범주로는 강함. 제품에서 Verify를 기본으로 강제하는 것은 Hermes뿐이라 제품 근거는 중 |
| Context engineering | 개념은 강함. 제품 쪽 용어는 context assembly |

그래프 밖에서 여러 에이전트에 공통으로 나온 것:

| 구성요소 | 범위 | 근거 | 결정 |
|---|---|---|---|
| Goal loop(`/goal`, 루프 바깥의 루프) | 8개 | 강 | 이미 `Goal`(아랫줄 Ralph Loop) 노드로 반영돼 있음 |
| 모델 기반 승인 검토자 | 10개 중 8개 | 강 | 노드 없음. Permission의 구현 방식 |
| Persistence·세션(resume, fork) | 보편 8개에 포함 | 강 | 제외. 소프트웨어 구현에 가까움 |
| Checkpoint·rewind | 5개 | 중 | 제외 |
| Todo·task list | 7개 이상 | 중 | 제외 |
| Steering(실행 중 입력 끼워넣기) | 6개 중 5개 | 중 | 제외 |
| 도구 노출 축소(tool search, code mode) | 6개 | 중 | 제외 |
| ACP | 7개 | 중 | 제외 |
| Loop guard(반복·stuck 감지) | 4개 | 중 | 제외 |

### 결정 (2026-11-19)

- Goal loop는 새로 넣지 않습니다. 그래프에 `Keep working until the goal is met → Goal`이 이미 있고, `Hook → Goal`, `Goal → General purpose agents`로 이어져 있습니다. 처음 정리할 때 이 노드를 빠뜨리고 "그래프에 없음"으로 적었던 것을 바로잡았습니다.
- Persistence는 한계에 대한 대응이라기보다 소프트웨어 구현이라 제외합니다. 이 결정은 발전 흐름 그래프에 대한 것입니다. 구현 구성요소 장에서는 세션 저장을 Persistence 칸으로 넣기로 했습니다(2026-11-24, → [agent-components-implementation.md](agent-components-implementation.md)).
- 근거가 '중'인 나머지는 일부 제품에만 있어 제외합니다.
- 모델 기반 승인 검토자는 검증(verifier)과 다릅니다. 도구 호출을 실행하기 전에 허용할지 판정하는 Permission 쪽 장치이고, 검증은 실행한 뒤 결과가 맞는지 확인합니다. 위키의 Permission 항목에 나온 예는 Claude Code의 auto mode 분류기, Hermes의 smart(LLM) 승인, Cursor의 Auto-review입니다. 8개 제품의 전체 목록은 받지 못했습니다.

## 변경 이력

- 2026-11-19: ai-wiki 조사 결과로 문서 작성
- 2026-11-19: Goal 노드가 이미 있음을 반영해 대조 표를 고치고 제외 결정 기록
- 2026-11-24: Persistence 제외는 그래프에만 해당하고 구현 구성요소 장에는 넣는다는 점을 덧붙임
