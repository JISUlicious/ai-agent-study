# 출처 사본: 에이전트 구현 모듈 대응표 (analysis-docs)

analysis-docs 세션이 2026-11-26에 보낸 종합 문서 `agent-modules/에이전트_구현모듈_대응표.md`의 사본입니다.
원본 저장소(JISUlicious/analysis-docs)에는 아직 푸시되지 않았습니다. 상대 링크 "상세/…"의 프레임워크별 상세 파일 6개는 이 사본에 없습니다.
GitHub 링크는 analysis-docs가 태그 고정으로 확인한 것이고, 이 저장소 쪽에서는 다시 열어 보지 않았습니다.

---

# 에이전트 구현 모듈 대응표 — SDK 6종 · 코딩 하니스 5종

> 조사 기준일: 2026-11-26. 모든 저장소를 최신 릴리스 태그로 얕게 clone해 읽었다(실행·빌드하지 않음).
> 관점: 에이전트를 직접 구현하는 개발자가 만들어야 하는 모듈. 사용자 기능 목록이 아니다.

## 0. 결론

1. **11개 대상 모두에 있는 것은 Model client, Loop, Context 조립, Tool 실행기 네 가지다.** 100줄짜리 mini-swe-agent도 이 넷과 실행 환경, 메시지 목록, 종료 조건·한도를 갖고 있다.
2. **Model client와 Loop는 나눠 그리는 것이 코드와 맞다.** OpenAI·ADK·Pi·mini-swe-agent·opencode가 둘을 다른 클래스·패키지로 둔다. 예외는 Claude Agent SDK로, 둘 다 CLI 프로세스 안에 있다.
3. **Hook·Middleware(M12)는 여러 프레임워크에서 다른 모듈의 기반 계층이다.** LangChain v1 middleware, Pydantic AI capability, Pi extension, Codex 확장 API 위에 compaction·todo·권한·HITL·skills가 플러그인으로 올라간다.
4. **세션 저장(M3)·Checkpoint(M16)·Compaction(M5)은 한 저장 구조를 공유하는 경우가 많다.** LangGraph의 checkpointer, OpenHands의 이벤트 로그, opencode의 이벤트 테이블이 그렇다. 반면 파일 체크포인트(작업공간 되돌리기)는 대화 재개와 별개의 장치다.
5. **목록에 빠진 모듈 후보**: Loop guard·예산(턴·비용 한도, 재시도, 모델 fallback), Structured output·종료 판정, 이벤트 스트림·전송 프로토콜, 도구 노출 관리(tool search·deferred loading), 모델 카탈로그·인증·설정.

## 1. 대상과 버전

| 약칭 | 대상 | 저장소 · 태그 · 커밋 |
|---|---|---|
| CC | Claude Agent SDK (Python) | anthropics/claude-agent-sdk-python `v0.2.189` `6c1b03f` |
| OA | OpenAI Agents SDK (Python) | openai/openai-agents-python `v0.26.0` |
| LG | LangGraph 계열 | langgraph `1.2.24` `58a6e1c` · langchain `langchain==1.5.2` `ced9bdb` · deepagents `deepagents==0.7.41` `5568767` · langchain-mcp-adapters `0.3.2` |
| ADK | Google ADK | google/adk-python `v2.15.1` `4798b7f` |
| PyAI | Pydantic AI | pydantic/pydantic-ai `v2.75.0` `ffbcf3e` (같은 저장소의 `pydantic-ai-harness` 0.75.0 포함) |
| smol | smolagents | huggingface/smolagents `v1.26.0` `12c1bc8` |
| Codex | Codex CLI (codex-rs) | openai/codex `rust-v0.172.0` `3d86e43` |
| OH | OpenHands | OpenHands/software-agent-sdk `v1.64.1` `5f1430e` (앱 저장소 v1.46.0은 프런트엔드만 있음) |
| oc | opencode | anomalyco/opencode(구 sst/opencode) `v1.19.6` `f4e363c` |
| Pi | Pi coding agent | earendil-works/pi(구 badlogic/pi-mono) `v1.6.1` `ef4a1cf` |
| mini | mini-swe-agent | SWE-agent/mini-swe-agent `v2.4.6` `a83fcae` |

