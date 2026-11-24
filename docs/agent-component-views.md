# AI 에이전트 구성요소의 관점별 검토

발표에서 에이전트의 구성요소를 한 장으로 보여 주기 위해 여러 관점의 분류를 겹쳐 보고 시각화 방향을 찾은 기록입니다.

사용자가 정한 조건:

- 한 층의 동등한 구성요소만 씁니다. 구성요소 안에 하위 구성요소를 두지 않습니다.
- 처음에는 10개 이내, 4~6개 목표였습니다. 2026-11-24에 상한을 없앴고 구현 관점은 14개를 모두 씁니다(사용자 결정).
- 세션 저장과 모델 호출도 중요한 구성요소로 봅니다(2026-11-24 사용자 의견).
- Verification과 Evaluation은 각각 칸으로 둡니다(2026-11-24 사용자 결정, 아래 "Verification과 Evaluation").

## 검증 상태

2026-11-24에 ai-wiki의 답을 반영했습니다. 구현 관점은 같은 날 ai-wiki 후속 조사(주로 위키의 main-components-of-top-agent-harnesses, 이하 MC)로 확인했고 [agent-components-implementation.md](agent-components-implementation.md)로 옮겼습니다. 근거 강도는 ai-wiki가 매긴 값입니다(강: 1차 출처 페이지나 코드를 읽은 조사, 중: 위키 종합이나 문서만 본 조사, 약: 초록만 보거나 추론).

- 위키에 없어서 뺀 것: OpenAI "A practical guide to building agents", Google "Agents" 백서.
- ai-wiki는 이번 조사에서 위키를 고치지 않았습니다. OpenAI 안내서, Google 백서, CoALA 원문은 ai-wiki 세션에서 새로 수집해야 쓸 수 있습니다.

## 출처별 분류

