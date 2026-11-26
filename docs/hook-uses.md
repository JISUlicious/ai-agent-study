# Hook 쓰임 분류 (스터디)

발표의 Hook 섹션이 잘 정리되지 않아, 슬라이드를 고치기 전에 hook 쓰임을 세 기준으로 나눠 본 기록입니다(2026-11-26 사용자 요청: 슬라이드는 이 정리를 마친 뒤 고침).

1. 기능: hook이 무엇을 하는가
2. 만든 쪽: 하니스가 hook 위에 만든 기능(first-party)인가, 사용자가 설정해 쓰는 hook인가
3. 역할: 에이전트가 믿을 만하게 동작하는 데 필요한가, 에이전트 구성요소 중 어디에 들어가는가

근거는 [hook-points.md](hook-points.md)의 하니스 6개 지점 조사와 쓰임 조사(ai-wiki 요청 12~14), 그리고 이 문서를 위해 보낸 ai-wiki 요청 26입니다. 괄호 안은 근거 강도이고, "해석"은 근거를 묶어 판단한 것입니다.

## 1. 기능별 분류

| 분류 | 하는 일 | 주로 쓰는 지점 | 확인된 예 |
|---|---|---|---|
| context 가공 | context에 넣기, 조립 · 수정, 도구 결과 변환, compaction 보완 | SessionStart, UserPromptSubmit, context 조립 지점, PostToolUse, PreCompact | 브랜치 상태 주입, compaction 뒤 다시 넣기, PreCompact 출력을 요약 지시로(Claude Code 문서, 강). Hermes pre_llm_call · transform_tool_result, Pi context, OpenClaw before_prompt_build, Codex PostToolUse 출력 교체(강). 기억 주입(OpenClaw memory-core 강, NVIDIA 중) |
| 실행 전 통제 | 막기, 승인 받기, 입력 고치기, 규칙 강제 | PreToolUse, PermissionRequest | rm -rf · DROP TABLE · `.env` 편집 차단, 티켓 번호 형식 강제(Claude Code 문서, 강). `/careful` · `/freeze`(Shihipar 2026, 강). 테스트 파일 편집 막기, 배포 승인 게이트(AI-Native SDLC Playbook, 강). updatedInput 리댁션(강). git push 차단, sudo 승인, 비밀 가림(Cursor 문서, 강) |
| 결과 검증 · 계속 강제 | 끝내기 전에 판정하고, 안 끝났으면 계속 돌림 | Stop, TaskCompleted, SubagentStop | `/goal`, ralph-loop(강). TaskCompleted에서 테스트 실패면 완료 차단, Stop의 prompt · agent hook(문서, 강). todo가 남으면 Stop 차단(oh-my-claude, 강). Codex Stop, Hermes pre_verify, opencode experimental.idle(강) |
| 작업 자동화 | 편집 뒤 포맷 · 린트 · 테스트, 반복 승인 자동화 | PostToolUse, PermissionRequest | Prettier · lint, 편집 뒤 비동기 테스트, ExitPlanMode 자동 승인(문서, 강). 테스트 · 린터 명령 자동 승인(oh-my-claude, 강). 편집 뒤 eslint(OpenDev, 중) |
| 외부 연동 | 다른 시스템과 주고받기 | SessionStart, PreToolUse, 이벤트 구독 | 이슈 트래커 MCP 폼 자동 입력, 공유 skill 저장소 git pull(문서, 강). Hermes outbound webhooks(강) |
| 알림 | 사람에게 알리기 | Notification, Stop | 입력이 필요할 때 데스크톱 · 터미널 알림(문서, 강). Codex notify(강). hook의 시작이 권한 요청 Slack 알림 요청(Cat Wu 인터뷰, 중) |
| 기록 · 관측 | 로그, 감사, 비용 · 사용량, 계측 | PostToolUse, ConfigChange, SessionEnd | Bash 명령 기록, 감사 로그, 비용 · 토큰 보고, SessionEnd 통계(문서, 강). skill 사용 로그(Shihipar 2026, 강). 모든 이벤트 감사 로그 audit.sh(Cursor, 강). context 사용량 경고(oh-my-claude 강, JAZ 중). Claude Code 내장 telemetry mod(강) |
| 흐름 대체 | 모델 호출을 건너뛰거나 바꾸기 | 모델 호출 전, compaction | opencode session.compaction(결과를 직접 줌), session.model.request(모델 교체), Claude Code mods turn.step(강) |

