# hook 지점과 그리는 방식

한 턴의 흐름에서 hook을 어떻게 그릴지 정하는 기록입니다. 2026-11-24에 [agent-components-implementation.md](agent-components-implementation.md)의 "한 턴의 순서" 절에서 나눴습니다. 그 문서가 300줄에 가까워졌고, 하니스별 hook 지점은 따로 볼 주제이기 때문입니다.

## 사용자 제안 (2026-11-24)

hook을 한 턴의 ③ 단계로 넣지 말고, 모델 호출을 감싸는 상자와 도구 호출을 감싸는 상자로 그린다. hook은 agent loop의 모든 단계에 들어갈 수 있다.

지금 보드의 구현요소 흐름에는 "③ hook (pre-tool)"이 모델 호출과 permission 사이의 단계로 있고, post-tool hook은 보이지 않습니다. 관계를 겹친 버전도 ③ 화살표가 hooks 블록을 거칩니다.

## 하니스별 hook 지점 (ai-wiki, 2026-11-24)

근거는 하니스별 코드 지도와 코드베이스 조사, Claude Code 공식 문서 스냅샷(2026-11-18)입니다. 따로 적은 곳을 빼면 모두 강입니다. "없음"은 위키 기준입니다.

| 단계 | Claude Code | Codex | Hermes | Pi | OpenClaw | opencode |
|---|---|---|---|---|---|---|
| 세션 시작·끝 | SessionStart, SessionEnd | 없음 | 위키 표에 없음 | session_start, session_shutdown | session_start, session_end | session.fork만 |
| 사용자 입력·턴 시작 | UserPromptSubmit, UserPromptExpansion | UserPromptSubmit(막기 가능) | pre_llm_call(context 넣기, 턴 거부) | input, turn_start, before_agent_start | before_agent_run, agent_turn_prepare 등 | session.prompt |
| context 조립 | InstructionsLoaded(관찰만). mods의 prompt.section, prompt.context | 없음 | 따로 없음(pre_llm_call로 넣음) | context, context_with_system | before_prompt_build | session.context |
| compaction 전후 | PreCompact, PostCompact | PreCompact, PostCompact | post_compaction(관찰만) | session_before_compact, session_compact | before_compaction, after_compaction | session.compaction |
| 모델 호출 전후 | settings hook에는 없음. mods의 turn.step | PreModelRequest, PostModelRequest | pre_api_request, post_api_request 등 | before_provider_request, after_provider_response | before_model_request, model_call_started·ended 등 | session.model.request, session.generate |
| 도구 호출 전후 | PreToolUse, PostToolUse, PostToolUseFailure, PostToolBatch | PreToolUse, PostToolUse | pre_tool_call, post_tool_call, transform_tool_result | tool_call, tool_result | before_tool_call, after_tool_call | tool.execute.before, tool.execute.after |
| permission 요청 | PermissionRequest, PermissionDenied | PermissionRequest | 전용 없음(pre_tool_call로 처리) | 전용 없음(tool_call 게이트) | before_tool_call의 requireApproval | 전용 없음(도구 실행 안에서 처리) |
| 멈추기 전 | Stop, StopFailure | Stop(막으면 턴을 계속함) | pre_verify(계속 강제) | turn_end, agent_before_settle | before_agent_finalize, agent_end | experimental.idle(/goal이 여기서 돎) |
| sub-agent 시작·끝 | SubagentStart, SubagentStop | SubagentStart, SubagentStop | subagent_start만 | 없음(내장 기능 아님) | subagent_spawned, subagent_ended | 위키 목록에 없음 |
| 이벤트 수 | 33 | 14 | 48 | 41 | 43(내부 hook 15 별도) | 21(V2) |

- 앞뒤 짝으로 6개 모두에 있는 지점은 도구 호출뿐입니다. 모델 호출 앞뒤는 Claude Code를 뺀 5개에 있습니다. 한 지점으로 세면 턴 시작과 멈추기 전도 6개 모두에 있습니다(opencode의 멈추기 전은 experimental).
- Claude Code의 settings hook 33개에는 모델 호출 전후가 없습니다. 가장 가까운 것은 PostToolBatch("before the next model call")이고, PreModelSwitch와 PostModelSwitch는 모델을 바꿀 때입니다. mods의 `turn.step`("about to send one request to the model")에서는 요청마다 token 사용량을 읽거나, 다른 모델로 보내거나, 모델을 부르지 않고 직접 답할 수 있습니다. 관찰만 하려면 OTel의 `claude_code.llm_request` span을 씁니다.
- "agent loop의 모든 단계에 hook이 들어간다"는 말은 위키 근거로는 "대부분의 단계"가 맞습니다(강). Claude Code settings hook에는 모델 호출이, Codex에는 context 조립과 세션 시작·끝이, Hermes에는 세션과 permission 전용 지점이, Pi와 opencode에는 permission과 sub-agent 지점이 없습니다. "every step"이라는 표현은 LangChain 1.0의 자기 설명(중)에만 있습니다.

