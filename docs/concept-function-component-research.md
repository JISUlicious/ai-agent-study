# 발표 조사: 에이전트의 개념 · 기능 · 구성요소

새 발표(3부 구성)를 위한 조사 문서입니다. 슬라이드를 만들기 전 단계입니다.

- 1부 개념, 2부 기능: 추상적이고 넓은 범주로 묶습니다.
- 3부 구성요소: 사용자 관점이 아니라, 구현하는 개발자가 만들어야 하는 모듈로 나눕니다.

## 조사 상태

| 부 | 요청한 곳 | 상태 |
|---|---|---|
| 1부 개념 · 2부 기능 | ai-wiki (2026-11-25 요청) | 답 받음. 위키에 없던 원문(Wooldridge & Jennings, OpenAI 가이드, Feng 2025, Xi 2023, CoALA)은 이 세션에서 직접 확인 |
| 3부 구성요소 | analysis-docs (2026-11-25 요청) | 답 받음 (프레임워크 11개 대응표) |
| 기존 자료 | agent-evo-graph의 "AI Agent: 구성과 구현" 덱(약 60쪽, 발전 순서) | 확인함. 재사용 후보는 아래 표 |

근거 강도: 강 = 원문 확인, 중 = 2차 인용이나 요약, 해석 = 여러 출처를 묶은 이 문서의 판단.

## 1부 개념

### 정의 비교