- 지금 50쪽 Hook 쓰임의 여덟 카드와는 조금 다릅니다. "세션 관리"는 상태 저장(기록 · 관측)과 compaction 요약 지시(context 가공)로, "비용 표시"는 기록 · 관측으로 들어갑니다.
- 경계(해석): 린트 · 테스트를 돌려 결과를 모델에게 돌려주면 결과 검증에 가깝고, 포맷처럼 고치기만 하면 자동화입니다. 같은 PostToolUse hook도 무엇을 돌려주느냐에 따라 분류가 갈립니다.

## 2. 만든 쪽

### 2.1 하니스가 hook 위에 만든 기능 (first-party, 요청 26)

| 하니스 | 기능 | 쓰는 hook | 분류 |
|---|---|---|---|
| Claude Code | `/goal` | 세션 범위의 prompt-based Stop hook을 감쌈(강) | 계속 강제 |
| Claude Code | ralph-loop(공식 마켓플레이스 플러그인) | Stop hook이 끝내려는 시도를 가로챔(강) | 계속 강제 |
| Claude Code | security-guidance(공식 플러그인) | 별도 모델 리뷰 결과를 세션에 돌려주는 hook의 예로 문서가 소개(강). 이벤트 세부는 위키에 없음(약) | 통제 · 검증 |
| Claude Code | 내장 mods(v2.1.287~): agents-md, sec-default, telemetry, you-should-know, diff | mods 계층. "Some of Claude Code's own features are mods."(강) disableAllHooks · `--safe-mode`로도 멈추지 않음 | agents-md는 context 가공(AGENTS.md 로드), sec-default는 통제(모든 mod보다 먼저 도는 정책 가드, 끌 수 없음), telemetry는 기록, you-should-know는 도구 없는 side agent가 대화를 다시 읽고 메모(기본 꺼짐), diff는 화면 |
| Claude Code | hookify(공식 플러그인) | hook 규칙 작성용(중, 원문 없음) | 도구 |
| Hermes | security-guidance 1층 이식 | 정규식 25개로 경고만 함(강) | 통제(경고) |
| Hermes | memory provider 플러그인 | on_turn_start, on_session_end, on_pre_compress(강) | context 가공 |
| Hermes | outbound webhooks, shell hooks | hook 이벤트 구독, config.yaml의 `hooks:`(강) | 연동, 사용자 설정 통로 |
| Pi | 코어 확장: llama.cpp, codemode, tool-search, mcp | 확장 계층(강). MCP도 확장으로 구현 | 기능 확장 |
| OpenClaw | memory-core | before_prompt_build로 기억 주입, compaction 전 노트 저장(강) | context 가공 |
| OpenClaw | loop detection | before_tool_call hook으로 도구를 감쌈(강) | 통제 |
| OpenClaw | heartbeat | heartbeat_prompt_contribution(강) | context 가공 |
| opencode | `/goal` reviewer | experimental.idle(강). "the goal reviewer is the only built-in self-check" | 계속 강제 |
| opencode | goal · plan 알림, plan, 모델별 프롬프트(optimize.ts) | context hook, plan은 plugin(강) | context 가공 |
| opencode | tool-input-repair | tool.execute.before(강) | 입력 고치기 |