- CC는 루프·compaction 등이 공개되지 않은 CLI 안에 있어서, 그 동작은 공식 문서 근거다.
- 하위 조사 결과 중 4건(OA 기본 도구 오류 문구, LangGraph 도구 오류 기본 처리, Codex `ToolExecutor` trait, deepagents todo 기본 제외)은 원문 코드를 다시 열어 대조했다.

## 2. 대응표

○ 있음 · △ 부분·간접·한정 · × 없음 · ×e 코어에는 없고 extension 예제로 제공(Pi)

| 모듈 | CC | OA | LG | ADK | PyAI | smol | Codex | OH | oc | Pi | mini |
|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 Model client | △¹ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M2 Agent loop·Runner | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M3 Message·Session 저장 | ○ | ○ | ○² | ○ | ○ | △ | ○ | ○ | ○ | ○ | △ |
| M4 Prompt·Context 조립 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M5 Context 관리(compaction) | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | ○ | × |
| M6 Tool registry·실행기 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | △³ |
| M7 MCP client | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○⁴ | × |
| M8 Skills 로더 | ○ | △⁵ | ○ | ○ | ○ʰ | × | ○ | ○ | ○ | ○ | × |
| M9 Memory(장기) | △ | △⁵ | ○ | ○ | ○ʰ | × | ○ | △ | × | × | × |
| M10 Planning·Task | △ | × | ○ | △ | ○ʰ | ○ | ○ | ○ | ○ | ×e | × |
| M11 Sub-agent·Handoff | ○ | ○ | ○ | ○ | ○ʰ | ○ | ○ | ○ | ○ | ×e | × |
| M12 Hook·Callback·Middleware | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | ○ | △ |
| M13 Permission·Guardrail | ○ | ○ | ○ | △ | ○ | △ | ○ | ○ | ○ | ×e | △ |
| M14 Sandbox·실행 환경 | △ | ○⁵ | ○ | ○ | △/○ʰ | ○⁶ | ○ | ○⁷ | × | ×e | ○ |
| M15 HITL(승인·중단·재개) | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | △ | △ |
| M16 Checkpoint·Resume | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | △ | × |
| M17 Tracing·Observability | ○ | ○ | △⁸ | ○ | ○ | △ | ○ | ○ | ○ | △ | △ |
| M18 Evaluation | × | × | △⁸ | ○ | ○ | × | × | △ | × | △⁹ | △ |

1. CC: 모델 호출은 CLI 안에 있고, SDK는 `model`·`fallback_model` 같은 옵션만 넘긴다. 모델 클래스를 꽂을 자리가 없다.
2. LG: 세션 저장 전용 모듈은 없다. thread 단위 checkpointer가 세션 저장과 재개를 함께 맡는다.
3. mini: 도구는 bash 하나다. 레지스트리가 없고, 호출 형식 오류를 모델에 돌려주는 파서만 있다.
4. Pi: 번들 내장 extension(`pi-mcp`)으로 제공한다. 2026-11-18 무렵 조사와 달라진 점이다.
5. OA: Skills·Memory·sandbox compaction capability는 `SandboxAgent`에서만 동작한다. 일반 `Agent`에는 없다.
6. smol: `CodeAgent`에만 해당한다(코드 실행기).
7. OH: "어디서 실행하나"(Local/Docker/원격 Workspace)만 있고 OS 수준 격리(Seatbelt·Landlock) 모듈은 없다.
8. LG: 라이브러리에는 계측 지점만 있고 저장·UI·평가 실행은 LangSmith(상용)에 있다.
9. Pi: 저장소 안 private 패키지 `pi-evals`. 배포되는 하니스에는 없다.
- ʰ PyAI: 코어가 아니라 같은 저장소의 `pydantic-ai-harness`(0.x, API 변경 가능)에 있다.
- LG 열은 LangGraph + LangChain v1 + deepagents + mcp-adapters를 합친 값이다. LangGraph 코어만 보면 M4·M7·M8·M10·M13·M14가 ×다.

