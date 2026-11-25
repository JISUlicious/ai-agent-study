# 발표 조사: 에이전트의 개념 · 기능 · 구성요소

새 발표(3부 구성)를 위한 조사 문서입니다. 슬라이드를 만들기 전 단계입니다.

- 1부 개념, 2부 기능: 추상적이고 넓은 범주로 묶습니다.
- 3부 구성요소: 사용자 관점이 아니라, 구현하는 개발자가 만들어야 하는 모듈로 나눕니다.

## 조사 상태

| 부 | 요청한 곳 | 상태 |
|---|---|---|
| 1부 개념 · 2부 기능 | ai-wiki (2026-11-25 요청) | 답 받음. 위키에 없던 원문(Wooldridge & Jennings, OpenAI 가이드, Feng 2025, Xi 2023, CoALA)은 이 세션에서 직접 확인 |
| 3부 구성요소 | analysis-docs (2026-11-25 요청) | 답 대기 |
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

## 3부 구성요소 (작업 가설, analysis-docs 답 대기)

하니스 쪽 근거: [Meng 2026](https://www.preprints.org/manuscript/202604.0428)의 H=(E,T,C,S,L,V) = Execution loop, Tool registry, Context manager, State store, Lifecycle hooks, eValuation interface (중). [OpenAI 가이드](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)는 guardrails를 "layered defense"로 별도 장에서 다룸 (강).

| 묶음 | 모듈 |
|---|---|
| 모델 | Model client (프로바이더 어댑터, 스트리밍) |
| 실행 | Agent loop / Runner |
| 컨텍스트 | Prompt · context 조립, compaction |
| 도구 | Tool registry · 실행기, MCP client, Skills 로더 |
| 상태 | Session 저장, 장기 메모리 |
| 통제 | Hook, Permission · Guardrail, Sandbox, HITL |
| 조율 | Planning · Task, Sub-agent · Handoff |
| 운영 | Tracing, Checkpoint · Resume, Evaluation |

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