- Claude Code는 skill과 sub-agent의 frontmatter에 hook을 둘 수 있습니다(강).
  - skill hook은 skill이 호출되면 등록되어 세션 끝까지 유지되고, `once: true`로 한 번만 실행할 수 있습니다.
  - sub-agent hook은 그 sub-agent가 활성일 때만 돌고, Stop은 SubagentStop으로 바뀝니다.
  - plugin sub-agent에서는 hooks가 무시되고, project sub-agent의 hook은 workspace trust가 필요합니다.
  - `/careful`(skill로 켜고 끄는 PreToolUse hook)이 이 방식입니다.
- 하니스별 사정(강):
  - Codex의 `/goal` · memories · skills · guardian은 hook이 아니라 바이너리에 컴파일된 Rust 확장입니다. `/goal`은 thread가 쉴 때 이어 가며 별도 judge가 없습니다. Codex hook 엔진은 Claude Code 호환(14개 이벤트)이지만 prompt · agent 처리기는 실행하지 않습니다.
  - Pi는 "does not include a built-in permission system"이고, permission-gate · protected-paths · plan-mode · subagent · git-checkpoint · custom-compaction은 공식 예제 79개 안에 있습니다(코어 아님).
  - OpenClaw 내부 hook 이벤트 15개는 agent:bootstrap, command:new · reset · stop, gateway:pre-restart · shutdown · startup, message:preprocessed · received · sent · transcribed, session:auto-reset · compact:before · compact:after · patch입니다. 함께 들어 있는 hook은 Gmail watcher라는 이름만 확인됩니다.
  - 위키에 없음: Claude Code explanatory · learning output style이 SessionStart hook으로 구현됐다는 서술.

### 2.2 hook처럼 보이지만 hook이 아닌 내장 기능 (강)

- Claude Code: auto mode classifier("a second gate that runs after the permissions system", hook과 닿는 곳은 거부 뒤 PermissionDenied뿐), TOKEN_BUDGET 강제 continuation(Stop hook과 별도), 내장 verification agent(유출 소스 기준, 공개 문서에 없음)
- Codex: Guardian(auto_review). Review 모드는 루프 안의 단계가 아니라 별도 task(`codex review`, `/review`)로 도는 리뷰 sub-agent입니다(요청 27, 강).
- Hermes: smart approval, 완료 전 내장 gate 4개(pre_verify hook은 그중 하나에 끼어들 뿐), `/goal`. middleware 4종은 내장 단계가 아니라 플러그인이 `register_middleware`로 넣는 확장 자리입니다(요청 27 정정, 강).
- OpenClaw: exec approvals, ACP approval classifier
- opencode: permission 규칙 엔진

### 2.3 사용자가 설정해 쓰는 hook

- Claude Code 공식 문서 예시 약 40개: 사용자가 설정하라고 준 예입니다. 판정 · 검증은 5~6개입니다(해석, 실제 사용 비율은 아님).
- Cursor 파트너 hook 생태계(강): 위키에 있는 서드파티 hook 모음 중 가장 큽니다. 보안 · 거버넌스가 중심입니다.
  - MCP 거버넌스: MintMCP, Oasis, Runlayer
  - 코드 보안: Corridor, Semgrep
  - 악성 의존성: Endor Labs
  - 프롬프트 인젝션: Snyk
  - 비밀 관리: 1Password
- 커뮤니티: oh-my-claude의 hook 7개(SessionStart context 주입, 테스트 · 린터 자동 승인, todo가 남으면 Stop 차단, context 사용량 경고, PreCompact 상태 보존 등)
- 회사 실무: AI-Native SDLC Playbook(테스트 파일 편집 막기, 배포 승인 게이트)
- 논문: OpenDev(편집 뒤 eslint), JAZ(context 70% 경고), NVIDIA(턴 전 기억 주입), JevAgentHarness(계측), Harness-R1(학습된 편집기가 lifecycle hook 4개에 코드를 설치)
- 위키에 없음: awesome-claude-code류 hook 모음, hook 사용 통계. Hashimoto의 사례에는 hook이 없습니다(중).

## 3. 역할

### 3.1 믿을 만한 동작에 필요한가

