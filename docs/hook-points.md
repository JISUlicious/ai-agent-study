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

## hook과 middleware (ai-wiki)

- 같은 개념으로 보는 출처(강)
  - Lin 2026은 하니스 구성요소로 "the middleware that controls context, execution, and recovery"를 두고, 부록에서 hook 메서드로 before_model, after_model, before_tool, after_tool, wrap_model_call, wrap_tool_call(과 before_agent, after_agent)을 나열합니다.
  - LangChain 1.0 발표 글: "Middleware defines a set of hooks that allow you to customize behavior in the agent loop". wrap_model_call 같은 이름은 이 글의 텍스트에 없습니다(중).
  - Claude Code mods 문서: 한 이벤트의 handler들이 middleware chain을 이룹니다.
- 나누는 출처(강): Hermes는 hook(VALID_HOOKS)과 별도의 middleware 계층을 함께 둡니다. "Middleware wraps the LLM call and tool dispatch". 감싸는 쪽이 middleware이고, 지점 이벤트가 hook입니다.
- 해석(약): 앞뒤 이벤트는 hook, 호출을 감싸는 형태는 middleware로 나누면 감싸는 상자는 middleware식 표현입니다. 발표 청중에게는 코딩 에이전트에서 익숙한 hook을 이름으로 쓰고, 각주에 "LangChain과 Lin 2026은 이 묶음을 middleware라 부름"을 답니다.

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

- 2026-11-24: 사용자 승인으로 보드에 반영(흐름의 hook 상자 두 개와 각주, 번호 당김, 겹친 버전의 번호와 ③ 경로, hooks 블록 이름과 위치, 매트릭스 행 이름)
- 2026-11-24: agent-components-implementation.md에서 hook 표현 검토를 나눠 새 문서로 만듦. ai-wiki 답(하니스별 hook 지점, hook이 하는 일, hook과 middleware, "모든 단계" 확인)을 반영하고 두 상자의 각주를 정함