| 출처 | 시점 | 구성요소 | 근거 |
|---|---|---|---|
| Weng, LLM Powered Autonomous Agents | 2023-06 | LLM(agent's brain) 위에 Planning, Memory, Tool use | 강 |
| CoALA (Sumers 외) | 2023 | memory, action space, decision-making process | 중. 위키 페이지가 초안이고 2차 소스로 작성됨 |
| Anthropic, Building Effective Agents | 2024-12 | agent는 환경의 피드백을 받아 루프 안에서 도구를 쓰는 LLM. augmented LLM은 model에 retrieval, tools, memory를 더한 것 | 강 |
| Anthropic, Building Effective AI Agents(기업용 가이드) | 2025-12 | model, prompt, tools(MCP), Skills. perceive → decide → act 루프. observability를 설계 원칙으로 둠 | 강 |
| Russell & Norvig, AIMA | 1995~ | PEAS: Performance measure, Environment, Actuators, Sensors | 강. 고전과 LLM 에이전트의 대응표는 위키 종합(중) |
| Weng, Harness Engineering for Self-Improvement | 2026-07 | Agent = Model + Harness. 2023년 틀에 더해진 것으로 workflow design(예: loop engineering), evaluation, permission controls, persistent state management를 꼽음 | 강 |
| Raj 외 (Scale AI) | 2026-07 | Model을 중심에 두고 9개를 3 family로 나눔: User(Owner, Grader, Third party), Harness(Context, Memory, Tool, Model), Environment(Local, External) | 강 |
| Xu, Work Agents | 2026 | task, model, harness, workspace, work outcome, verification. harness 안에 context, tools, memory, skills, execution control, recovery | 강 |
| Xu, Harness² | 2026 | 파일 단위 8개: System prompt, Guardrails, Memory, Tool guidance, Subagents, Skills, Scripts, Plugin | 강 |
| Meng, 하니스 서베이 | 2026 | Execution loop, Tool registry, Context manager, State store, Lifecycle hooks, eValuation interface | 약. 초록과 저장소로만 재구성 |

앞서 받은 것: Lin 2026(산출물 6개 또는 7개, [agent-components-implementation.md](agent-components-implementation.md) 참고), Ning 2026(메커니즘 범주 5개), Böckeler 2026(Guide/Sensor), 위키 종합 페이지(fundamental-components-of-harness, agent-three-layer-model), Claude Code 문서의 "gather context, act, verify, repeat".

Weng 2026의 harness 정의 원문은 다음과 같습니다.

> the system surrounding a base model that orchestrates execution and decides how the model thinks and plans, calls tools and acts, perceives and manages context, stores artifacts, and evaluates results.

## 관점을 겹쳐 본 공통 묶음

첫 초안의 다섯 묶음(Model, Context, Tools, Agent loop, 제어)은 위키 근거와 대체로 맞았습니다. 빠졌던 것은 Verification입니다. 처음에는 2026년 분류 넷(Weng의 evaluation, Xu의 verification, Meng의 eValuation interface, Raj의 Grader)을 근거로 들었는데, 넷의 뜻이 같지 않았습니다. 실행 중 확인이라는 뜻의 근거는 Xu, MC, Zhang 2026, Ning의 Plan-Execute-Verify입니다. 그 뒤 Verification과 Evaluation을 각각 칸으로 두기로 해서(2026-11-24 사용자 결정) 열을 둘로 나눴습니다(아래 "Verification과 Evaluation").

| 관점 | Model | Context | Tools | Agent loop | Verification | Evaluation | 제어 |
|---|---|---|---|---|---|---|---|
| 개념 (Weng 2023) | LLM | Memory | Tool use | Planning(Subgoal and decomposition) | Planning 안의 Reflection and refinement | 없음 | 없음 |
| 추상 (Building Effective Agents) | LLM | 환경의 피드백 | tools | loop | 없음 | 없음 | 없음 |
| 하니스 (Weng 2026) | Model | manages context, stores artifacts | calls tools | orchestrates execution, plans | checks itself, evaluates results(중) | evaluation 중 개선 루프의 evaluator | permission controls(추가 항목) |
| 상호작용 (Raj 2026) | Model | Context, Memory | Tool | Model(subagent) | 없음 | Grader(User 쪽) | 없음 |
| 설정 (Lin 2026) | 없음 | System prompt, Skills, Long-term memory | Tools | Sub-agents | 없음 | 없음 | Middleware(해석) |
| 루프 단계 (Claude Code 문서) | 없음 | gather context | act | repeat | verify | 없음 | 없음 |
| 한계 대응 (발전 흐름 그래프) | 한계의 출처 | Context window | knowledge limitation, Hallucination | Multi-step reasoning | Stops before the task is done | 없음 | Non-deterministic behavior |

관찰:

- Weng 2026 한 출처로 일곱 열이 모두 채워집니다. 제어는 harness 정의가 아니라 2023년 대비 추가 항목 목록에 있습니다. Verification과 Evaluation은 Weng의 evaluation 한 항목을 나눈 것입니다.
- Evaluation은 Weng 2026과 Raj에만 나오고, 둘 다 실행 중인 에이전트 밖에 둡니다. 발전 흐름 그래프에도 대응하는 한계가 없습니다.
- Verification은 Weng 2023에도 Planning의 하위 항목(Reflection and refinement)으로 나옵니다. 독립 구성요소가 된 것은 2026년 분류부터입니다.
- Claude Code 문서의 루프 단계 네 개가 Context, Tools, Verification, Agent loop에 하나씩 들어갑니다(해석).
- Model은 개념, 추상, 하니스 정의에는 나오고 설정과 루프 단계에는 나오지 않습니다.
- 제어는 2026년 분류에서만 1급 항목으로 나옵니다.

## 결정이 필요한 점

| 항목 | 선택지 | 근거 |
|---|---|---|
| Verification | 별도 칸(2026-11-24 결정) | 근거: Xu 2026(6요소), MC(12번), Zhang 2026(L0~L3), Ning 2026(Plan-Execute-Verify). three-layer model은 eval harness를 Harness 범주에 두어 평가와 섞음 |
| Evaluation | 별도 칸(2026-11-24 결정) | 근거: Anthropic Demystifying evals, Xu 2026의 평가 논의, Raj 2026의 Grader, Meng의 V, Weng 2026의 개선 루프 evaluator. 실행 중인 에이전트 밖에서 함 |
| 제어의 이름 | permission controls / execution control / 그 밖 | 확립된 단일 용어는 위키에 없음. permission controls는 Weng 2026(강). execution control은 Xu 2026과 Harness Handbook에 나오지만 루프 제어인지 권한인지 확인 안 함. Guardrails는 위키에서 입력·출력·도구 경계의 외부 제한(모델 쪽 개념)이라 하니스 제어 전체의 이름으로는 어긋남. governance, harness controls는 위키에 없음 |
| Memory와 Context | 합침 / 나눔 | Weng 2023은 Memory 아래에 short-term(in-context)을 둠. Anthropic은 memory를 context 관리의 하위 기법으로 봄. Raj, Xu, Meng, three-layer model은 별개로 나눔 |
| Skills, Hooks | 주된 묶음 하나에 넣음 | three-layer model이 둘 다 여러 묶음에 걸친다고 명시. 주로 Skills는 Context, Hooks는 제어 |
| Environment | 넣지 않음 | AIMA, Raj, Xu는 구성요소로 넣지만 에이전트가 행동하는 곳이라 묶음 밖에 둠 |
| Persistence | 구현 장에는 넣음(칸 이름 Sessions). 개념 장은 방향 2 확장에서 칸으로 뒀다가 2026-11-24 사용자 결정으로 Memory에 합침. 방향 1이면 Context에 대응 | 2026-11-19에 뺀 것은 발전 흐름 그래프에 대한 결정(소프트웨어 구현에 가까움). 2026-11-24 사용자 의견으로 구현 장에는 넣음. MC는 storage를 범위에서 뺌. 출처에서는 중~강(Weng 2026, Meng, three-layer model) |

## Verification과 Evaluation

2026-11-24 사용자 질문(두 말은 다른 개념이 아닌가)을 받고 ai-wiki에 출처별 뜻을 확인했습니다. 근거 강도는 ai-wiki가 매긴 값입니다(강: 위키 원문 인용, 중: 위키 요약, 약: 맥락 추론).

| 출처 | 쓴 말 | 뜻 | 시점 |
|---|---|---|---|
| Xu 2026 Work Agents | verification | 결과를 과제 요구와 완료 기준에 대조함. 프로그램, 사람, 모델 judge가 하고, 맞지 않으면 문제가 된 단계로 돌아감(강) | 실행 중 |
| MC 12번 | Verification before stopping | 멈추기 직전의 내장 확인. Hermes verify-on-stop, Claude Code 스냅샷의 verifier 서브에이전트(PASS/FAIL/PARTIAL), OpenClaw before_agent_finalize(강) | 실행 중 |
| Zhang 2026 | verification | "check your work"를 L0 프롬프트 지침, L1 실행 중 reminder, L2 completion gate, L3 새 컨텍스트의 별도 critic으로 나눔. 결과가 에이전트로 돌아감(강) | 실행 중 |
| Anthropic, Building Effective Agents와 2025 가이드 | evaluator-optimizer | 한 호출이 만들고 다른 호출이 비평하는 루프(강). 위키는 이를 verifier 루프의 workflow 형태로 연결함 | 실행 중 |
| Anthropic, Demystifying evals | evaluation | task, trial, grader, transcript, outcome. evaluation harness를 agent harness와 따로 정의하고, 평가 대상은 하니스와 모델을 함께 돌린 결과(강) | 실행 밖 |
| Xu 2026의 평가 논의 | evaluation | 결과 기반 측정과 비용 축. 에이전트를 재는 벤치마크 논의(중) | 실행 밖 |
| Raj 2026 | Grader | Harness가 아니라 User 쪽(Owner, Grader, Third party). 모델이 지시와 별개로 평가자에게 실패할 수 있어 따로 둠(강). 사후 채점에 가까움(약) | 실행 밖 |
| Meng | eValuation interface | 판정 주체가 아니라 trajectory, 중간 상태, 성공 신호를 내보내는 인터페이스(강). 외부 평가와 잇는 것으로 해석(약) | 밖으로 신호 |
| Weng 2026 | evaluation, evaluates results | 추가 항목에 정의가 없음. 뒤 문장의 checks itself(실행 중)와 improves(실행 밖)를 함께 덮음(중). 본문의 evaluator는 주로 하니스 개선 루프 쪽이고, evaluator를 하니스를 바꾸는 루프 밖에 두라고 함(강). verifier와 evaluation metrics를 섞어 씀(강) | 둘 다 |

위키 개념 페이지의 구분:

- agent-evaluation 페이지는 무엇을 어떤 기준으로 확인하는지는 verifier 페이지로, 그것을 업계가 어떻게 측정하는지는 자기 페이지로 역할을 나눕니다(강).
- LangChain 체크리스트는 guardrail(실행 중 차단)과 evaluator(실행 후 비동기 측정)를 구분합니다(강). 대비 상대가 verification이 아니라 guardrail입니다.
- three-layer model은 eval harness를 L2 Harness 범주에 넣어 개발용 평가와 실행 중 확인을 섞습니다(강).

앞서 Verification 묶음의 근거로 든 2026년 분류 넷 중 실행 중 확인은 Xu 하나였습니다. Weng은 두 뜻을 함께 덮고, Meng의 V와 Raj의 Grader는 에이전트 밖 평가 쪽입니다.

### 결정 (2026-11-24 사용자)

Verification과 Evaluation을 각각 칸으로 둡니다.

- Verification: 에이전트가 맡은 작업을 잘 수행했는지 검증하는 것
- Evaluation: 만든 에이전트가 잘 동작하는지 성능을 평가하는 것

처음 낸 안(칸 이름은 Verification 하나로, Evaluation은 구성요소 밖)은 쓰지 않습니다.

### 검토 (해석)

- 사용자 정의는 판단 대상으로 나눕니다. 이번 작업의 결과를 보면 Verification, 만든 에이전트를 보면 Evaluation입니다. 출처 정의와 맞습니다. Verification은 Xu의 정의(결과를 과제 요구와 완료 기준에 대조), Evaluation은 Demystifying evals(하니스와 모델을 함께 평가)와 같습니다.
- 이 기준은 처음 쓴 시점 기준(실행 중이냐 밖이냐)보다 경계 사례를 잘 가릅니다.
  - 작업이 끝난 뒤 사람이나 리뷰 도구가 결과를 보는 것(Codex review, Cursor Bugbot)은 실행 밖이지만 이번 작업의 결과를 보므로 Verification입니다.
  - Building Effective Agents의 evaluator-optimizer는 이름에 evaluator가 있지만 이번 결과를 비평하므로 Verification입니다.
  - 평가 세트에서 과제마다 결과를 판정하는 것은 문헌도 verifier나 outcome verification이라 부릅니다(Demystifying evals, AHE, Wang 2026, Self-Harness). 이 판정을 여러 과제에 걸쳐 모아 에이전트 성능을 내는 것이 Evaluation입니다. 사용자 정의를 "과제 하나 대 집계"로 읽으면 이 문헌들과 맞습니다.
- 결과가 쓰이는 곳도 갈립니다. Verification의 결과는 그 작업을 계속, 수정, 종료하는 데 쓰입니다. Evaluation의 결과는 모델과 하니스를 비교하고 고치는 데 쓰입니다.
- 두 칸은 같은 장치를 나눠 씁니다. 테스트와 LLM judge는 양쪽에 쓰입니다. Zhang 2026은 검증 방식 L0~L3를 별도 벤치마크 채점으로 비교해 L3가 비용 대비 낫다고 결론 냈습니다. 검증 방식을 고르는 일도 평가의 몫입니다. 같은 unit test가 실행 중이면 에이전트의 Verification이고 벤치마크에서는 Evaluation의 grader입니다. 그래서 "과제 하나 대 집계"와 "에이전트 안 대 밖"은 다른 축이고, 슬라이드 각주에 두 축을 함께 적어 두면 인용할 때 헷갈리지 않습니다(ai-wiki 해석).
- 슬라이드 문구: Verification은 "잘 수행했는지"보다 "요구와 완료 기준을 채우는지"가 출처에 가깝습니다. Evaluation은 "여러 과제에 걸쳐", "모델과 하니스를 함께" 잰다는 점을 넣으면 두 칸이 더 분명히 갈립니다.
- Evaluation은 실행 중인 에이전트 밖에서 합니다. Anthropic은 evaluation harness를 agent harness와 따로 정의하고, Raj는 Grader를 User 쪽에 두고, Weng은 evaluator를 하니스를 바꾸는 루프 밖에 두라고 합니다. 한 층의 동등한 칸으로 두되, 발표에서는 이 칸만 에이전트 밖에서 돈다는 점을 짚어야 합니다.
- 방향 2와 방향 2 확장에서는 Weng 2026의 evaluation 한 항목을 두 칸으로 나눈 셈입니다. Weng 원문의 checks itself와 improves가 각각에 해당합니다(중). 원문을 인용할 때는 각주가 필요합니다.
- 단어만으로는 구분되지 않습니다. Anthropic은 실행 중 비평에도 evaluate를 씁니다.
- 에이전트 안에서 Evaluation과 닿는 곳은 판정이 아니라 기록과 신호를 내보내는 부분입니다(Meng의 V). 하니스 6개에서는 평가 하니스가 에이전트를 돌릴 수 있게 비대화 실행과 JSON 출력을 여는 것이 공통이고, 저장소 안에 평가 실행기가 확인된 곳은 Pi와 Hermes뿐입니다([agent-components-implementation.md](agent-components-implementation.md)의 "Evaluation과 닿는 구현").

### 두 루프를 나눈 출처

2026-11-24 ai-wiki 후속 답입니다.

| 출처 | 작업 루프(Verification) | 개선 루프(Evaluation) |
|---|---|---|
| Self-Harness (Zhang 2026) | 하니스 구성에 verification rules가 있음 | 후보 하니스를 held-in/held-out 회귀 테스트로 평가해 받아들임(강) |
| Weng 2026 | 하니스가 checks itself | ADAS, AFlow가 새 workflow를 실행하고 평가하기를 반복. evaluator는 하니스를 바꾸는 루프 밖에 두라고 함(강) |
| AHE (Lin 2026) | 작업 에이전트와 verifier | 개선을 맡는 Evolve Agent가 따로 있고 verifier, tracer, 모델 설정은 건드릴 수 없음(강) |
| Wang 2026, Rethinking the Evaluation of Harness Evolution | 과제별 verifier 판정(개선 탐색이 이 피드백을 읽음) | 탐색 결과는 held-out 과제로 따로 평가해야 한다고 주장(강) |
| Xu 2026 | 6요소의 verification | 결과 기반 평가를 다른 절에서 다룸. 둘을 대비하는 문장은 없음(중) |
| Zhang 2026, Rethinking Verification | L0~L3 | VisualBench의 blinded expert raters(중) |

Self-Harness가 한 출처 안에서 둘을 가장 분명히 나눕니다.

### 슬라이드 정의 후보

| 칸 | 원문 정의 | 슬라이드 문구 후보 |
|---|---|---|
| Verification | Xu 2026: "verification checks results against task requirements and completion criteria"(강) | 작업 결과가 요구와 완료 기준을 채우는지 확인 |
| Evaluation | Demystifying evals: "An evaluation ('eval') is a test for an AI system"(강). evaluation harness는 "the infrastructure that runs evals end-to-end" | 만든 에이전트(모델과 하니스)를 여러 과제로 시험해 성능을 잼 |

위키 verifier 페이지의 정의("any component that judges whether some output, action, or trajectory is correct")는 시점 구분이 없어, Verification 정의로는 Xu 쪽이 사용자 정의에 더 가깝습니다.

## 2023년과 2026년의 차이

"2023년 무렵 분류에는 제어가 없다"는 관찰은 다음처럼 고쳐 쓰면 위키로 뒷받침됩니다.

- 쓸 수 있는 주장: 제어가 1급 구성요소로 등장한 것은 2025~2026년 하니스 분류부터입니다. Weng 2026이 자기 2023년 틀과 비교해 permission controls를 더해진 것으로 꼽습니다(강).
- 과한 주장: 2023년에는 제어 개념이 없었다. Building Effective Agents(2024-12)가 이미 sandboxed testing과 guardrails를 권고했고, Weng 2023도 위험물 합성 사례로 위험을 언급합니다. 다만 둘 다 구성요소로 두지는 않았습니다.
- CoALA에 제어 범주가 없다는 판단은 위키 요약에 기반합니다(약~중).

발전 흐름 그래프와의 대응(해석):

- 그래프의 노란 구성요소 노드는 LLM, Planning, Internal memory, External memory, Tool use, Agent loop입니다. Weng 2023의 틀(LLM 위에 Planning, Memory, Tool use)에 Agent loop를 더한 모양입니다.
- Weng 2026이 꼽은 추가 항목은 그래프에서 파란 기법 노드로만 나옵니다. workflow design은 Goal(Ralph Loop), evaluation 중 실행 중 확인은 Plan-Execute-Verify, permission controls는 Permission, Sandbox, Hook에 해당합니다. evaluation 중 실행 밖 측정은 그래프에 없습니다. persistent state management에 해당하는 노드는 없습니다(2026-11-19에 그래프에서 뺌).
- 그래프에서 Agent loop는 새 한계(Stops before the task is done, Context window, Non-deterministic behavior)로 점선이 나가는 자리입니다. 그래서 Agent loop 앞쪽 구성요소는 LLM 자체의 한계에 대한 대응으로, 뒤쪽 추가 항목은 루프가 만든 한계에 대한 대응으로 읽힙니다.

## 후보 방향

| 방향 | 구성 | 근거 | 맞는 형태 |
|---|---|---|---|
| 1. 공통 7 | Model, Context, Tools, Agent loop, Verification, Evaluation, Permission controls | 여러 분류를 겹친 결과. Weng 2026 하나로도 채워짐 | 매트릭스, 수식 |
| 2. 2023 → 2026 | LLM 위에 Planning, Memory, Tool use(2023)와 Agent loop, Verification, Evaluation, Permission controls(2026 추가) | Weng 2023과 Weng 2026, 한 저자의 비교(강) | 7칸 한 줄에 연도 표시, 그래프 색 구분 |
| 2 확장. 2023 → 2026, 9칸 | LLM, Planning, Memory, Tool use(2023)와 Agent loop, Verification, Evaluation, Permission controls, Persistence(2026 추가) | Weng 2026이 꼽은 추가 항목 넷을 모두 씀(강). evaluation을 두 칸으로 나눈 것은 2026-11-24 사용자 결정. 모델과 세션 저장도 구성요소로 본 사용자 의견을 반영 | 윗줄 2023 4칸, 아랫줄 2026 5칸 |
| 2 확장, 단계 구분(2026-11-24 사용자 제안) | 기본 구성: LLM, Planning, Memory, Tool use, Agent loop. 실사용 보강: Verification, Evaluation, Permission controls. Persistence는 Memory에 합침(2026-11-24 사용자 결정) | 발전 흐름 그래프에서 Agent loop로 들어오는 선과 Agent loop 뒤의 대응이 같은 나눔. Weng 2026의 workflow design(loop engineering)은 goal을 추구하는 바깥 루프라 Planning·Goal 쪽에 대응(2026-11-24 사용자 정정) | 윗줄 5칸, 아랫줄 3칸 |

두 방향의 묶음은 거의 같습니다. 차이는 Model을 동등한 칸으로 둘지(방향 1), LLM을 주어로 빼고 Planning을 칸으로 둘지(방향 2)입니다.

2026-11-24 사용자 의견처럼 모델과 세션 저장도 구성요소로 보고 Verification과 Evaluation을 나누면, 방향 1은 7칸, 방향 2 확장은 9칸입니다. 방향 2 확장은 Weng 2026이 꼽은 추가 항목 넷을 모두 쓰므로 출처와 더 가깝습니다. 방향 1은 Model이 이미 칸이고 Persistence는 Context에 들어가며, 칸이 더 적습니다. 사용자는 방향 2 확장을 고르고, Agent loop를 윗줄로 올려 연도 대신 단계로 나누는 안을 냈습니다([agent-components-concept.md](agent-components-concept.md)). 구현 14개와의 대응은 [agent-components-implementation.md](agent-components-implementation.md)의 "개념 장과의 대응"에 있습니다. 그 뒤 Persistence를 Memory에 합쳐(2026-11-24 사용자 결정) 개념 장은 8칸입니다.

방향 2의 이름 메모:

- Weng 2026의 원래 항목은 workflow design(예: loop engineering)입니다. loop engineering은 기본 agent loop 코드가 아니라 Ralph loop처럼 goal을 이룰 때까지 에이전트를 다시 돌리는 바깥 루프를 말합니다(2026-11-24 사용자 정정). ai-wiki 확인: Weng 2026은 이 말을 정의 없이 한 번 쓰고, 가장 가까운 예는 goal을 이룰 때까지 계획, 실행, 관찰·테스트, 개선을 반복하는 workflow입니다. 다만 바깥 루프만으로 한정할 근거는 없습니다. 같은 절에 기본 Codex agent loop 그림이 함께 있고, Feng 2026은 loop engineering을 ReAct까지 포함해 넓게 씁니다(중). Ralph loop와 goal 명령은 Weng 원문에 없는 같은 시기의 실무 사례라 따로 출처를 답니다. 그래서 이 항목은 Agent loop 칸이 아니라 Planning·Goal 쪽(goal 루프)에 해당하고, Agent loop 칸은 ReAct부터 있던 기본 루프입니다. 두 말이 모두 loop라 헷갈리기 쉬우므로 슬라이드에서는 "agent loop"와 "goal 루프"를 구분해 씁니다. Goal은 MC 배치로도 Planning 칸입니다.
- workflow라는 말을 그대로 쓰지 않는 이유: Building Effective Agents가 workflow를 "미리 정한 코드 경로로 LLM과 도구를 엮는 방식"이라는 다른 뜻으로 씁니다.
- Weng 2026의 넷째 추가 항목 persistent state management는 처음에 2026-11-19 결정을 따라 뺐습니다. 그 결정은 발전 흐름 그래프에 대한 것이었습니다. 2026-11-24 사용자 의견으로 구현 장에는 Persistence 칸을 넣고, 개념 장에서는 방향 2 확장의 Persistence 칸이 이 항목입니다. 칸 이름은 Weng의 설명형 이름을 줄인 것입니다. 줄이면서 state가 빠져 Memory와 겹쳐 보이는 문제와 이름 후보(Persistent state)는 [agent-components-concept.md](agent-components-concept.md)의 "Memory와 Persistence"에 있습니다. 2026-11-24 사용자 결정으로 이 칸은 Memory에 합쳤고, persistent state management는 Memory의 실사용 보강으로 설명합니다.
- Verification과 Evaluation 칸: Weng 2026의 evaluation 한 항목을 두 칸으로 나눈 것입니다(2026-11-24 사용자 결정). Weng 원문은 checks itself와 improves를 함께 evaluation이라 부르므로 각주를 답니다.
- 연도 표시: Weng 2023의 Planning 아래에 Reflection and refinement가 있습니다(강, 예시는 ReAct, Reflexion, Chain of Hindsight, Algorithm Distillation). Ning 2026은 Self-Debugging, Reflexion 등을 Plan-Execute-Verify의 verify-and-repair 쪽으로 다시 묶습니다(강). 그래서 Verification은 2026년 추가로만 적지 않고 "2023년 Planning 안의 reflection에서 2026년에 독립 구성요소가 됨"으로 적습니다. Evaluation은 Weng 2026 목록에서 처음 나오므로 2026년 표시가 맞습니다(중). 연도 대신 단계로 나누는 안([agent-components-concept.md](agent-components-concept.md))을 쓰면 연도 표시는 빼고 이 내용은 각주로 둡니다.
- Reflexion은 한 실행 안이 아니라 시도와 시도 사이에서 작동합니다. 성찰을 메모리에 남겨 다음 시도에 붙이는 방식이라 실행 중 검증과 실행 밖 개선의 중간에 있습니다(강).

## 개념 장 구성안

개념 장의 두 줄 구성안(Agent loop를 윗줄에 둔 9칸), 그 검토와 비판적 검토, 근거 확인은 [agent-components-concept.md](agent-components-concept.md)로 옮겼습니다(2026-11-24).

## 시각화 형태

| 형태 | 모양 | 맞는 경우 |
|---|---|---|
| A. 매트릭스 | 열은 구성요소, 행은 관점 3~4개 | 여러 관점을 한 장에 보여 줄 때. 요약 장. 2026-11-24에 개념 장 9칸 × 관점 넷으로 그렸다가, 사용자 지적으로 같은 보드를 개념 구분 9칸 × 구현 구분 14칸 표로 바꿈(https://claude.ai/artifact/KMbmL7iE4x2GoX3W2M5YEG). 지금은 Persistence를 Memory에 합쳐 개념 8칸 × 구현요소 19개(평가 요소 다섯 포함) |
| B. 대응 띠 | 위 줄에 한계, 아래 줄에 구성요소, 1:1 세로 화살표 | Agent loop에 짝이 되는 한계가 없어(새 한계를 만드는 쪽) 1:1로 맞지 않음. 순위를 낮춤 |
| C. 수식 | Agent = Model + 구성요소들, 각 항 아래 구현 한 줄 | 첫 장이나 마지막 장 |
| D. 그래프 색 구분 | 구성요소를 범례로 두고 발전 흐름 그래프 노드에 색 | 구조와 발전 과정을 연결할 때 |
| E. 루프 배치 | 루프 원 위에 Context, Model, Tools, 결과 | 동작 순서를 보여 줄 때. 루프가 틀이 되어 동등 조건이 깨짐 |
| F. 두 줄 구분 | 칸을 같은 크기로 두고 두 줄로 나눔. 처음 안은 연도(2023년 틀 4칸, 2026년 추가 5칸), 2026-11-24 사용자 제안은 단계(기본 구성 5칸, 실사용 보강 4칸. Persistence를 Memory에 합친 뒤 3칸) | 방향 2. 발표 제목, 발전 흐름 그래프의 흐름과 맞음 |

제외한 형태:

- 동심원과 스택: 층 사이에 안팎이나 위아래가 생겨 동등 조건과 맞지 않습니다.
- Model을 가운데 둔 방사형: Model만 다른 자리에 놓입니다. Raj 2026이 이 모양이지만 3 family로 묶여 한 층 조건과도 맞지 않습니다.
- LLM OS 비유(CPU, RAM 등): 비유를 쓰지 않는다는 작성 기준과 맞지 않습니다.

## 구현 관점

구현 관점의 구성요소는 [agent-components-implementation.md](agent-components-implementation.md)로 옮겼습니다(2026-11-24). 요약:

- 구현 장은 14개를 모두 씁니다. MC의 12개에 Model(모델 호출 계층)과 Sessions(세션 저장, 처음 이름은 Persistence)를 더한 것입니다(2026-11-24 사용자 결정, 상한 없앰).
- 14개 중 8개는 조사한 하니스 6개 모두에 있고, Long-term memory와 Verification은 일부에만 있습니다.
- 14개는 Evaluation을 뺀 개념 칸마다 하나 이상 대응합니다. Evaluation은 에이전트 밖의 평가용 하니스에서 하므로 14개 안에 대응 칸이 없습니다. 에이전트 쪽 접점은 비대화 실행과 JSON 출력이 공통이고, 저장소 안 평가 실행기는 Pi와 Hermes에서만 확인됐습니다. 구현 장에 15번째 칸은 두지 않는 안을 냈고, 매트릭스와 다이어그램에는 사용자 요청으로 평가 요소 다섯을 더했습니다([evaluation-elements.md](evaluation-elements.md)).

## 변경 이력

- 2026-11-24: Persistence를 Memory에 합친 사용자 결정 반영(결정이 필요한 점 표, 단계 구분 행, 8칸, 형태 A·F, 구현 칸 이름 Sessions)
- 2026-11-24: Persistence 칸 이름을 줄일 때 state가 빠진 문제를 개념 장 문서로 연결
- 2026-11-24: loop engineering의 원문 확인(정의 없음, goal 지향 반복 workflow를 예로 듦)과 평가 요소 문서 링크를 더함
- 2026-11-24: 사용자 정정 반영. Weng 2026의 loop engineering은 기본 agent loop가 아니라 goal을 추구하는 바깥 루프(Ralph loop 등)라 Planning·Goal 쪽에 대응
- 2026-11-24: 300줄에 가까워져 개념 장 구성안 절(검토, 비판적 검토 포함)을 agent-components-concept.md로 옮기고 링크를 고침
- 2026-11-24: 매트릭스 보드를 개념 구분 × 구현 구분 표로 바꾼 것을 적음
- 2026-11-24: 형태 A(매트릭스)를 화이트보드로 그리고 링크를 적음
- 2026-11-24: 개념 장 구성안의 비판적 검토를 더함(줄 나눔, 칸, 대응 관계의 문제 10개와 고칠 방법 후보). 그래프와 나눔이 같다고 한 앞 문장을 고침
- 2026-11-24: 개념 장 구성안(기본 구성 5칸, 실사용 보강 4칸) 절을 더함. 사용자 제안(Agent loop를 윗줄로, 연도 대신 단계로)을 발전 흐름 그래프의 앞뒤 나눔과 대조해 검토하고, 형태 F를 두 줄 구분으로 고침
- 2026-11-24: ai-wiki 후속 답 반영. 두 루프를 나눈 출처 표와 슬라이드 정의 후보를 더하고, "과제 하나 대 집계"와 "에이전트 안 대 밖"의 두 축을 적음. Weng 2023 Planning의 Reflection and refinement를 매트릭스에 넣고 Verification의 연도 표시를 고침
- 2026-11-24: Verification과 Evaluation을 각각 칸으로 두기로 한 사용자 결정 반영. 매트릭스에 Evaluation 열, 결정이 필요한 점에 Evaluation 행을 더하고, 사용자 정의를 출처와 대조한 검토를 적음. 방향 1은 7칸, 방향 2는 7칸, 방향 2 확장은 9칸으로 고침
- 2026-11-24: Verification과 Evaluation의 출처별 뜻을 ai-wiki로 확인해 절을 더함. Verification 묶음의 근거를 Xu, MC, Zhang, Ning으로 고치고 매트릭스에서 Raj의 Grader를 뺌. 방향 2의 Evaluation 칸을 Verification으로 바꾸는 안을 냄
- 2026-11-24: 상한을 없애고 구현 관점을 14개로 정한 결정 반영. 구현 관점 절을 agent-components-implementation.md로 옮기고 후보 방향에 방향 2 확장(8칸)을 더함
- 2026-11-24: 사용자 의견으로 모델 호출과 세션 저장을 구현 구성요소에 넣음(6개 하니스 근거 표, 앞서 뺀 이유와 다시 본 결과, A·B·C안, 방향 1·2와의 대응). Persistence 제외는 그래프에 대한 결정이었음을 적음
- 2026-11-24: 구현 관점 재검토를 ai-wiki 후속 답으로 고침(MC 12개와 보급 표, 6·8·10개 선택지, 11개 제품 추가 항목, 모델 호출 계층, 한 턴의 순서, 개념 장과의 대응). 기준 B의 순위를 낮추고 goal 배치를 MC대로 되돌림
- 2026-11-24: 구현 관점 재검토 추가(분류 종류별 개수, 후보 10개와 기준 A·B·C, 시각화 G~J). ai-wiki 확인 대기
- 2026-11-24: ai-wiki 답 반영. 출처별 분류 표, Verification 묶음, 결정이 필요한 점, 2023년과 2026년의 차이, 후보 방향 2, 형태 F를 더하고 B의 순위를 낮춤
- 2026-11-24: 초안 작성. ai-wiki 검증 대기