| 분류 | 필요한가 | 대응하는 한계(32쪽) |
|---|---|---|
| context 가공 | 필요. compaction이나 긴 대화에서 지시를 잃지 않게 함 | Context window 한계 |
| 실행 전 통제 | 필요. 꼭 지킬 규칙을 지시가 아니라 강제로 만듦 | 비결정론적 동작 |
| 결과 검증 · 계속 강제 | 필요. 끝났다고 착각하고 멈추는 것을 막음 | 조기 종료 |
| 기록 · 관측 | 간접. 실행 중 동작은 그대로 두고 평가 · 감사 자료를 남김 | 없음 |
| 작업 자동화, 외부 연동, 알림, 흐름 대체 | 선택. 품질과 편의(알림은 사람의 개입을 도움) | 없음 |

근거: "꼭 지킬 규칙은 hook으로"는 Claude Code 공식 문서 여러 곳에 직접 있습니다(강).

- features-overview: "Put guardrails in hooks." CLAUDE.md나 skill의 지시는 요청이고 보장이 아니며, 매번 지켜야 하면 "make it a hook rather than a prompt instruction".
- memory.md: CLAUDE.md와 auto memory는 "context, not enforced configuration"이고, 막아야 하면 PreToolUse hook을 씀.
- skills.md 문제 해결: 매번 지켜야 할 규칙을 skill이 건너뛰면 "move the rule into a hook".
- hooks-guide: "deterministic control". 단서로 `.env` 편집 hook은 셸 명령으로 우회될 수 있어 deny 규칙과 sandbox를 겹쳐 쓰라고 권함.
- 다른 출처
  - Cursor: "rules are suggestions, not guarantees". 핵심 hook에는 `failClosed`(강)
  - Harness²(Xu 2026): "Prose can be stopped reading; a hook cannot."(강). hook은 산문 규칙이 반복해서 무시됐다는 증거가 있을 때만 둠
  - Wang 2026: 지시문이 한계에 닿으면 middleware로 실행 중 강제로 올림(강)
  - Zhou 2026: 밖으로 뺀 제약이 결정적 강제를 줌(강)
  - Liu 2026: CLAUDE.md 준수는 확률적이고 permission rule이 결정적(강). Liu가 결정적 계층으로 드는 것은 hook이 아니라 permission rule
- 수치(중, Harness-IF Huang 2026): 산문 규칙 중 명령형(require · forbid) 준수율이 76.0%로 가장 낮고, 모델의 기본 성향에 반하는 규칙은 3.6~7.4점 낮음.

compaction과 context 가공(강):

- hooks-guide "Re-inject context after compaction": SessionStart hook에 `compact` matcher를 씀.
- hook이 앞서 넣은 context는 compaction 때 다른 내용과 함께 요약되고, compact SessionStart hook은 다시 실행됨. 루트 CLAUDE.md와 plan은 디스크에서 다시 주입됨.
- hook이 exit code 2로 compaction을 막을 수 있음(changelog).
- 다른 하니스의 공백: Cline은 PreCompact를 선언만 하고 실행하지 않고, Codex와 Cursor의 PreCompact는 관찰만 가능. 이로 인한 실제 사고 기록은 위키에 없음.
- 54쪽 이메일 삭제 사례(compaction이 "실행하지 말 것"을 누락, Raj 2026)는 compaction 뒤 다시 넣는 hook이 겨냥하는 실패 유형입니다(해석).

hook으로 바꾼 결과와 위험:

- AHE(Lin 2026, 강): middleware의 finish-hook이 평가와 같은 꼴의 마무리 확인을 한 번 강제. Easy 과제는 모두 통과, Hard 과제는 턴 수만 늘어남.
- Harness-R1(강): pre-action hook을 빼면 성능이 3.9pp 떨어짐.
- 위험(강): Stop hook이 계속 막아 끝나지 않던 문제로 상한이 생김(도구 호출 없이 8번 연속 막으면 무시). command hook은 사용자 권한으로 셸을 실행(CVE-2025-59536 등).
- hook이 없어서 생긴 에이전트 사고 기록은 위키에 없음(Zhang 2026의 "deployment hook"은 git hook).