## 3. 모듈별 핵심 인터페이스 (공통 형태 → 실제 시그니처, 태그 고정 링크)

- M1 `stream(model, messages, tools, settings) → 이벤트 스트림(텍스트 델타, tool call, usage, stop reason)`
  - OA `Model.get_response(...)` / `stream_response(...)` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/models/interface.py#L37
  - ADK `BaseLlm.generate_content_async(llm_request, stream) -> AsyncGenerator[LlmResponse]` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/models/base_llm.py
  - Pi `Models.stream(model, context, options) -> AssistantMessageEventStream` https://github.com/earendil-works/pi/blob/v1.6.1/packages/ai/src/models.ts#L266
- M2 `run(input)`: 모델 호출 → tool call이 있으면 실행하고 결과를 붙여 반복, 없으면 종료(또는 stop gate)
  - mini `DefaultAgent.run` / `step` https://github.com/SWE-agent/mini-swe-agent/blob/v2.4.6/src/minisweagent/agents/default.py
  - Pi `agentLoop(prompts, context, config, signal, streamFn)` https://github.com/earendil-works/pi/blob/v1.6.1/packages/agent/src/agent-loop.ts#L47
  - OA `Runner.run(starting_agent, input, ...)` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/run.py#L280
- M3 `append(session, item)` / `load(session_id)` (+ list·fork)
  - OA `Session.get_items / add_items / pop_item / clear_session` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/memory/session.py#L70
  - ADK `BaseSessionService.create_session / get_session / append_event` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/sessions/base_session_service.py
  - OH `ConversationState` + 이벤트 로그 https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/conversation/state.py
- M4 `build(request) → system prompt + 지시 파일(AGENTS.md 등) + 동적 섹션 + history`
  - LG `wrap_model_call(request: ModelRequest, handler)`, `request.override(...)` https://github.com/langchain-ai/langchain/blob/langchain==1.5.2/libs/langchain_v1/langchain/agents/middleware/types.py
  - ADK request processor 체인 https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/flows/llm_flows/prompt/_instructions.py
  - Codex `ContextualUserFragment`
- M5 `should_compact(usage) → compact(history) → 요약으로 교체` + 도구 출력 truncation
  - Pi `shouldCompact / prepareCompaction / compact` https://github.com/earendil-works/pi/blob/v1.6.1/packages/coding-agent/src/core/compaction/compaction.ts#L267
  - OH `CondenserBase.condense(view, agent_llm)` https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/context/condenser/base.py
  - Codex `run_inline_auto_compact_task` https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/core/src/compact.rs
- M6 `Tool = name + description + inputSchema + execute(args, ctx) → result | error`
  - OA `FunctionTool = name + description + params_json_schema + on_invoke_tool(ctx, args_json)` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/tool.py#L455
  - Codex `trait ToolExecutor<Invocation> { tool_name, spec, exposure, supports_parallel_tool_calls, handle }` https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/tools/src/tool_executor.rs
  - OH `ToolDefinition[ActionT, ObservationT]` + `ToolExecutor.__call__(action, conversation)` https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/tool/tool.py
- M7 `connect(server) → list_tools → 각 도구를 M6 Tool로 감싸 등록 → call_tool`
  - ADK `McpToolset(connection_params, tool_filter)` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/tools/mcp_tool/mcp_toolset.py
  - OA `MCPServerStdio` / `MCPServerStreamableHttp` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/mcp/server.py#L562
  - Pi `McpClient` https://github.com/earendil-works/pi/blob/v1.6.1/packages/mcp/src/client.ts#L156