| 출처 | 정의 (원문) | 강도 |
|---|---|---|
| [Russell & Norvig, AIMA](https://en.wikipedia.org/wiki/Intelligent_agent) | "perceives its environment through sensors and acts upon that environment through actuators" | 중 (Wikipedia 경유) |
| [Wooldridge & Jennings 1995](https://www.cambridge.org/core/journals/knowledge-engineering-review/article/abs/intelligent-agents-theory-and-practice/CF2A6AAEEA1DBD486EF019F6217F1597) ([프리프린트](https://www.cs.nmsu.edu/~tson/classes/fall03-579/survey1.pdf)) | 4속성: autonomy, social ability, reactivity, pro-activeness ("goal-directed behaviour by taking the initiative") | 강 |
| [Anthropic, Building effective agents (2024-12)](https://www.anthropic.com/engineering/building-effective-agents) | workflow: "LLMs and tools are orchestrated through predefined code paths" / agent: "LLMs dynamically direct their own processes and tool usage" | 강 |
| [Anthropic, Effective context engineering (2025-09)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | "LLMs autonomously using tools in a loop" | 강 |
| [OpenAI, A practical guide to building agents (2025-04)](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | "Agents are systems that independently accomplish tasks on your behalf." 단순 챗봇처럼 LLM이 workflow 실행을 제어하지 않으면 에이전트가 아님. 구성: Model, Tools, Instructions | 강 |
| Google, Agents 백서 (Wiesinger, Marlow, Vuskovic, 2024-09) | Model, Tools, Orchestration layer의 세 층. 원문 PDF 미확인 | 중 ([요약 기사](https://venturebeat.com/ai/google-maps-the-future-of-ai-agents-five-lessons-for-businesses)) |
| [LangChain, LangGraph (2024)](https://blog.langchain.com/langgraph/) | "an LLM running in a loop, deciding each iteration which (if any) tool…" | 강 |
| [Weng 2023](https://lilianweng.github.io/posts/2023-06-23-agent/) | LLM이 두뇌, Planning · Memory · Tool use가 보완 | 강 |
| [Weng 2026, Harness](https://lilianweng.github.io/posts/2026-07-04-harness/) | agent = LLM + memory + tools + planning + action에 하니스(workflow 설계, 평가, 권한, 지속 상태)를 더함 | 강 |
| [Xu 2026, Work Agents](https://arxiv.org/abs/2610.35845) | foundation model + runtime harness가 stateful workspace에서 위임 과제를 수행하고 검증 가능한 결과를 냄 | 강 |
| [Xing 2026](https://arxiv.org/abs/2606.23991) | "agent"는 기술 용어로 거의 쓸모없어졌다는 비판. agency 5차원: goal, identity, decision-making, self-regulation, learning | 강 |
| [Wikipedia](https://en.wikipedia.org/wiki/Intelligent_agent) | "AI agents do not have a standard definition" | 중 |

### 공통 축 (해석)

| 축 | 뜻 | 근거 |
|---|---|---|
| 목표 · 위임 | 사용자를 대신해 과제를 끝냄 | OpenAI "on your behalf", W&J pro-activeness, Xu "delegated task" |
| 자율성 | 다음 단계를 코드가 아니라 LLM이 정함 | Anthropic "dynamically direct", OpenAI "LLM to manage workflow execution" |
| 환경 상호작용 | 도구로 지각하고 행동함 | AIMA 센서 · 액추에이터, Anthropic "environmental feedback" |
| 루프 | 결과를 보고 다시 판단 | Anthropic "in a loop", LangGraph, OpenAI "while loop" |
| 상태 | 프롬프트 밖에 쌓인 기록에 행동이 의존 | Weng 2023 Memory, [Ding 2026](https://arxiv.org/abs/2606.30306) persistence |
| 모델 + 하니스 (2026) | 신뢰도는 모델보다 하니스가 좌우 | Weng 2026, [Meng 2026](https://www.preprints.org/manuscript/202604.0428), [Ren 2026](https://arxiv.org/abs/2607.13104) |

### 자율성 스펙트럼

- Workflow ↔ Agent: Anthropic 2024. "workflows offer predictability … agents are the better option when flexibility and model-driven decision-making are needed at scale". 단순한 것부터 시작하라고 권함. (강)
- [Feng et al. 2025, Levels of Autonomy for AI Agents](https://arxiv.org/abs/2506.12469): 자율성을 능력과 분리된 설계 선택으로 보고, 사용자 역할로 5단계 구분. (강)

| 수준 | 사용자 역할 | 원문 |
|---|---|---|
| L1 | operator | "the user is in charge at all times while the agent is available to provide support on-demand" |
| L2 | collaborator | "close and frequent user-agent communication and collaboration" |
| L3 | consultant | "The agent takes initiative in task planning and execution over extended time horizons" |
| L4 | approver | 사용자는 "only required to interact with the agent when the agent encounters a blocker" |
| L5 | observer | "a fully autonomous agent that does not require, and comes with no means for, user involvement" |

## 2부 기능

### 서베이별 상위 범주

| 출처 | 상위 범주 | 강도 |
|---|---|---|
| [Wang et al. 2023](https://arxiv.org/abs/2308.11432) | profile, memory, planning, action | 중 (초록에 모듈 이름 없음, 2차 인용) |
| [Xi et al. 2023](https://arxiv.org/abs/2309.07864) | "brain, perception, and action" | 강 |
| [CoALA, Sumers et al. 2023](https://arxiv.org/abs/2309.02427) | "modular memory components", "structured action space", "generalized decision-making process" | 강 |
| [Weng 2023](https://lilianweng.github.io/posts/2023-06-23-agent/) | planning(분해 + self-reflection), memory, tool use | 강 |
| [Anthropic 2024](https://www.anthropic.com/engineering/building-effective-agents) | augmented LLM = retrieval, tools, memory | 강 |
| [Xu 2026](https://arxiv.org/abs/2610.35845) | perception and understanding / reasoning and decision making / planning and coordination / execution and state management / verification, recovery, and replanning | 강 |
| [Ning 2026](https://arxiv.org/abs/2605.18747) | 인터페이스(reasoning, action, environment) → 메커니즘(planning, memory, tool use, PEV loop) → 확장(multi-agent) | 강 |
| [Zhou 2026](https://arxiv.org/abs/2604.08224) | memory, skills, protocols(agent-tool, agent-agent, agent-user), harness | 강 |
| [Raj 2026](https://arxiv.org/abs/2607.28802) | 모듈 대신 상호작용 단위: User, Harness, Environment. "Multi-agent is not a separate component" | 강 |

### 흐름 (해석)

- 공통 핵심: 추론 · 계획, 행동(도구), 기억. 원형은 Weng 2023과 Anthropic의 augmented LLM.
- 성찰 → 검증: 2023년에는 planning 아래(self-reflection)였고, 2026년에는 verification · recovery(Xu), PEV(Ning)로 독립.
- 협업: 2023년 분류에는 없고 2026년에 등장. Raj는 별도 구성요소로 보지 않음.
- 지각: 상위 범주로 둔 곳은 Xi 2023과 Xu 2026.
- 사람과의 상호작용: 가장 드묾(Zhou, Raj, Ning). Feng 2025의 자율성 수준과 연결해 다루면 됨.

### 발표용 기능 범주 제안

| 범주 | 근거 |
|---|---|
| 이해 · 지각 | Xi 2023 perception, Xu 2026 perception and understanding |
| 추론 · 계획 | 모든 분류 |
| 행동 (도구 · 환경 조작) | 모든 분류 |
| 기억 · 상태 | Weng, CoALA, Wang, Xu state management |
| 검증 · 복구 | Xu verification · recovery, Ning PEV, Weng self-reflection |
| 협업 (다른 에이전트 · 사람) | Xu coordination, Zhou protocols, Feng 자율성 수준 |

## 3부 구성요소

출처: analysis-docs 세션의 `agent-modules/에이전트_구현모듈_대응표.md`(2026-11-26 조사, 각 프레임워크 최신 릴리스 태그 코드 기준, 태그 고정 링크 약 500개). 이 문서는 아직 푸시 전이라 사용자의 Mac에만 있습니다. 아래 GitHub 링크는 analysis-docs가 확인한 것이고, 이 세션에서는 네트워크 제한으로 다시 열어 보지 못했습니다.

하니스 쪽 학술 근거: [Meng 2026](https://www.preprints.org/manuscript/202604.0428)의 H=(E,T,C,S,L,V) = Execution loop, Tool registry, Context manager, State store, Lifecycle hooks, eValuation interface (중). [OpenAI 가이드](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)는 guardrails를 "layered defense"로 별도 장에서 다룸 (강).

### 대상

CC = Claude Agent SDK v0.2.189 · OA = OpenAI Agents SDK v0.26.0 · LG = LangGraph 1.2.24 + LangChain v1 1.5.2 + deepagents 0.7.41 + langchain-mcp-adapters 0.3.2 · ADK = Google ADK v2.15.1 · PyAI = Pydantic AI v2.75.0 (+ pydantic-ai-harness) · smol = smolagents v1.26.0 · Codex = rust-v0.172.0 · OH = OpenHands software-agent-sdk v1.64.1 · oc = opencode v1.19.6 · Pi = pi v1.6.1 · mini = mini-swe-agent v2.4.6

### 모듈 대응표

○ 있음, △ 부분 · 한정, × 없음, ×e 코어에 없고 extension 예제, h = pydantic-ai-harness

| 모듈 | CC | OA | LG | ADK | PyAI | smol | Codex | OH | oc | Pi | mini |
|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 Model client | △¹ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M2 Loop · Runner | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M3 Session 저장 | ○ | ○ | ○² | ○ | ○ | △ | ○ | ○ | ○ | ○ | △ |
| M4 Context 조립 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| M5 Compaction | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | ○ | × |
| M6 Tool 실행기 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | △ (bash 1개) |
| M7 MCP client | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ (번들 ext) | × |
| M8 Skills | ○ | △³ | ○ | ○ | ○h | × | ○ | ○ | ○ | ○ | × |
| M9 Memory (장기) | △ | △³ | ○ | ○ | ○h | × | ○ | △ | × | × | × |
| M10 Planning | △ | × | ○ | △ | ○h | ○ | ○ | ○ | ○ | ×e | × |
| M11 Sub-agent · Handoff | ○ | ○ | ○ | ○ | ○h | ○ | ○ | ○ | ○ | ×e | × |
| M12 Hook · Middleware | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | ○ | △ |
| M13 Permission · Guardrail | ○ | ○ | ○ | △ | ○ | △ | ○ | ○ | ○ | ×e | △ (한도만) |
| M14 Sandbox · 실행 환경 | △ | ○³ | ○ | ○ | △/○h | ○ (CodeAgent) | ○ | ○ (OS 격리 없음) | × | ×e | ○ |
| M15 HITL | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | △ | △ |
| M16 Checkpoint · Resume | ○ | ○ | ○ | ○ | ○ | △ | ○ | ○ | ○ | △ | × |
| M17 Tracing | ○ | ○ | △ (LangSmith) | ○ | ○ | △ | ○ | ○ | ○ | △ | △ |
| M18 Evaluation | × | × | △ (LangSmith) | ○ | ○ | × | × | △ (critic) | × | △ (private) | △ |

¹ 모델 호출은 CLI 안에 있고 SDK는 옵션만 넘김. ² 세션 전용 저장소 없이 checkpointer가 겸함. ³ SandboxAgent에서만. LG 열은 패키지 4개를 합친 값이며, LangGraph 코어만 보면 M4 · M7 · M8 · M10 · M13 · M14가 ×.

### 읽는 법 (analysis-docs 보정 제안)

- **빠진 모듈:** Loop guard · 예산(턴 · 비용 · 시간 한도, 재시도, fallback), Structured output · 종료 판정, 이벤트 스트림 · 전송 프로토콜, 도구 노출 관리(tool search, deferred loading), 모델 카탈로그 · 인증, Testing(가짜 모델).
- **합치지 말 것:** Model client와 Loop. OA, ADK, Pi, mini, opencode 모두 둘을 나눔.
- **위계:**
  - M12 Hook · Middleware가 바닥 계층. 그 위에 compaction · todo · 권한 · HITL · skills가 플러그인으로 올라감(LangChain middleware, PyAI capability, Pi extension).
  - M3 · M5 · M16은 저장 기반 하나를 공유(LG checkpointer, OH 이벤트 로그, oc 이벤트 테이블).
  - M7 MCP는 M6 Tool의 어댑터. M11 Sub-agent도 M6 위에 있음. handoff(제어 이전)는 OA와 ADK에만.
  - M13 권한과 M15 HITL은 같은 승인 채널.
- **나눌 것:** M9 = 저장 · 검색 엔진 / 파일 주입 정책(CLAUDE.md 등). M13 = 정책 판정 / 판정자(사람 · LLM) / 내용 guardrail. M14 = OS 격리 / 실행 위치. M18 = 오프라인 평가 / 실행 중 critic(루프의 Verification).
- **이름 충돌:** OA `agents.memory`는 대화 이력 Session. smol `AgentMemory`는 step 기록. ADK planners는 프롬프트 · thinking 설정.

### 최소 대 프로덕션

| | 들어 있는 모듈 |
|---|---|
| 최소 ([mini-swe-agent DefaultAgent](https://github.com/SWE-agent/mini-swe-agent/blob/v2.4.6/src/minisweagent/agents/default.py), README "Just some 100 lines", 파일 190줄) | M1 `Model.query` · M2 `while True: step()` · M4 Jinja 템플릿 2개 · bash 도구 1개 + 형식 오류를 모델에 돌려주는 파서 · M14 `Environment.execute`(subprocess, 타임아웃) · 종료 신호와 step · cost · time 한도 · 메시지 목록 + trajectory JSON |
| 중간 (Pi) | 코어에 M1~M8과 M12만. 나머지는 extension 예제이고, 전부 M12만으로 구현 |
| 프로덕션에서 더해지는 것 | 영속 세션과 resume · fork, compaction, 다수 도구 · 병렬 · 출력 truncation, MCP, skills, hook · 권한 · 승인 채널, OS 격리(기본으로 켜진 곳은 Codex뿐), planning, sub-agent, tracing, 이벤트 · 서버 프로토콜, 모델 카탈로그 · 인증, 장기 메모리 |

### 핵심 인터페이스

| 모듈 | 인터페이스 | 예 |
|---|---|---|
| M1 Model client | `stream(model, messages, tools, settings)` → 이벤트 스트림 | ADK `BaseLlm.generate_content_async`, [OA models/interface.py](https://github.com/openai/openai-agents-python/blob/v0.26.0/src/agents/models/interface.py#L37) |
| M2 Loop | `run(input)`: 모델 호출 → tool call 실행 반복 → 없으면 종료 | [Pi agentLoop](https://github.com/earendil-works/pi/blob/v1.6.1/packages/agent/src/agent-loop.ts#L47) |
| M3 Session | append / load | OA `Session.get_items/add_items/pop_item`, ADK `BaseSessionService.append_event` |
| M6 Tool | name + description + inputSchema + execute(args, ctx) | OA `FunctionTool`, [Codex ToolExecutor](https://github.com/openai/codex/blob/rust-v0.172.0/codex-rs/tools/src/tool_executor.rs), OH `ToolDefinition[Action, Observation]` |
| M12 Hook | before / after / wrap × {run, model, tool} | [LangChain AgentMiddleware 6훅](https://github.com/langchain-ai/langchain/blob/langchain==1.5.2/libs/langchain_v1/langchain/agents/middleware/types.py) |
| M13 Permission | `decide(tool, args)` → allow / ask / deny | CC `CanUseTool`, OH `SecurityAnalyzer` + `ConfirmationPolicy` |
| M15 HITL | 멈춤 → 승인 목록 → approve / reject → 재개 | OA interruptions + `RunState.approve`, LG `interrupt()` / `Command(resume)` |
| M16 Checkpoint | get / put | LG `BaseCheckpointSaver.get_tuple/put/put_writes` |
| M18 Evaluation | dataset → evaluate | ADK `AgentEvaluator.evaluate`, pydantic-evals `Dataset.evaluate` |

### 발표에서 조심할 점

- "도구 오류는 모델에 돌려준다"로 일반화하면 틀림. OA 기본값은 예외를 숨기고 "An error occurred while running the tool."을 보냄. LangChain `create_agent`는 인자 오류만 돌려주고 실행 중 예외는 run을 멈춤. ADK는 `on_tool_error` 콜백이 없으면 raise.
- deepagents 0.7.0부터 `write_todos`가 기본 도구에서 빠짐.
- Codex에는 ToolHandler trait가 없고 `ToolExecutor<Invocation>`이 그 역할.
- 확인 안 된 것: CC의 루프 · compaction · 재시도(공개되지 않은 CLI 안), LangSmith · Logfire 서버 쪽, smolagents mcpadapt의 sampling · elicitation.

### 발표용 구성요소 묶음 제안 (해석)

대응표와 보정 제안을 반영해, 최소 에이전트의 핵심에서 바깥으로 쌓는 순서로 묶습니다.

| 층 | 묶음 | 모듈 | 최소 에이전트에 있나 |
|---|---|---|---|
| 핵심 | 모델 | Model client, 모델 카탈로그 · 인증 | ○ |
| 핵심 | 실행 루프 | Runtime · 턴 처리, Loop guard · 예산, 종료 판정 | ○ |
| 핵심 | 컨텍스트 | Context 조립, Compaction | 조립만 |
| 핵심 | 도구 | Tool 레지스트리 · 실행기, 실행 환경 | bash 1개 |
| 확장 | 도구 확장 | MCP client, Skills, 도구 노출 관리 | × |
| 확장 | 상태 | Session · Checkpoint · Resume(저장 기반 공유), 장기 메모리 | 메시지 목록만 |
| 확장 | 확장 지점 | Hook · Middleware (다른 확장이 올라가는 바닥) | × |
| 확장 | 통제 | Permission · Guardrail, HITL(같은 승인 채널), Sandbox(OS 격리) | 한도만 |
| 확장 | 조율 | Planning, Sub-agent · Handoff | × |
| 운영 | 운영 | 이벤트 스트림 · 프로토콜, Tracing, Evaluation, Testing | trajectory JSON만 |

## 기존 덱에서 재사용 후보

agent-evo-graph 덱(claude.ai 아티팩트)은 발전 순서로 짜여 있어, 새 3부 구성에는 장 단위로 골라 씁니다.

| 새 발표 | 기존 덱의 장 |
|---|---|
| 1부 개념 | Agent loop 구조, Primitive AI Agent, AI Agent 한계 |
| 2부 기능 | Tool use 효과, ReAct 이력 활용, Planning 구현, Multi-agent 구조, Verifier 검증 루프 |
| 3부 구성요소 | Tool call 실행, Context engineering 구현, Agent Skills 구성, MCP 구조, Hook 위치 · 쓰임, Sandbox 구현, General-Purpose AI Agent 구조 |

## 변경 이력

- 2026-11-25: 문서 작성. ai-wiki, analysis-docs에 조사 요청
- 2026-11-25: ai-wiki 답과 원문 확인으로 1부 개념 · 2부 기능 채움
- 2026-11-26: analysis-docs 답으로 3부 구성요소 채움