## hook이 하는 일 (ai-wiki)

| 종류 | 예 |
|---|---|
| 막기 | Claude Code PreToolUse, Codex PreToolUse(allow·deny·ask), Pi tool_call, OpenClaw before_tool_call, opencode tool.execute.before |
| 입력·출력 바꾸기 | Claude Code PreToolUse의 updatedInput, Codex PostToolUse(MCP 출력 교체), Hermes transform_tool_result, Pi before_provider_request, opencode session.model.request(모델 교체) |
| context 넣기 | Hermes pre_llm_call, Pi before_agent_start, OpenClaw before_prompt_build, opencode session.context |
| 계속하도록 강제 | Codex Stop, Hermes pre_verify, Pi agent_before_settle, opencode experimental.idle |
| 관찰만 | Hermes post_compaction, OpenClaw의 void hook(병렬로 돌고 결과를 쓰지 않음) |
| 대신 답하기 | opencode session.compaction(결과를 직접 주고 모델 호출을 건너뜀), Claude Code mods turn.step |

## 쓰임 조사: 판정 말고도 쓰이는가 (ai-wiki 요청 14, 2026-11-24)

사용자 질문: hook이 판정·검증에만 쓰이는지, 사용자들이 다양한 쓰임을 만들어 쓰는지.

결론: 판정·검증에만 쓰이지 않습니다. Claude Code 공식 문서의 hook 예시 약 40개 중 판정·검증은 5~6개입니다(해석, 실제 사용 비율은 아님). hook이 생긴 계기도 "권한 프롬프트를 Slack으로 알려 달라"는 사용자 요청이었습니다(Cat Wu 인터뷰, 중).

처음 정리한 초안(해석): 판정은 hook 쓰임의 일부입니다. 위 "hook이 하는 일" 표의 여섯 종류 중 판정에 해당하는 것은 막기와 계속하도록 강제 둘이고, 나머지 넷은 판정이 아닙니다.

| 쓰임 | 판정인가 | 확인된 예 |
|---|---|---|
| 막기, 승인 | 판정 | PreToolUse 차단, PermissionRequest |
| 계속하도록 강제 | 판정 | Stop hook, `/goal`, Hermes pre_verify |
| context 넣기 | 아님 | Hermes pre_llm_call, Pi before_agent_start, OpenClaw before_prompt_build, opencode session.context |
| 입력 · 출력 바꾸기 | 아님 | Claude Code PreToolUse의 updatedInput(리댁션), Hermes transform_tool_result, opencode session.model.request(모델 교체) |
| 관찰만 | 아님 | Hermes post_compaction, OpenClaw의 void hook |
| 대신 답하기 | 아님 | opencode session.compaction |

- 이벤트 쪽 근거: Claude Code의 SessionStart, PreCompact, Notification 같은 이벤트는 command 계열 handler만 받습니다(위 "판정 모델을 붙이는 hook"). 판정 모델을 붙일 수 없는 이벤트가 따로 있다는 것은 판정이 아닌 쓰임을 위해 만든 지점이 있다는 뜻입니다(해석).

### 공식 예시 (Claude Code hooks 문서, 강)

| 쓰임 | 예 |
|---|---|
| 알림 | Notification hook으로 데스크톱 알림("Get notified when Claude needs input"), 터미널 알림 |
| 자동 포맷 · 린트 | PostToolUse(Edit\|Write)에서 Prettier 실행, lint 스크립트 |
| 로그 · 감사 | Bash 명령 기록, ConfigChange 감사 로그, HTTP hook으로 팀 감사 서비스에 전송 |
| context 주입 | compaction 뒤 SessionStart(compact)에서 중요한 context를 다시 넣음, UserPromptSubmit으로 브랜치 상태 주입 |
| 입력 · 출력 변환 | 응답의 마크다운 제거, FileChanged에서 줄바꿈 정규화 |
| 보안 차단 | `.env`, `.git/` 편집 차단, `rm -rf`와 DROP TABLE 차단, 편집 뒤 보안 스캔 |
| 세션 관리 | PreCompact 출력을 요약 지시로 사용, SessionEnd에서 정리 · 통계 · 상태 저장 |
| 외부 연동 | 이슈 트래커 MCP 폼에 프로젝트 키 자동 입력, 시작할 때 공유 skill 저장소 git pull |
| 워크플로 자동화 | 편집 뒤 비동기 테스트, 티켓 번호 형식 강제, ExitPlanMode 자동 승인 |
| 비용 · 토큰 | 오래된 대화를 재개할 때의 비용 보고, 모델을 바꿀 때 토큰 수 확인 |
| 판정 · 검증 | TaskCompleted에서 테스트가 실패하면 완료 차단, Stop의 prompt · agent hook |