- M8 `discover(dirs) → name·description만 프롬프트에 → 활성화 시 SKILL.md 본문 → 리소스는 필요할 때`
  - ADK `SkillToolset`(ListSkills·LoadSkill·LoadSkillResource·RunSkillScript 도구) https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/tools/skill_toolset.py
  - Codex `codex-skills` 로더 https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/skills/src/loading.rs
  - Pi `loadSkills` / `formatSkillsForPrompt` https://github.com/earendil-works/pi/blob/v1.6.1/packages/coding-agent/src/core/skills.ts#L414
- M9 `add(session | note)` / `search(query)` → 결과를 컨텍스트에 주입
  - ADK `add_session_to_memory(session)` / `search_memory(app_name, user_id, query)` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/memory/base_memory_service.py
  - LG `BaseStore`(namespace·key, 선택적 임베딩 검색) https://github.com/langchain-ai/langgraph/blob/1.2.24/libs/checkpoint/langgraph/store/base/__init__.py
  - Codex memories(추출 → 통합 → MEMORY.md) https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/memories/README.md
- M10 `write_todos(todos[{content, status}])` 도구 + plan 모드
  - Codex `update_plan` https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/core/src/tools/handlers/plan_spec.rs
  - oc `todowrite` https://github.com/anomalyco/opencode/blob/v1.19.6/packages/opencode/src/tool/todo.ts#L14
  - OH `TaskTrackerTool` https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-tools/openhands/tools/task_tracker/definition.py
- M11 (a) 도구형 `task(prompt, subagent_type) → 최종 메시지` (b) handoff: 현재 에이전트를 바꿈
  - OA `Handoff` / `Agent.as_tool()` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/handoffs/__init__.py#L127
  - ADK `transfer_to_agent(agent_name)` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/tools/transfer_to_agent_tool.py
  - oc `task` 도구(자식 세션) https://github.com/anomalyco/opencode/blob/v1.19.6/packages/opencode/src/tool/task.ts#L81
- M12 `before / after / wrap × {run, model, tool}`. 반환값으로 단계를 막거나 대체
  - LG `AgentMiddleware`: before_agent / before_model / wrap_model_call / after_model / wrap_tool_call / after_agent https://github.com/langchain-ai/langchain/blob/langchain==1.5.2/libs/langchain_v1/langchain/agents/middleware/types.py
  - ADK `BasePlugin` 콜백 https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/plugins/base_plugin.py
  - oc `type Plugin = (input, options) => Promise<Hooks>` https://github.com/anomalyco/opencode/blob/v1.19.6/packages/plugin/src/index.ts#L222
- M13 `decide(tool, args, ctx) → allow | ask | deny`(+ 수정된 args). 내용 검사는 `check(input/output) → tripwire`
  - CC `CanUseTool(tool_name, input, ctx) -> PermissionResultAllow | Deny` https://github.com/anthropics/claude-agent-sdk-python/blob/v0.2.189/src/claude_agent_sdk/types.py#L25
  - OH `SecurityAnalyzerBase.security_risk(action)` + `ConfirmationPolicyBase.should_confirm(risk)` https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/security/analyzer.py
  - OA `InputGuardrail` → `GuardrailFunctionOutput(tripwire_triggered)` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/guardrail.py#L72
- M14 `execute(command, cwd, timeout, env) → {output, exit_code}`를 격리 경계 안에서
  - mini `Environment.execute(action) -> {output, returncode, exception_info}` https://github.com/SWE-agent/mini-swe-agent/blob/v2.4.6/src/minisweagent/environments/local.py
  - OH `BaseWorkspace` https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/workspace/base.py
  - Codex `SandboxType`(Seatbelt / Linux seccomp / Windows) https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/protocol/src/sandbox.rs
