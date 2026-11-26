# 루프 개입 장치: 내장 단계 · 확장 · hook (스터디)

[hook-uses.md](hook-uses.md)의 hook 쓰임 분류에 이어, 하니스 내장 단계와 확장까지 한데 묶어 본 기록입니다. 2026-11-26에 hook-uses.md의 5절로 쓰다가 그 문서가 300줄에 가까워져 옮겼습니다. 근거는 ai-wiki 요청 26, 27이고, 괄호 안은 근거 강도, "해석"은 근거를 묶어 판단한 것입니다. 슬라이드는 이 정리를 마친 뒤 고칩니다.

사용자 의견: 내장 단계도 루프의 정해진 지점에서 hook과 같은 방식으로 동작하니, hook 기반 기능과 내장 단계를 한데 묶어 다시 분류한다.

## 1. 묶는 기준

- 루프 개입 장치(해석): 루프의 정해진 지점에서 실행을 보고, 바꾸고, 막고, 이어 가게 하는 장치. 구현은 셋입니다.
  - 내장 단계: 하니스 코어에 들어 있음(permission 규칙, auto mode classifier, compaction, Guardian)
  - first-party 확장: 제작사가 hook · mod · plugin 계층에 만든 것(`/goal`, agents-md, memory-core, ralph-loop)
  - 사용자 hook: 사용자가 설정하거나 설치한 것(`.env` 차단, Prettier, 알림)
- 같은 점: 개입하는 지점(도구 호출 전, 멈추기 전, LLM 호출 전, compaction 등)과 할 수 있는 일(통과, 차단, 수정, 계속)이 같습니다.
- 다른 점(강)
  - 끌 수 있는가: 내장 단계는 hook 설정으로 끄거나 바꾸지 못합니다(auto mode classifier, sec-default). disableAllHooks, `--bare`, `--safe-mode`로도 내장 mods는 멈추지 않습니다.
  - 순서와 우선: Claude Code는 permission 규칙 → 자동 허용 범위 → classifier 순서로 판정하고, PreToolUse hook의 결정은 permission 규칙을 건너뛰지 못합니다(allow가 deny를 넘지 못함).
  - 보는 정보: 내장 단계는 하니스 내부 기준을 씁니다(classifier는 조종을 막으려고 도구 결과를 빼고 봄).

## 2. 기능 × 제공 형태

| 기능 | 루프 지점 | 하니스가 제공(내장 단계 · first-party 확장) | 사용자 hook |
|---|---|---|---|
| context 가공 | 턴 시작, LLM 호출 전, compaction | compaction(하니스마다 창의 일정 비율이나 한도 근처에서, 요청 22). compaction 뒤 루트 CLAUDE.md와 plan을 디스크에서 다시 주입(Claude Code). agents-md mod. skill 메타데이터만 먼저 싣기(41쪽). tool search(Pi 코어 확장, Anthropic Tool Search Tool). memory(Codex memories, OpenClaw memory-core, Hermes memory provider). opencode goal · plan 알림, 모델별 프롬프트 | 브랜치 상태 주입, compaction 뒤 다시 넣기, PreCompact 요약 지시, 기억 주입 |
| 실행 전 통제 | 도구 호출 전, permission | permission 규칙(Claude Code deny → ask → allow, opencode 규칙 엔진), auto mode classifier, Codex Guardian, Hermes smart approval · 내장 guardrail · hardline 패턴, OpenClaw exec approvals · exec auto-reviewer · ACP approval classifier, sec-default mod, OpenClaw loop detection, opencode tool-input-repair, security-guidance(플러그인, Hermes 이식), sandbox(실행 환경) | `.env` · `.git/` 차단, `/careful` · `/freeze`, 테스트 파일 편집 막기, 배포 승인 게이트, Cursor 보안 파트너 hook, Pi permission-gate(예제를 사용자가 설치) |
| 결과 검증 · 계속 강제 | 멈추기 전 | `/goal`(Claude Code Stop hook, opencode reviewer, Codex 컴파일된 확장), ralph-loop, TOKEN_BUDGET continuation(Claude Code, 유출 소스 · 기능 플래그), Hermes 멈추기 전 gate(늦게 온 LSP 판정, verify-on-stop 최대 3번, kanban 종료 가드), 내장 verification agent(유출 소스 기준, 비공개). Codex는 루프 안에 내장 검증 단계가 없음 | TaskCompleted 테스트 gate, Stop의 prompt · agent hook, todo가 남으면 Stop 차단 |
| 기록 · 관측 | 도구 호출 후, 세션 끝 | transcript 저장, OpenTelemetry 내보내기와 telemetry mod(Claude Code), Hermes kanban · curator 이벤트 | 명령 · 감사 로그, 비용 · 토큰 보고, skill 사용 로그, context 사용량 경고 |
| 편의 · 운영(자동화, 연동, 알림, 흐름 대체) | 도구 호출 후, 입력 대기, 세션 시작 | Codex notify, Hermes outbound webhooks, Claude Code mods turn.step | Prettier · lint, 반복 승인 자동화, 데스크톱 · Slack 알림, 이슈 트래커 연동 |