### 다른 하니스와 실무 사례

- 다른 하니스(대부분 중): Codex는 notify와 Stop에서의 테스트, opencode는 도구 입력 오류 자동 수정과 plan · goal 알림 삽입, Pi는 rm -rf 확인 예시와 커뮤니티 비용 대시보드("no Slack hook in the core … The community has built every one."), OpenClaw는 기억 주입과 exec 출력 압축, Hermes는 보안 경고 정규식, 리댁션 패턴, compaction 전 정보 추출, 웹훅.
- Anthropic 내부(Shihipar 2026, 강): `/careful`은 skill로 켜고 끄는 PreToolUse hook으로 rm -rf, DROP TABLE, force-push, kubectl delete를 막습니다. `/freeze`는 지정한 디렉터리 밖의 편집을 막습니다. PreToolUse hook으로 사내 skill 사용 로그를 남겨 덜 쓰이는 skill을 찾습니다.
- AI-Native SDLC Playbook(강): 버그 수정 중 테스트 파일 편집을 막는 hook, 배포 단계의 승인 게이트. 원칙은 "skills are advisory only: enforce compliance with hooks or PR review".
- 커뮤니티(강): oh-my-claude의 hook 7개(SessionStart context 주입, 테스트 · 린터 명령 자동 승인, todo가 남으면 Stop 차단, context 사용량 경고, PreCompact 상태 보존 등), Anthropic 공식 플러그인 ralph-loop(Stop hook이 같은 프롬프트를 다시 넣음).
- 논문(중): 편집 뒤 eslint(OpenDev), context 70%를 넘으면 경고해 sub-agent 위임을 유도(JAZ), 턴 전에 기억 주입(NVIDIA), command hook으로 하니스 계측(JevAgentHarness). Harness-R1(강)은 학습된 편집기가 lifecycle hook 4개에 코드를 설치하고, pre-action hook을 빼면 성능이 3.9pp 떨어집니다.
- 위키에 없는 것: hook 모음 저장소(awesome-claude-code 등), 실무자 블로그의 포맷터 사례, 사용자가 만든 Codex hook.

### 정량 자료

쓰임 비율, 인기 순위, 채택 통계는 위키에 없습니다. 있는 것은 이벤트 수(Claude Code 33, Codex 14, Hermes 48, Pi 41 등)와 묶음별 hook 수 정도입니다.

### 문제 사례 (대부분 강)

- 무한 루프: Stop hook이 계속 막아 끝나지 않던 문제로 상한이 생겼습니다. 도구 호출 없이 8번 연속 막으면 Claude Code가 hook을 무시하고 턴을 끝냅니다. ralph-loop의 최대 반복 기본값은 무제한입니다.
- 느려짐: 시간 제한(command 10분, UserPromptSubmit 30초, prompt 30초, agent 60초), 느린 hook이 종료를 늦춘 버그, 포맷터 hook과 연속 편집의 충돌.
- 보안: command hook은 사용자 권한 그대로 셸 명령을 실행합니다. 신뢰 확인 전에 hook과 MCP가 먼저 초기화되던 취약점(CVE-2025-59536, CVSS 8.7, Check Point), 악성 npm 패키지가 UserPromptSubmit hook을 바꾼 사례(Cisco)가 있습니다.
- 우회: PreToolUse의 allow가 관리자 deny 규칙을 우회하던 버그가 고쳐졌고, 지금은 allow가 deny를 넘지 못합니다.

### 슬라이드에 주는 영향 (해석)

44~51쪽은 hook을 판정 지점으로만 보여 줍니다. 판정은 hook 쓰임의 일부이므로 46쪽 Hook 사용 예를 쓰임별로 넓히는 편이 사실에 맞습니다. 2026-11-25 사용자 결정으로 "Hook 쓰임"(판정 · 차단, 알림, 자동 포맷, context 주입, 로그 · 감사, 외부 연동, 세션 관리, 비용 표시)으로 넓혔습니다. 사용자가 고른 안은 46쪽을 그 자리에서 바꾸는 것이었으나, 작성하면서 Hook 섹션 맨 앞(44쪽)으로 옮겼습니다(Claude 판단, 따로 승인받지 않음, [presentation-slides.md](presentation-slides.md)의 "구성안과 순서 비교"). ai-wiki가 추천한 발표용 예는 알림(hook의 기원과 함께), 자동 포맷(Prettier), compaction 뒤 context 다시 넣기, 보안 차단(`/careful`), 관측(skill 사용 로그) 또는 외부 연동(이슈 트래커 폼 자동 입력)입니다.