- M15 `멈춤 → 대기 중 승인 목록 반환 → approve/reject → 재개`
  - OA `result.interruptions` → `RunState.approve/reject` → `Runner.run(agent, state)` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/result.py#L580
  - LG `interrupt(value)` / `Command(resume=...)` https://github.com/langchain-ai/langgraph/blob/1.2.24/libs/langgraph/langgraph/types.py
  - PyAI `DeferredToolRequests` → `DeferredToolResults` https://github.com/pydantic/pydantic-ai/blob/v2.75.0/pydantic_ai_slim/pydantic_ai/_deferred.py#L42
- M16 `save(state) / load(id) → resume | fork | rewind`. 파일 체크포인트는 별도
  - LG `BaseCheckpointSaver.get_tuple / put / put_writes` https://github.com/langchain-ai/langgraph/blob/1.2.24/libs/checkpoint/langgraph/checkpoint/base/__init__.py
  - OA `RunState.to_string / from_string` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/run_state.py#L843
  - oc `Snapshot`(사이드 git 저장소에 step마다 track) https://github.com/anomalyco/opencode/blob/v1.19.6/packages/opencode/src/snapshot/index.ts#L36
- M17 OTel span(agent → model call → tool) + 토큰·비용 집계
  - OA `trace()`·`agent_span`·`function_span` https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/tracing/create.py#L31
  - PyAI `Instrumentation`(OTel GenAI semconv) https://github.com/pydantic/pydantic-ai/blob/v2.75.0/pydantic_ai_slim/pydantic_ai/capabilities/instrumentation.py#L114
  - Codex `SessionTelemetry` https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/otel/src/events/session_telemetry.rs
- M18 `dataset(cases) × run(agent) → evaluator(trajectory, 최종 답, LLM judge) → report`
  - ADK `AgentEvaluator.evaluate(...)`, CLI `adk eval` https://github.com/google/adk-python/blob/v2.15.1/src/google/adk/evaluation/agent_evaluator.py
  - PyAI `Dataset.evaluate(task) -> EvaluationReport` https://github.com/pydantic/pydantic-ai/blob/v2.75.0/pydantic_evals/pydantic_evals/dataset.py#L175
  - OH `CriticBase.evaluate(events, git_patch)`(실행 중 평가) https://github.com/OpenHands/software-agent-sdk/blob/v1.64.1/openhands-sdk/openhands/sdk/critic/base.py

**M6의 병렬 호출과 오류 처리.** 구현마다 크게 다르다. 발표에서 "도구 오류는 모델에 돌려준다"고 일반화하면 틀린다.

| 대상 | 병렬 | 도구 실행 중 예외 |
|---|---|---|
| OA | 한 턴의 function tool 호출을 동시에 실행 | 기본 `default_tool_error_function`이 예외 내용을 숨기고 고정 문구 "An error occurred while running the tool."를 모델에 보냄 |
| LG (`create_agent`) | `ToolNode`가 병렬 실행 | 인자 검증 오류는 `ToolMessage(status="error")`로 반환. 실행 중 예외는 기본으로 run을 멈추고, `ToolErrorMiddleware`를 넣어야 모델에 돌려줌 |
| ADK | `asyncio.gather`로 병렬 | 모델이 지어낸 도구 이름은 `{"error": ...}`로 반환. 실행 중 예외는 `on_tool_error` 콜백이 응답을 주지 않으면 raise |
| PyAI | 기본 병렬, 도구별 `sequential=True` | `ModelRetry`·검증 오류는 재시도로 반환(기본 1회). 그 밖의 예외는 run 밖으로 전파 |
| smol | `ToolCallingAgent`만 스레드 풀 병렬 | 오류를 관찰값("Error: … Now let's retry")으로 돌려줌. 상한은 `max_steps`뿐 |
| Codex | 병렬 지원을 선언한 도구만 동시 실행(`RwLock` read), 나머지는 배타 실행 | `FunctionCallError::RespondToModel`은 `success: false` 출력으로 모델에 반환, `Fatal`은 턴 종료 |
| mini | 순차 | 형식 오류를 user 메시지로 돌려주고 3회 연속이면 종료 |