## 3. 다시 본 결론 (해석)

- 믿을 만한 동작에 필요한 세 기능(context 가공, 실행 전 통제, 결과 검증 · 계속 강제)은 대부분 하니스가 직접 제공합니다. 사용자 hook은 그 위에 그 프로젝트에만 있는 규칙(이 폴더는 건드리지 않음, 이 명령은 막음)과 편의를 더합니다.
- 편의 · 운영 쪽은 반대로 사용자 hook이 대부분입니다. 하니스가 기본으로 넣은 것은 알림(Codex notify), 연동(webhook), 기록(transcript, telemetry) 정도입니다.
- 그래서 hook은 "하니스가 이미 개입하는 지점에 사용자가 자기 규칙을 넣는 입구"로 설명할 수 있습니다. 같은 지점에서 하니스는 기본 규칙을, 사용자는 프로젝트 규칙을 넣습니다.
- 발표에 주는 의미: Hook 개념 그림(루프의 지점)에 내장 단계를 함께 적으면, Context engineering(LLM 호출 전: context 조립 · compaction), Controls(도구 호출 전: permission · classifier · sandbox), Verification(멈추기 전: `/goal` · gate)이 모두 "루프 지점의 개입"으로 묶입니다.

## 4. 이름만 나왔던 내장 단계 (요청 27, 강)

- Hermes middleware: 내장 단계가 아니라 플러그인이 넣는 확장 자리입니다(요청 26 답의 정정).
  - 종류는 tool_request, tool_execution, llm_request, llm_execution 넷입니다. request 종류는 내용을 고쳐 쓰고, execution 종류는 호출을 감쌉니다.
  - llm_execution은 모델 호출을, tool_execution은 pre_tool_call hook 다음 · 도구 dispatch 전을 감쌉니다.
  - Hermes가 기본으로 넣어 둔 인스턴스는 위키에 없습니다.
- Hermes 멈추기 전 gate: 도구 호출 없는 답 → finish_text_response → apply_stop_gates → finalize_turn 순서입니다.
  - 넷: 늦게 온 LSP 판정, verify-on-stop(코드를 고쳤는데 새 근거가 없으면 최대 3번 다시 시킴), pre_verify hook(사용자가 끼어드는 자리, Claude Code Stop 형식도 받음), kanban 종료 도구 가드
  - "nudge and continue" 방식이고, 예산이 떨어지면 마지막 답을 그대로 씁니다.