### 3.2 구성요소 대응

hook 쓰임을 LLM, Memory, Planning, Evaluation까지 모두 대응시킨 통합 표는 위키에 없습니다. 가까운 출처는 아래와 같습니다(모두 강, Zhou만 중).

- Meng 2026 하니스 서베이: 하니스를 H=(E,T,C,S,L,V)로 쓰고 hook을 독립 구성요소 L로 둠. "L -- Lifecycle Hooks: auth, logging, policy enforcement, instrumentation."
- Lin 2026 AHE: middleware가 "controls context, execution, and recovery". 구성요소 하나씩만 넣은 비교에서 middleware만 71.9%, memory만 75.3%, tool만 73.0%.
- Harness² C8: 모든 도구 호출을 모델 재량 밖에서 hook함.
- Liu 2026: Claude Code hook 27개를 도구 권한, 세션 생애주기, 사용자 상호작용, sub-agent, context 관리, workspace(+ 알림) 여섯 영역으로 나눔. 처리기는 command, prompt, http, agent(verifier). "cross-cutting lifecycle control … with no context footprint by default".
- Claude Code features-overview: 기능별 역할 표에서 "hooks handle automation". hook의 context 비용은 출력이 없으면 0.
- Cursor: 강제, 관찰, 감사("Enforce and observe at agent lifecycle points").
- Zhou 2026(중): 사람 감독 계층의 "configurable approval gates".

분류별 대응(해석, 근거 출처를 붙임):

| 분류 | 구성요소(3쪽) | 근거 |
|---|---|---|
| context 가공 | Memory(context 조립) | Lin "context", Liu "context 관리" |
| 실행 전 통제 | Control | Meng "policy enforcement", Claude Code "guardrails in hooks" |
| 결과 검증 · 계속 강제 | Verification, Agent loop(goal loop) | Lin "execution, recovery", `/goal`, Stop의 agent hook |
| 기록 · 관측 | Evaluation 쪽(자료) | Meng "logging, instrumentation", Cursor "observe · audit". Evaluation에 직접 대응시킨 출처는 없음 |
| 자동화, 연동, 알림, 흐름 대체 | 해당 없음 | Claude Code "hooks handle automation" |

Planning에 hook을 직접 대응시킨 출처는 없습니다. opencode의 plan이 plugin이고 goal · plan 알림을 context hook으로 넣는 것이 가장 가까운 예입니다.

## 4. 정리 (해석)

- hook을 보는 관점이 둘입니다. Meng 2026은 hook을 하니스의 독립 구성요소(L)로 두고, Lin 2026과 Liu 2026은 여러 구성요소에 걸친 공통 장치(cross-cutting)로 봅니다. 발표 3쪽 다이어그램은 개념 구성요소라 hook 칸이 없고, 59쪽 General-Purpose AI Agent 구조는 hook을 감싸는 상자로 그려 뒤쪽 관점과 맞습니다.
- 믿을 만한 동작에 필요한 세 쓰임(context 가공, 실행 전 통제, 결과 검증 · 계속 강제)이 32쪽의 세 한계와 하나씩 맞습니다. 나머지(자동화, 연동, 알림, 기록, 흐름 대체)는 편의와 운영입니다.
- first-party 기능의 경향
  - 하니스는 hook(또는 mods · plugin 계층) 위에 계속 강제(`/goal`, ralph-loop, opencode reviewer), context 가공(agents-md, memory-core, opencode context hook), 일부 통제(sec-default, loop detection, security-guidance 이식)를 만들었습니다.
  - 핵심 permission 판정(auto mode classifier, Guardian, exec approvals, permission 규칙 엔진)은 hook이 아닌 내장 단계로 만들었습니다.
  - 사용자 hook은 통제, 자동화, 알림, 기록, 연동이 많고, Cursor 파트너 생태계는 보안 · 거버넌스가 중심입니다.