## 4. 후보 목록 보정 제안

### 4.1 빠진 모듈

| 후보 | 근거(별도 모듈로 둔 곳) |
|---|---|
| **Loop guard·예산** (턴·비용·시간 한도, 모델 재시도, fallback, 라우팅) | mini `step_limit`·`cost_limit`, PyAI `UsageLimits`·`FallbackModel`, LG `ModelRetryMiddleware`·`ModelFallbackMiddleware`·`recursion_limit`(`GraphRecursionError`), OA `ModelRetrySettings`·`MaxTurnsExceeded`, OH `FallbackStrategy`·`RouterLLM`, ADK `_fallback_model.py`, CC `fallback_model`·`max_budget_usd` |
| **Structured output·종료 판정** | OA `output_type`·`tool_use_behavior`, LG `ToolStrategy`/`ProviderStrategy`(종료 조건과 재시도 엣지에 직접 들어감), PyAI `output.py`, CC `output_format`, smol `final_answer` 도구 |
| **이벤트 스트림·전송 프로토콜** | Codex SQ/EQ(`Op`/`EventMsg`)와 app-server, oc HTTP/SSE 서버, OA `stream_events()`, LG stream mode 7종, CC control protocol(`Query`) |
| **도구 노출 관리** (tool search, deferred loading, code mode) | LG `LLMToolSelectorMiddleware`·`ProviderToolSearchMiddleware`, PyAI `ToolSearch`, Pi `tool_search`·codemode, Codex `ToolExposure` |
| **모델 카탈로그·인증·설정** | oc models.dev 카탈로그, Pi `Models`(provider 등록·auth), Codex config, CC `setting_sources` |
| **실행 컨텍스트(DI)** — 작음 | OA `RunContextWrapper`, LG `Runtime[ContextT]`, PyAI `deps` |
| **Testing(가짜 모델)** — Evaluation과 별개 | OA `agents.testing.ScriptedModel`, PyAI `TestModel`/`FunctionModel`, LG `LLMToolEmulator` |

### 4.2 합치거나 위계로 그릴 것

- **M1과 M2는 합치지 않는다.**
  - 둘을 나누는 곳: OA(`Model`/`ModelProvider` ↔ `Runner`), ADK(`BaseLlm` ↔ `BaseLlmFlow`), Pi(`pi-ai` ↔ `pi-agent-core`, 모델 호출을 `StreamFn`으로 주입), mini(`Model` ↔ `DefaultAgent`).
  - 단 Pi에서 보듯 **메시지·도구 공용 스키마는 모델 클라이언트 쪽에 있다.** M1을 "프로바이더 어댑터 + 공용 메시지 스키마"로 정의하면 코드와 맞다.
- **M12를 바닥 계층으로 그린다.** 다른 모듈이 그 위에 올라가는 구조다.
  - LG: M5·M8·M10·M11·M13·M15가 모두 `AgentMiddleware` 구현이다.
  - PyAI: `AbstractCapability` 위에 있다.
  - Pi: extension(`pi.on(...)`) 위에 있다.
  - Codex: `ext/extension-api` 위에 있다.
- **M3·M5·M16은 저장 기반 하나 위에 얹는다.**
  - LG checkpointer: 세션이 곧 체크포인트다.
  - OH append-only 이벤트 로그: 저장, `Condensation` 이벤트, 재개, fork가 모두 이 위에서 된다.
  - oc 이벤트 테이블, Codex rollout JSONL도 같은 구조다.
- **M7은 M6의 어댑터다.** 모든 구현이 MCP 도구를 자체 Tool 객체로 바꿔 같은 실행기로 돌린다.
- **M13·M15는 같은 승인 채널을 쓴다.**
  - CC: `can_use_tool` 하나가 권한 승인과 사용자 질문을 함께 받는다.
  - OA: `needs_approval`이 곧 HITL interruption이다.
  - oc: `Permission.ask`와 `Question.ask`가 같은 큐 구조다.
  - Codex: M13·M14·M15를 `ToolOrchestrator` 한 흐름으로 묶는다(승인 판단 → 샌드박스 실행 → 실패 시 승인 후 재시도).