- Codex Review 모드: REVIEW_PROMPT를 가진 sub-agent가 구조화된 findings를 돌려줍니다. 루프 안의 단계가 아니라 별도 task 종류(regular, compact, review, user_shell)이고, "There is no built-in verify step in the loop"입니다.
- Claude Code TOKEN_BUDGET: 도구 호출이 없을 때 Stop hook 처리와 같은 지점에서 합성 메시지로 계속하게 합니다(유출 소스 스냅샷 2026-03, 기능 플래그). Stop hook과의 순서는 위키에 없습니다.
- OpenClaw ACP approval classifier: 이름만 확인됩니다. 비슷한 exec auto-reviewer는 decision(allow · deny · ask), risk, rationale을 내고, 모든 검사는 도구 래퍼 안에서 돕니다.

## 5. 내장 단계와 hook의 관계: 누가 마지막에 정하나 (요청 27, 강)

| 하니스 | 도구 호출 전 순서 | 마지막 결정권 | 사용자가 바꿀 수 있는 범위 |
|---|---|---|---|
| Claude Code | PreToolUse hook → permission(규칙 → 읽기 전용 자동 허용 → classifier, 먼저 맞는 단계가 이김) | 내장 규칙. hook의 allow와 PermissionRequest hook은 deny 규칙을 넘지 못하고, 중요 경로 rm은 hook allow로도 승인되지 않음. hook이 ask를 내면 classifier 없이 사람에게 감. hook이 입력을 고치면 auto mode는 고치기 전 입력으로 판정해 거부할 수 있음. 예외로 mods의 tool.check는 managed 설정이 없으면 deny 규칙을 넘을 수 있음 | hook은 disableAllHooks로 전부만 끌 수 있음(하나씩 끄기 없음). 내장 mods는 못 끔(sec-default 포함). auto mode는 managed disableAutoMode. 내장 읽기 전용 목록은 설정 불가. compaction은 /autocompact, /compact, PreCompact hook으로 막기 |
| Codex | PreToolUse hook → ToolOrchestrator(정책 검사 → 사용자나 Guardian 검토 → 실행) | 내장 쪽. managed `prompt-user`는 auto-review가 켜져 있어도 사람 결정을 요구. hook allow가 execpolicy · Guardian을 넘는지는 위키에 없음 | prompt · agent 형식 hook은 실행되지 않음. ext/*는 사용자가 바꾸지 못함 |
| Hermes | 내장 guardrail → pre_tool_call hook → tool_execution middleware → dispatch → 도구 안 승인 검사 → transform_tool_result | 내장 최소선. hardline 패턴과 사용자 deny가 YOLO보다 우선하고, hardline은 YOLO로도 승인되지 않음 | 승인 모드 manual · smart · off, /yolo, max_verify_nudges, compaction 임계값, hook timeout. stop gate를 끄는 스위치는 위키에 없음 |
| Pi | tool_call 확장 | 확장(내장 permission이 없음) | 확장을 넣고 뺌. compaction은 session_before_compact로 취소하거나 결과를 직접 넣음 |
| OpenClaw | 세션 확장 tool_call → 플러그인 before_tool_call(도구 래퍼 안에서 승인 · owner-only · taint 검사와 함께) | 승인을 요청하면 입력이 고정됨("cannot change what the operator reviewed"). before_tool_call의 block은 sticky | 기본값은 exec ask off, sandbox off |
| opencode | tool.execute.before hook → 도구 → Permission.assert → 실행 → tool.execute.after | hook이 먼저 막거나 고침. Permission.assert는 도구가 직접 불러 hook이 건너뛰지 못함(중, 추론). permission.evaluate hook이 allow · ask · deny를 바꿀 수 있음 | 내장 tool-input-repair도 같은 tool.execute.before 자리를 씀 |

정리(해석): Claude Code의 deny 규칙, Hermes의 hardline, OpenClaw의 입력 고정처럼 내장 단계가 마지막에 정하는 하니스가 많습니다. 반대로 opencode와 Pi는 확장 쪽 권한이 큽니다. 같은 자리에서 돌더라도 누가 마지막에 정하는지는 하니스마다 다릅니다. 그래서 "루프 개입 장치"로 묶더라도 "마지막 결정권"을 한 열로 함께 보여 주는 편이 정확합니다(ai-wiki 제안).

## 6. 묶는 출처와 구분하는 출처 (요청 27)

- 묶는 쪽(강): Liu 2026("cross-cutting lifecycle control", hook 처리 흐름이 권한 처리 흐름 안에 있음), Meng 2026(Lifecycle Hooks, 내장과 사용자를 나누지 않음), Lin 2026(middleware를 편집할 수 있는 하니스 구성요소로 다룸), Harness² C8(모든 도구 호출을 모델 재량 밖에서). 위키 query 페이지 hooks-in-modern-agents의 "a mod is middleware"(중)
- 구분하는 쪽(강): Liu 2026(지시와 강제는 다른 코드 경로, 확장 → trust → permission 초기화 순서 문제로 CVE), Claude Code 문서("Built-in mods keep running", hook은 규칙을 넘지 못함), Codex(ext/*는 "not a third-party plugin ABI"), Hermes(middleware는 "separate from hooks")
- 내장 단계와 사용자 hook을 체계적으로 비교한 위키 종합 페이지는 없습니다.

## 7. 하니스별 내장 context 단계 (요청 27 답 2/2)

근거는 대부분 하니스별 코드 조사(2026-11-18)와 Claude Code 공식 문서이고, 따로 적지 않은 것은 강입니다.

| 하니스 | 지시 파일 | compaction 뒤 다시 넣는 것 | 기억 | skill · tool search | compaction 시점과 방식 |
|---|---|---|---|---|---|
| Claude Code | managed → user → project → local CLAUDE.md. 위 디렉터리는 시작 때, 하위는 필요할 때. AGENTS.md는 CLAUDE.md가 없을 때만. CLAUDE.md는 시스템 프롬프트 뒤 user 메시지로 들어감 | 디스크에서 다시 넣음: 루트 CLAUDE.md, 자동 기억, skill 설명, plan. 하위 CLAUDE.md와 paths 규칙은 필요할 때, skill 본문은 skill당 5K · 합계 25K까지, 최근 파일 최대 5개 다시 읽음 | MEMORY.md 앞 200줄 또는 25KB를 세션마다 | skill 설명은 처음부터, 본문은 쓸 때. MCP 도구는 기본 지연 로드 | 1M 모델은 약 967K에서, /autocompact · /compact. 유출 소스(2026-03): 호출마다 도구 결과 예산 → snip → microcompact → context collapse → autocompact, 413이면 reactive compact |
| Codex | 루트에서 cwd까지 AGENTS.override.md · AGENTS.md를 이어 붙임(32KB, 신뢰하지 않는 프로젝트는 건너뜀) | 위키에 없음 | ~/.codex/memories를 세션 시작 때 백그라운드로 만듦, memories 도구 | 목록만 넣고 본문은 skills 도구. MCP · 확장 도구는 tool_search 뒤에 숨김 | min(설정값, 창의 90%). 턴 전 · 중 · 후, 더 작은 창의 모델로 바꿀 때. 로컬 요약(최근 사용자 메시지 20K 유지), 서버 측 compaction v2, 미리 돌리는 비동기 compaction |
| Hermes | 한 종류만, 먼저 찾은 것: .hermes.md → AGENTS.md → CLAUDE.md → .cursorrules. 하위 AGENTS.md는 도구 결과 뒤에 붙임 | todo와 steer 표시만 | MEMORY.md · USER.md를 세션 시작 때 고정, memory provider 플러그인, session_search | 목록은 매번 바뀌는 층, 본문은 skill_view. MCP · 플러그인 도구는 다리 도구(tool_search 등)로 대체 | 에이전트는 창의 50%(512K 미만은 75%), 게이트웨이는 85%. 오래된 도구 결과부터 자르고 보조 모델로 구조화 요약, /compress |
| Pi | 디렉터리마다 AGENTS.override.md · AGENTS.md · CLAUDE.md 중 처음 찾은 것 | 위키에 없음 | 내장 장기 기억 없음 | 이름 · 설명은 시스템 프롬프트, 본문은 read 도구. 내장 확장 tool-search | 창 − 16,384. 최근 20K 유지 + LLM 구조화 요약, 원본은 세션 파일에 남김 |
| OpenClaw | AGENTS → SOUL → IDENTITY → USER → TOOLS → BOOTSTRAP → MEMORY(파일당 2 MiB) | 위키에 없음. 대신 compaction 전에 기억을 파일로 저장하는 턴이 따로 돎 | memory-core 플러그인(SQLite 벡터 + FTS), 도구 · 프롬프트 주입 · MEMORY.md 세 경로 | 목록은 시스템 프롬프트, 본문은 skills_read. tool search 기본 켜짐(결과 8개, 최대 20개) | min(창 − 16,384, 창의 75%). 요청 전 점검이 compact만 · 도구 결과 자르기만 · 둘 다 중 하나를 고름. 일부 제공자는 서버 측 |
| opencode | 전역 AGENTS.md → cwd에서 루트까지, AGENTS.md가 없는 디렉터리만 CLAUDE.md. 하위는 read할 때, 파일이 바뀌면 instruction update 메시지 | 위키에 없음 | 장기 기억 없음 | 목록을 알리고 본문은 skill 도구. tool search 없음(Code Mode execute로 도구를 다룸, 중) | 창 − buffer(창의 15%, 최소 16K). 전체 요약 + 최근 약 15K, 백그라운드에서 미리 계산, 지원 모델은 provider 자체 compaction |

context 조립 순서:

- Claude Code: 시스템 프롬프트 → 시스템 · 사용자 context → 모델 · 권한 모드 → 도구
- Codex: 모델 카탈로그의 기본 지시 + developer · context 조각. 단계마다 바뀐 것은 "world-state diffs"로 넣음
- Hermes: stable(정체성 · 가이드) → context(workspace · 지시 파일) → volatile(skill 목록 · 기억 · USER.md · 시각). 시스템 프롬프트는 세션마다 한 번 만들어 유지하고, "the ONLY sanctioned cache break is context compression"
- Pi: preamble → tools → rules → docs → project_context → skills → cwd → mcp_servers. 바뀐 부분은 다시 쓰지 않고 메시지로 덧붙여 앞부분 캐시를 지킴
- OpenClaw: 캐시되는 앞부분과 매번 바뀌는 끝부분을 나눠 시도마다 다시 만듦. context engine을 플러그인으로 바꿀 수 있음
- opencode: agent · provider 시스템 → Code Mode 안내 → MCP · skill 안내 → AGENTS.md → 설정 지시 → 날짜 · 환경

공통점(해석): 여섯 하니스 모두 지시 파일을 정해진 순서로 싣고, skill은 목록만 먼저 싣고 본문은 쓸 때 불러오며, 창의 한도 근처에서 compaction합니다. 다섯이 tool search(지연 로드)를 두고, 대부분 바뀌지 않는 앞부분을 캐시하려고 순서를 지킵니다. 발표 37~40쪽 Context engineering의 내용이 하니스마다 내장 단계로 들어가 있는 셈입니다. 차이는 compaction 뒤 지시를 다시 넣는다고 문서화한 하니스가 Claude Code뿐이라는 점(Hermes는 todo만)과, 장기 기억이 내장(Claude Code, Codex, Hermes) · 플러그인(OpenClaw) · 없음(Pi, opencode)으로 갈린다는 점입니다.

## 8. 하니스별 내장 기록 · 관측 · 알림 (요청 27 답 2/2)

위키의 하니스 비교 페이지 두 곳에는 이 항목이 없고, 모두 원천 자료에서 나왔습니다.

| 하니스 | transcript | telemetry · OTel | 알림 |
|---|---|---|---|
| Claude Code | ~/.claude/projects/ 아래 평문 JSONL(메시지, 도구 사용, 결과), cleanupPeriodDays가 지나면 삭제, sub-agent는 별도 파일 | telemetry는 DISABLE_TELEMETRY로 끔. OTel 내보내기("works on every setup"), span claude_code.llm_request | Notification hook 이벤트, 대기 상태가 되면 데스크톱 알림 |
| Codex | JSONL rollout + SQLite 상태 DB, resume · fork | 위키에 없음 | 레거시 notify 명령 |
| Hermes | SQLite(FTS5). 예전 문서는 state.db + JSON 로그(중) | 학습용 trajectory JSONL(중), skill 사용량 기록(약) | notify_on_complete는 백그라운드 작업이 끝나면 에이전트 턴을 깨우는 기능(중) |
| Pi | JSONL 트리(~/.pi/agent/sessions/) | pi-telemetry 패키지(중) | 코어에는 없고 확장 UI의 notify만 |
| OpenClaw | SQLite(JSONL은 예전 방식) | diagnostics-otel 플러그인 이름만(약) | 위키에 없음 |
| opencode | SQLite 이벤트 로그 | experimental.openTelemetry(중, 예전 문서) | 백그라운드 명령이 끝나면 모델에게 알림 |

정리(해석): transcript 저장은 여섯 모두 내장입니다(Memory · Persistence). 반면 OTel을 문서화한 하니스는 Claude Code뿐이고 opencode는 실험 기능이며, 데스크톱 알림 내장도 Claude Code만 확인됩니다. 기록 · 관측 · 알림은 하니스 기본이 얇고 사용자 hook · 플러그인이 채운다는 2절의 결론과 맞습니다.

## 9. 종합 정리 (해석)

- 루프 개입 장치는 내장 단계, 하니스 확장, 사용자 hook 셋으로 구현됩니다. 개입하는 지점과 하는 일은 같고, 다른 것은 누가 만들었는지, 끌 수 있는지, 누가 마지막에 정하는지입니다(5절).
- 지점별로 보면 하니스가 이미 하는 일과 hook이 더하는 일이 나뉩니다.

| 루프 지점 | 하니스 내장(대부분) | 사용자 hook이 더하는 것 | 발표 장 |
|---|---|---|---|
| 턴 시작 · LLM 호출 전 | 지시 파일 로드, skill 목록, tool search, 기억, compaction과 재주입 | 브랜치 상태 주입, compaction 뒤 다시 넣기 | Context Engineering |
| 도구 호출 전 | permission 규칙, classifier · Guardian · smart approval, 고정 위험 패턴, sandbox | 프로젝트 규칙 차단(.env, 테스트 파일), 승인 게이트 | Controls |
| 도구 호출 후 | 도구 결과 예산 · 자르기, transcript 기록 | 포맷 · 린트, 명령 로그 | (자동화 · 기록) |
| 멈추기 전 | /goal, TOKEN_BUDGET, 멈추기 전 gate | 테스트 통과 전 완료 막기, Stop hook | Verification |
| 세션 시작 · 끝, 입력 대기 | transcript, telemetry, 알림(일부) | 알림, 외부 연동, 비용 기록 | (운영) |

- 신뢰도에 필요한 세 기능(context 가공, 실행 전 통제, 결과 검증)은 하니스 내장이 기본이고, hook은 그 지점에 프로젝트 규칙을 더하는 입구입니다. 편의 · 운영은 대부분 hook과 플러그인이 채웁니다.
- 같은 지점이라도 마지막 결정권은 하니스마다 다르고, 대개 내장 단계가 이깁니다(Claude Code deny 규칙, Hermes hardline).

## 변경 이력

- 2026-11-26: ai-wiki 요청 27 답 2/2를 반영. 하니스별 내장 context 단계(지시 파일, compaction 뒤 재주입, 기억, skill · tool search, compaction 조건)와 조립 순서, 내장 기록 · 관측 · 알림을 표로 정리하고, 루프 지점별 종합 표를 더함
- 2026-11-26: hook-uses.md 5절을 옮겨 문서 작성(내용은 바꾸지 않음)