- "지시는 요청, hook은 강제"(Claude Code 문서)는 발표의 Agent Skills와 Controls를 잇는 문장으로 쓸 만합니다. 단서는 둘입니다. hook도 셸로 우회될 수 있어 deny 규칙 · sandbox와 겹쳐 써야 하고, Liu 2026은 결정적 계층으로 hook이 아닌 permission rule을 듭니다.

### Hook 섹션 재구성 후보 (슬라이드는 결정 뒤 고침)

| 순서 | 장 | 내용 |
|---|---|---|
| 1 | Hook 개념 | 지금 49쪽(에이전트 루프에 hook 지점) |
| 2 | Hook 쓰임 분류 | 신뢰도 셋(context 가공, 실행 전 통제, 계속 강제)과 편의 · 운영 넷(자동화, 연동, 알림, 기록). 지금 50쪽 여덟 카드를 이 분류로 다시 묶음 |
| 3 | 지시와 강제 | CLAUDE.md · skill 지시는 요청, hook은 강제("Put guardrails in hooks"). Controls로 가는 다리 |
| 4 | (선택) 하니스 기능도 hook 위에 | `/goal`, ralph-loop, agents-md, memory-core 같은 first-party 기능 |

신뢰도 셋의 사례는 각 장에서 다룹니다. context 가공은 Context Engineering 쪽(지금 51쪽 사례), 통제는 Controls(지금 53쪽 사례), 계속 강제는 Verification(56~58쪽)입니다.

## 5. 내장 단계까지 묶은 분류

2026-11-26 사용자 의견(내장 단계도 hook과 같은 방식으로 동작)으로 내장 단계, first-party 확장, 사용자 hook을 "루프 개입 장치"로 묶어 다시 분류했습니다. 이 문서가 300줄에 가까워져 그 내용은 [loop-interventions.md](loop-interventions.md)로 옮겼습니다.

## 변경 이력

- 2026-11-26: 5절(내장 단계까지 묶은 분류)을 loop-interventions.md로 옮기고 안내만 남김
- 2026-11-26: ai-wiki 요청 27 답 1/2(항목 1, 4, 5)를 반영. Hermes middleware를 내장 단계에서 확장 자리로 정정하고, Hermes 멈추기 전 gate · Codex Review 모드 · TOKEN_BUDGET · ACP classifier의 세부, 하니스별 내장 단계와 hook의 순서 · 마지막 결정권 표, 묶는 출처와 구분하는 출처를 더함. 2/2를 기다리는 중
- 2026-11-26: 사용자 의견(내장 단계도 hook과 같은 방식으로 동작)으로 5절을 더함. 내장 단계, first-party 확장, 사용자 hook을 "루프 개입 장치"로 묶고 기능 × 제공 형태 표를 만듦. 신뢰도 세 기능은 대부분 하니스가 제공하고 사용자 hook은 프로젝트 규칙과 편의를 더한다는 결론. 빈 곳은 ai-wiki 요청 27로 확인 중
- 2026-11-26: ai-wiki 요청 26 답을 반영. first-party 기능을 하니스별 표로 채우고(Claude Code 내장 mods · 공식 플러그인 · frontmatter hook, Hermes, Pi, OpenClaw, opencode), hook이 아닌 내장 기능, Cursor 파트너 생태계, "규칙은 hook으로" 원칙 문장, compaction 관련 사실, 구성요소 대응 출처(Meng, Lin, Liu 등)를 더함. first-party 경향의 해석을 고치고(통제 · context 가공도 있음), Hook 섹션 재구성 후보를 적음
- 2026-11-26: 문서 작성. hook-points.md 근거로 기능 분류(8), first-party 기능과 사용자 hook 구분, 신뢰도 · 구성요소 대응 초안. first-party 기능 목록 확인을 ai-wiki 요청 26으로 보냄