- **M11은 M6 위에 있다.** 하위 에이전트는 거의 모두 도구로 호출된다. 제어를 넘기는 handoff는 OA와 ADK에만 있다.

### 4.3 나눌 것

- **M2 → 실행 런타임 / 턴 처리.**
  - OA: `run_loop`·`turn_preparation`·`turn_resolution`·`tool_execution`
  - oc: 세션 루프(`runLoop`)와 스트림 처리기(`SessionProcessor`)
  - LG: 범용 런타임(Pregel)과 루프 정의(`create_agent`)
- **M6 → 도구 레지스트리·노출 / 도구 실행기.**
  - Pi: 실행기는 `pi-agent-core`, 정의·레지스트리는 coding-agent에 있다.
  - oc: v2 문서가 레지스트리는 실행 권한을 판단하지 않는다고 명시한다.
- **M9 → 저장·검색 엔진 / 기억 주입 정책.** 두 종류가 섞여 있다.
  - 진짜 저장소+검색: ADK MemoryService, LG `BaseStore`, Codex memories
  - 파일을 프롬프트에 넣는 방식: CC CLAUDE.md·auto memory, OH MEMORY.md, deepagents `MemoryMiddleware`
- **M13 → 정책 판정 / 판정자 / 내용 guardrail.**
  - Codex: 정책(`AskForApproval`·execpolicy)과 검토자(사용자 또는 guardian LLM)를 분리한다.
  - OH: 위험도 산정(`SecurityAnalyzer`)과 확인 여부(`ConfirmationPolicy`)를 나눈다.
  - OA·LG의 입력·출력 guardrail(PII, tripwire)은 권한과 다른 축이다.
- **M14 → OS 격리 / 실행 위치.**
  - Codex: 둘 다 있다(Seatbelt·bubblewrap+seccomp와 원격 exec-server).
  - OH: 실행 위치(Workspace)만 있다.
  - oc: 둘 다 없고 git worktree가 대신한다.
- **M16 → 대화 재개·fork / 작업공간(파일) 체크포인트 / durable execution.**
  - CC: `rewind_files`는 대화를 되돌리지 않는다.
  - oc: `Snapshot`은 사이드 git 저장소를 쓴다.
  - PyAI: 문서가 "Durability is not storage"라고 적고 Temporal·DBOS·Prefect를 따로 둔다.
- **M18 → 오프라인 평가 / 실행 중 검증.**
  - 오프라인: ADK, pydantic-evals, LangSmith
  - 실행 중: OH `CriticBase`, deepagents `RubricMiddleware`가 루프 안에서 결과를 채점하고 재시도한다. 이쪽은 루프의 Verification(stop gate)으로 보는 편이 맞다.

### 4.4 이름 충돌 주의

| 이름 | 실체 |
|---|---|
| OA `agents.memory` | 대화 이력 `Session`. 장기 기억은 `agents.sandbox`의 `Memory` capability |
| smol `AgentMemory` | 프로세스 안 step 기록(M3). 장기 기억이 아니다 |
| deepagents `MemoryMiddleware` | AGENTS.md를 프롬프트에 넣는 정책. 저장·검색 엔진이 아니다 |
| ADK `planners` | 프롬프트·thinking 설정. todo 상태 관리가 아니다 |

## 5. 최소 에이전트와 프로덕션 하니스