## hook과 middleware (ai-wiki)

- 같은 개념으로 보는 출처(강)
  - Lin 2026은 하니스 구성요소로 "the middleware that controls context, execution, and recovery"를 두고, 부록에서 hook 메서드로 before_model, after_model, before_tool, after_tool, wrap_model_call, wrap_tool_call(과 before_agent, after_agent)을 나열합니다.
  - LangChain 1.0 발표 글: "Middleware defines a set of hooks that allow you to customize behavior in the agent loop". wrap_model_call 같은 이름은 이 글의 텍스트에 없습니다(중).
  - Claude Code mods 문서: 한 이벤트의 handler들이 middleware chain을 이룹니다.
- 나누는 출처(강): Hermes는 hook(VALID_HOOKS)과 별도의 middleware 계층을 함께 둡니다. "Middleware wraps the LLM call and tool dispatch". 감싸는 쪽이 middleware이고, 지점 이벤트가 hook입니다.
- 해석(약): 앞뒤 이벤트는 hook, 호출을 감싸는 형태는 middleware로 나누면 감싸는 상자는 middleware식 표현입니다. 발표 청중에게는 코딩 에이전트에서 익숙한 hook을 이름으로 쓰고, 각주에 "LangChain과 Lin 2026은 이 묶음을 middleware라 부름"을 답니다.

## 판정 모델을 붙이는 hook (Claude Code, ai-wiki 2026-11-24)

- settings hook의 handler는 command, http, mcp_tool, prompt, agent 다섯 종류입니다(강). prompt는 모델에 한 번 물어 판정하고, agent는 Read, Grep, Glob 같은 도구를 쓰는 sub-agent가 조건을 확인해 `{ok, reason}`을 돌려줍니다(agent는 experimental, 최대 50턴).
- prompt와 agent는 PreToolUse, PostToolUse, Stop, SubagentStop, UserPromptSubmit 등에서 쓸 수 있습니다. PermissionRequest는 prompt까지만, PreCompact와 SessionStart는 command 계열만 됩니다(강).
- 문서 예: Stop의 prompt hook이 "모든 작업이 끝났는지" 판정하고, Stop의 agent hook이 테스트를 돌려 통과 여부를 확인합니다. `/goal`은 이 prompt-based Stop hook을 내장 명령으로 감싼 것입니다(강).

## hook이 아닌 판정: auto mode classifier (ai-wiki, 2026-11-24)

hook과 비슷한 자리에서 판정하지만 hook이 아닌 기능입니다. 발표에서 Verification을 hook으로 합칠지 검토하면서 확인했습니다([presentation-slides.md](presentation-slides.md)의 "검토: Verification을 hook으로 합칠지").

- Claude Code auto mode의 classifier는 사용자 hook이 아니라 내장 permission 단계입니다(강). allow·ask·deny 규칙 → 자동 허용 범위 → classifier 순서로 도구 호출을 실행 전에 판정합니다.
- PreToolUse hook의 결정은 permission 규칙을 건너뛰지 못합니다(강). PostToolUse hook은 `classifierContext`로 classifier에게 정보를 줄 수 있습니다(강).
- 같은 자리의 기능: Codex Guardian auto_review(정책 검사 → 사용자 또는 Guardian 검토 → 실행, 강), Hermes의 smart 승인(중).
- 반대로 `/goal`은 hook(prompt-based Stop hook)으로 구현되고, 턴이 끝난 뒤 결과를 판정합니다(강).

## 판단 (해석)

- 사용자 제안의 방향이 맞습니다. hook은 단계가 아니라 단계 앞뒤에 끼우는 지점이라, 감싸는 상자가 뜻을 더 정확히 보여 줍니다. 지금 그림에서 빠진 post-tool hook과 모델 호출 쪽 hook도 드러납니다.
- 감싸는 상자는 모델 호출과 도구 호출 두 곳에 둡니다. 루프가 바깥(모델 제공자, 실행 환경)과 만나는 곳이고, 앞뒤 짝으로 지점이 가장 흔한 곳입니다. 각주는 도구 상자에 "6개 하니스 모두", 모델 상자에 "Claude Code는 settings hook에 없고 mods로만"을 답니다.
- 나머지 지점(세션 시작·끝, 사용자 입력, context 조립, compaction 전후, permission 요청, sub-agent 시작·끝)은 각주 한 줄로 둡니다. stop hook은 지금처럼 멈추기 전 검증 블록에 적습니다.
- 도구 쪽 상자는 permission·sandbox와 도구 실행을 함께 감쌉니다. Claude Code는 pre-tool hook이 permission보다 먼저이고(중), Hermes와 opencode는 permission이 도구 실행 안에 있어 두 경우 모두 맞습니다.

## 보드 반영 (2026-11-24, 사용자 승인)

| 보기 | 바꾼 것 |
|---|---|
| 구현요소 흐름(따로 그린 버전) | "③ hook (pre-tool)" 블록과 그 화살표 둘을 지우고, 모델 호출에서 permission으로 바로 이음("도구 호출 있음"). "hook: 모델 호출 전후" 상자로 모델 호출을, "hook: 도구 호출 전후 (pre-tool, post-tool)" 상자로 permission·sandbox와 도구 실행을 감쌈. 번호를 ① context 조립, ② compaction 확인, 모델 호출, ③ permission·sandbox, ④ 도구 실행, ⑤ loop guard, ⑥ 멈추기 전 검증으로 당김. 오른쪽 빈자리에 각주(두 상자의 근거, 그 밖의 hook 지점, middleware라는 이름)를 둠 |
| 관계를 겹친 버전 | 모델 호출에서 permission으로 바로 잇고(③), hooks를 거치던 ④ 화살표를 지움. 나머지 번호를 ④, ⑤, ⑥으로 당김. ③ 화살표가 "Permission controls" 상자 제목을 가로지르지 않도록 행 사이로 돌려 permission 블록의 오른쪽으로 들어가게 함. 그 길을 비우려고 hooks 블록을 아랫줄 둘째 행으로 내림. 범례에 "hooks는 단계가 아니라 모델 호출과 도구 호출 앞뒤에 끼우는 지점"을 더함 |
| 연결 다이어그램 | hooks 블록 이름을 "hooks (모델·도구 호출 앞뒤, stop)"으로 바꾸고, 겹친 버전과 같게 둘째 행으로 내림. Permission controls와 Verification의 경계에 걸친 것은 그대로 |
| 매트릭스 | hooks 행 이름을 같게 바꿈. Permission controls ●, Verification ○는 그대로 |

- 반영 직전에 사용자가 흐름을 먼저 손봤습니다. loop guard를 왼쪽 가운데 행으로 올리고, "도구 호출 루프 (한 턴)" 제목을 goal 루프 상자 왼쪽 위로 옮기고, 도구 실행 → loop guard 화살표를 그에 맞게 바꿨습니다. 이 배치는 그대로 두고 번호만 고쳤습니다.
- MC 번호와의 대응: 보드의 ③~⑥은 MC의 ④~⑦이고, MC의 ③(pre-tool hook)은 도구 쪽 hook 상자가 됐습니다.
- 브라우저 창에서 보드 영역이 비어 보여 화면으로는 확인하지 못했습니다. 좌표로만 겹침을 확인했습니다.

## 변경 이력

- 2026-11-25: 44쪽으로 옮긴 것은 사용자 결정이 아니라 Claude 판단임을 바로잡음
- 2026-11-25: 슬라이드 반영(44쪽 Hook 쓰임)을 적음
- 2026-11-24: 쓰임 조사 결과를 정리함(공식 예시 쓰임별 표, 다른 하니스와 실무 사례, 정량 자료 없음, 문제 사례, 슬라이드에 주는 영향)
- 2026-11-24: 쓰임 조사 절을 더함(판정과 판정이 아닌 쓰임의 초안, ai-wiki 요청 14 확인 중)
- 2026-11-24: 판정 모델을 붙이는 hook(prompt, agent handler) 절을 더함(ai-wiki 요청 13)
- 2026-11-24: hook이 아닌 판정(auto mode classifier, Guardian) 절을 더함(ai-wiki 요청 12)
- 2026-11-24: 사용자 승인으로 보드에 반영(흐름의 hook 상자 두 개와 각주, 번호 당김, 겹친 버전의 번호와 ③ 경로, hooks 블록 이름과 위치, 매트릭스 행 이름)
- 2026-11-24: agent-components-implementation.md에서 hook 표현 검토를 나눠 새 문서로 만듦. ai-wiki 답(하니스별 hook 지점, hook이 하는 일, hook과 middleware, "모든 단계" 확인)을 반영하고 두 상자의 각주를 정함