mini-swe-agent v2.4.6의 `DefaultAgent`(https://github.com/SWE-agent/mini-swe-agent/blob/v2.4.6/src/minisweagent/agents/default.py)는 README가 "Just some 100 lines"라고 부르는 클래스다(파일은 직렬화 포함 190줄). 이것이 최소 구성의 기준이다.

| 구분 | 모듈 | mini-swe-agent의 구현 |
|---|---|---|
| **최소에 꼭 있는 것** | M1 Model client | `Model.query(messages) -> dict` (LiteLLM, 재시도·비용 계산) |
| | M2 Loop | `run`: `while True: step()`; `step = execute_actions(query())`; 마지막 메시지 role이 `exit`면 종료 |
| | M4 Prompt 조립 | Jinja `system_template`·`instance_template`로 메시지 2개를 만들고 이후 누적 |
| | M6(축소) Tool 1개 + 행동 파서 | `bash` 도구 하나. 형식 오류는 `FormatError`로 모델에 돌려줌 |
| | M14 실행 환경 | `Environment.execute(action)` (subprocess, 타임아웃 시 프로세스 그룹 kill). Docker 등은 같은 인터페이스 |
| | 종료 조건·한도 | 출력 첫 줄 `COMPLETE_TASK_AND_SUBMIT_FINAL_OUTPUT`, `step_limit`·`cost_limit`·`wall_time_limit_seconds` |
| | M3(축소) 메시지 목록 | `self.messages` + 매 step 뒤 trajectory JSON 저장 |
| **선택으로 붙는 것** | M15 확인 모드 | `InteractiveAgent`의 human / confirm / yolo 모드 |
| **프로덕션에서 더해지는 것** | M3 영속 세션 + M16 재개·fork·rewind | Codex rollout+SQLite, oc SQLite 이벤트 로그, Pi JSONL 트리 |
| | M5 Compaction | 11개 중 mini에는 없고 smol은 출력 truncation뿐 |
| | M6 도구 레지스트리(다수 도구, 병렬, 출력 truncation) + M7 MCP + M8 Skills | 코딩 하니스 4종 모두 |
| | M12 Hook + M13 권한 + M15 승인 채널 | Pi는 차단 지점(`beforeToolCall`)만 코어에 두고 정책은 extension |
| | M14 OS 격리 | Codex만 기본으로 켜짐(oc·Pi 코어에는 없음) |
| | M10 Planning, M11 Sub-agent | Codex·OH·oc는 코어, Pi는 extension 예제 |
| | M17 Tracing, 이벤트 스트림·서버 프로토콜, 모델 카탈로그·인증 | Codex app-server, oc HTTP/SSE, Pi `pi-ai` 카탈로그 |
| | M9 장기 메모리 | 코딩 하니스 중 Codex만 추출·통합 파이프라인. OH는 MEMORY.md 주입, oc·Pi는 없음 |

**Pi는 둘 사이의 기준점이다.** 코어에는 M1~M8(MCP는 번들 extension)과 M12만 둔다. Planning·Sub-agent·Permission·Sandbox·파일 체크포인트는 extension 예제로 넘겼다. 그 예제가 모두 M12(`pi.on(...)`, `registerTool`)만으로 구현된다는 점이 4.2의 "M12를 바닥 계층으로" 제안의 근거다.

## 6. 근거 범위와 미확인

- 6묶음 중 5묶음은 프레임워크별 하위 조사로 만들었고, ADK와 mini-swe-agent는 직접 읽었다. 하위 조사 결과 중 4건은 원문 코드로 다시 대조했다.
- CC의 루프·compaction·도구 실행·API 재시도는 공개되지 않은 CLI 안에 있어 공식 문서 근거다. 비공식 분석은 쓰지 않았다.
- LangSmith(트레이스 저장, Evaluation 실행, Sandbox)와 Logfire는 상용 서비스라 코드를 보지 않았다.
- `agentevals`, `langgraph-supervisor`, `langgraph-swarm`, OpenHands `benchmarks` 저장소는 범위 밖이다.
- smolagents가 쓰는 mcpadapt가 MCP sampling·elicitation을 처리하는지는 확인하지 못했다.
- Codex 공식 문서 주소 `developers.openai.com/codex`는 2026-11-26 현재 `learn.chatgpt.com/docs`로 308 이동한다.
