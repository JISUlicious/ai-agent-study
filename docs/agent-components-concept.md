# AI 에이전트 구성요소: 개념 장

발표의 개념 장 구성을 정하는 기록입니다. 여러 관점의 분류와 후보 방향은 [agent-component-views.md](agent-component-views.md), 구현 장은 [agent-components-implementation.md](agent-components-implementation.md)에 있습니다. 2026-11-24에 agent-component-views.md의 "개념 장 구성안" 절을 이 문서로 옮겼습니다.

## 개념 장 구성안: 기본 구성과 실사용 보강

2026-11-24 사용자 제안입니다. 방향 2 확장으로 하되 Agent loop를 윗줄에 둡니다. 연도로 나누지 않고, Agent loop의 초안이 LLM, Planning, Memory, Tool use와 함께 만들어졌고 그 뒤 실제 사용이 늘면서 필요한 것들이 더해졌다고 봅니다.

| 줄 | 칸 |
|---|---|
| 기본 구성 | LLM, Planning, Memory, Tool use, Agent loop |
| 실사용 보강 | Verification, Evaluation, Permission controls |

줄 이름은 후보입니다. 작성 기준(용어와 명사, 동사 없음)에 맞춰 붙였습니다. 처음에는 아랫줄에 Persistence도 있었지만, 2026-11-24 사용자 결정으로 Memory에 합쳐 모두 8칸입니다(아래 "Memory와 Persistence").

### 검토 (해석)

- 발전 흐름 그래프의 Agent loop 앞쪽과 윗줄이 같습니다. 그래프에서 Agent loop 노드로 들어오는 선은 LLM, Planning, Tool use, Internal memory, External memory, ReAct에서 옵니다. Agent loop 뒤로는 루프가 만든 한계(Stops before the task is done, Context window, Non-deterministic behavior)와 그 대응이 이어지고, 그중 Plan-Execute-Verify가 Verification, Permission, Sandbox, Hook이 Permission controls에 해당합니다. 다만 뒤쪽에는 윗줄 칸의 보강도 섞여 있어 나눔이 완전히 같지는 않습니다(아래 "비판적 검토" 2).
- 앞서 남은 이름 문제가 풀립니다. 루프의 초기 형태는 ReAct부터 있었으므로 Agent loop는 윗줄이 맞습니다. Weng 2026이 2026년 추가로 꼽은 workflow design(loop engineering)은 기본 agent loop가 아니라 Ralph loop처럼 goal을 이룰 때까지 다시 돌리는 바깥 루프입니다(2026-11-24 사용자 정정). 이것은 Planning·Goal 쪽의 제품 단계 보강이고, loop guards는 Agent loop 칸의 구현입니다. Building Effective Agents의 정의(환경의 피드백을 받아 루프 안에서 도구를 쓰는 LLM)도 루프를 기본으로 봅니다.
- 연도로 자를 때 생기던 문제가 줄어듭니다. Verification처럼 앞선 형태(Weng 2023 Planning의 Reflection and refinement)가 있던 항목도 "실사용이 늘면서 독립 구성요소로 자리 잡음"으로 설명할 수 있습니다.
- 그래서 아랫줄은 "새로 생긴 것"보다 "실사용이 늘면서 독립 구성요소로 자리 잡은 것"으로 말하는 편이 안전합니다. 제어도 Building Effective Agents(2024-12)가 이미 권고했지만 구성요소로 두지는 않았습니다. ai-wiki 확인 결과도 같습니다(아래 "근거 확인" 3).
- 실사용 보강은 아랫줄에만 있지 않습니다. 윗줄 칸 안에도 나중에 더해진 것이 많습니다. 그래프에서 Agent loop 오른쪽에 있는 MCP, Agent Skills, Computer Use(Tool use 쪽), Context engineering, Sub-agents(Memory와 Context 쪽), Goal(Planning 쪽)이 그 예이고, 구현 장에서는 Compaction, Skills, Sub-agents, Planning·Goal, Loop guards로 보입니다. 개념 장의 아랫줄은 새 범주이고, 윗줄 칸의 보강은 그래프와 구현 장에서 보이는 셈입니다.
- Evaluation은 발전 흐름 그래프에 노드가 없습니다. 그래프는 한계와 대응을 그리고, Evaluation은 한계라기보다 실사용의 필요에서 나온 것이라 개념 장에만 나옵니다. Memory에 합친 세션 저장도 그래프에 노드가 없습니다.

아랫줄 칸별로 실사용에서 생긴 필요(필요는 해석, 근거는 ai-wiki 확인. 발표 메모 후보):

| 칸 | 실사용에서 생긴 필요 | 근거 |
|---|---|---|
| Verification | 끝났다고 한 작업이 덜 끝났거나 결과가 틀림. 그래프의 Stops before the task is done | 2026년 분류의 verification(Xu, MC, Zhang) |
| Evaluation | 모델이나 하니스를 바꿀 때 어느 쪽이 나은지 재야 함 | Demystifying evals: 운영 단계에서 규모가 커지면 평가 없이 만드는 방식이 무너짐(강) |
| Permission controls | 실제 파일, 명령, 외부 서비스를 다루면서 예상하지 못한 동작이 생김. 그래프의 Non-deterministic behavior | Building Effective Agents(2024-12): 자율성이 비용과 오류 누적을 부르므로 sandbox 테스트, guardrails, checkpoint, stopping condition을 더함(강) |

Persistence 행은 Memory에 합치면서 뺐습니다(2026-11-24 사용자 결정). 이 행에 적었던 필요(작업이 길어지면서 중단, 재개, 분기가 생기고, 다시 시도할 때 이미 낸 효과가 겹칠 수 있음. Weng 2026, Xu 2026)는 Memory 칸이 실사용 단계에서 보강된 이유로 설명합니다.

### 비판적 검토 (해석)

2026-11-24 사용자 요청으로 이 구성안의 약점을 따져 봤습니다.

줄 나눔:

1. "실사용 보강"은 아랫줄만의 성질이 아닙니다. 윗줄 칸의 구현도 대부분 실사용에서 생겼습니다. Planning은 개념으로는 2023년 틀에 있지만 구현(todo 도구, plan mode, goal 루프)은 최근 코딩 에이전트의 기능이고, Memory 쪽 Compaction과 Skills, Agent loop 쪽 Loop guards도 같습니다. 두 줄을 실제로 가르는 기준은 "실사용에서 생겼나"가 아니라 "새 범주인가"이고, 이 기준은 결국 시간 순서로 돌아갑니다.
2. 그래프와 나눔이 같다는 근거는 절반만 맞고, 순환 논증이 될 위험이 있습니다. Agent loop 뒤쪽에는 아랫줄 범주(Plan-Execute-Verify, Permission, Sandbox, Hook)와 윗줄 칸의 보강(Goal, Sub-agents, Context engineering, MCP, Agent Skills, Computer Use)이 섞여 있습니다. 같은 가지(Stops before the task is done → Keep working until the goal is met)에서 Goal(윗줄 Planning)과 Plan-Execute-Verify(아랫줄 Verification)가 함께 나옵니다. 또 그래프는 같은 관점으로 우리가 만든 것이라 외부 근거가 되지 못합니다. 이 부분은 ai-wiki 확인으로 보완됐습니다. 기본 루프에서 시작해 실사용 요소를 더하는 흐름을 Building Effective Agents, Anthropic 기업용 가이드, Weng 2026, Demystifying evals, three-layer model이 서술합니다(아래 "근거 확인" 4).
3. 출처와 거리가 생겼습니다. 방향 2의 장점은 Weng 2023과 2026, 한 저자의 비교라는 점이었는데, 이 안은 Weng과 두 군데서 다릅니다. evaluation을 둘로 나눴고, Weng이 2026년 추가로 꼽은 workflow design(goal 루프)을 따로 칸으로 두지 않고 윗줄 Planning의 보강으로 봤습니다. 슬라이드에는 "Weng의 틀"이 아니라 "Weng 2023·2026을 참고한 정리"로 밝혀야 합니다. Weng 2026은 네 추가 항목을 배포와 코딩 에이전트 맥락에서 한 묶음으로 내놓지만, 항목별로 실사용과의 연결을 밝힌 것은 persistent state뿐이고 evaluation과 permission은 자기 개선의 안전 맥락에서 설명합니다(아래 "근거 확인" 2).
4. "기본"과 "보강"이라는 이름은 중요도를 암시합니다. 아랫줄이 덧붙인 선택 사항처럼 읽히지만, Permission controls와 Verification은 실사용 에이전트에서 빠지면 안 되는 쪽입니다.

칸:

5. Agent loop는 다른 윗줄 칸과 층위가 다릅니다. LLM, Planning, Memory, Tool use를 엮어 반복하는 구조이고, 그래프에서도 이 넷이 Agent loop로 들어갑니다. Building Effective Agents는 에이전트를 루프 안에서 도구를 쓰는 LLM으로 정의해, 루프를 부품이라기보다 에이전트의 형태로 봅니다. MC가 loop를 첫 구성요소로 둔 선례는 있지만, 한 줄에 나란히 두면 엮는 것과 엮이는 것이 같은 급으로 보입니다.
6. Memory가 Context를 흡수합니다. Raj, Xu, Meng, three-layer model은 Context와 Memory를 나누고, 그래프에 노드가 있는 context engineering이 개념 장에서는 보이지 않습니다. 또 Memory(윗줄)와 Persistence(아랫줄)는 둘 다 무언가를 남겨 두는 것이라 청중이 헷갈릴 수 있어, 칸마다 한 줄 정의가 필요합니다. 이 문제는 2026-11-24에 Persistence를 Memory에 합쳐 풀렸습니다.
7. 아랫줄 넷 중 Evaluation만 실행 중인 에이전트의 일부가 아닙니다. 또 AIMA의 PEAS에는 Performance measure가 처음부터 있지만 에이전트가 아니라 과제 환경을 기술하는 쪽에 속합니다. "나중에 더해졌다"와 "에이전트의 구성요소"라는 두 말 모두와 어긋납니다.
8. LLM을 다른 칸과 같은 크기로 두면 중심이라는 점이 약해집니다(Weng 2023의 agent's brain, Raj의 Model 중심). 같은 크기 칸은 사용자 조건이므로 순서와 설명으로 보완합니다.

대응 관계:

9. Sub-agents의 자리가 장마다 다릅니다. 구현 대응표는 MC를 따라 Tool use에 넣었고, 그래프는 Context window → Manage input prompt → Sub-agents로 Context 쪽 대응에 둡니다.
10. Hooks는 Permission controls에만 대응시켰지만, stop hook은 ⑦ stop gate에서 Verification과 goal 판정에도 쓰입니다. 구현 칸마다 개념 색 하나(형태 J)는 이 겹침을 가립니다.

유지할 점: Agent loop를 2026년 추가로 둔 이전 안보다 정확하고(루프의 초기 형태는 ReAct부터 있음), 앞선 형태가 있던 항목을 연도로 자르는 문제를 피하며, "만들 때 필요한 것과 써 보니 필요해진 것"이라는 이야기로 청중에게 쉽게 전달됩니다.

고칠 방법 후보:

| 문제 | 후보 |
|---|---|
| 1, 4 줄 이름 | 단계 대신 역할로 이름 붙임. 윗줄 "작업 수행", 아랫줄 "신뢰와 운영". 칸 배치는 그대로 두고, 실사용이 늘면서 아랫줄이 독립 구성요소로 자리 잡았다는 이야기는 설명으로 둠. 근거 확인 뒤에는 단계 이름 "데모 단계", "제품 단계"도 후보(아래 "근거 확인" 5) |
| 2 그래프 문구 | "그래프의 Agent loop 앞쪽이 윗줄이고, 뒤쪽에는 아랫줄 범주와 윗줄 칸의 보강이 함께 있다"로 씀 |
| 3 출처 | 슬라이드 각주에 "Weng 2023·2026을 참고한 정리" |
| 5 Agent loop | 윗줄 맨 끝에 두고 "앞 칸들을 엮어 반복하는 구조"라는 한 줄 정의를 붙임. loop engineering 각주는 Agent loop가 아니라 Planning 칸에 닮: goal을 이룰 때까지 다시 돌리는 바깥 루프(Ralph loop 등), Weng 2026의 2026년 추가 항목 |
| 6 Context | Context를 Memory에서 떼어 윗줄을 6칸으로 하거나, Memory 칸 아랫줄에 context를 적음 |
| 7 Evaluation | 칸에 "에이전트 밖" 표시를 두거나 발표 설명으로 처리 |
| 9, 10 대응 | 두 쪽에 걸치는 칸은 대응표에 함께 적고, 색은 주된 쪽 하나로 |

### Memory와 Persistence (2026-11-24)

사용자 지적: Persistence를 Memory와 나누는 것이 애매하다. 이어서 Persistence를 어떤 뜻으로 썼는지 물었습니다. 비판적 검토 6번에서 두 칸이 모두 "남겨 두는 것"이라 헷갈릴 수 있다고 적었던 지점입니다.

**결정(2026-11-24, 사용자)**: Memory로 합칩니다(A안). 설명하기에 더 깔끔하다는 이유입니다. 아래 "다시 본 판단"의 B 추천은 결정 전 검토로 남겨 둡니다. 개념 장은 윗줄 5칸(LLM, Planning, Memory, Tool use, Agent loop)과 아랫줄 3칸(Verification, Evaluation, Permission controls)으로 모두 8칸입니다. Weng 2026의 persistent state management는 Planning의 goal 루프처럼 Memory의 실사용 보강으로 설명합니다. 보드에는 반영했습니다. 매트릭스의 Persistence 열을 지우고 세션 저장을 Memory ●, Evaluation ○로 바꿨습니다. 다이어그램에서는 Persistence 상자를 지우고, Memory 상자를 아랫줄 높이까지 늘리고 Evaluation 상자를 넓혀 세션 저장이 두 상자의 경계에 걸치게 했습니다. 개념 관계 지도는 Memory → Evaluation(기록을 읽음)으로 고쳤습니다. 관련 문서(구현 장, 관점, 평가 요소, 보드 기록, index)의 9칸 표기와 Persistence 대응도 고쳤고, 구현 장의 세션 저장 칸 이름은 Sessions로 바꿨습니다.

#### 합친 Memory의 설명 (후보, 해석)

| 구분 | 구현 | 근거 |
|---|---|---|
| 단기 기억(context 안) | context 조립, compaction | Weng 2023: short-term memory는 in-context learning이고 context window에 묶임(강) |
| 장기 기억(세션이 끝나도 남음) | 세션 저장(transcript: resume, fork), 장기 memory 파일, skills | Weng 2023: long-term memory는 질의할 때 빠른 검색으로 꺼내는 외부 저장소(강). 세 구현을 여기에 넣은 것은 해석 |

- 한 줄 정의 후보: context 안의 단기 기억과, 세션이 끝나도 남는 장기 기억(세션 기록, memory 파일, skills).
- 각주 후보: Weng 2026이 하니스에 더한 persistent state management는 Memory가 실사용 단계에서 보강된 것으로 설명합니다. Planning의 goal 루프와 같은 방식입니다. Ding 2026은 memory를 persistent state의 한 층으로 넣고, Pi는 세션 트리를 memory로 셉니다.
- 발표에서 보충할 점: Claude Code, Codex, Hermes는 세션 기록과 memory를 다른 기능으로 구현합니다. 그래서 구현 장에서는 세션 저장을 Sessions라는 따로 칸으로 두고, 개념 장에서만 Memory로 묶습니다. rewind의 파일 되돌리기와 재시도 때 효과가 겹치지 않게 하는 일은 기억이라기보다 실행 상태 관리라, 세션 저장의 부가 기능으로 짧게 말합니다.

#### 이 문서들에서 쓴 Persistence의 뜻 (자체 점검)

칸 이름은 Weng 2026의 persistent state management를 줄인 것입니다. 그런데 쓴 곳마다 뜻이 달랐습니다.

| 쓴 곳 | 뜻 | 판단 |
|---|---|---|
| 이 문서의 아랫줄 표 | 긴 작업의 상태를 남겨 중단 뒤에 재개하고 분기함 | Weng의 뜻과 맞음 |
| 구현 장과 매트릭스 | 세션 저장(transcript: resume, fork) 하나 | 좁지만 위 뜻 안에 있음 |
| evaluation-elements.md의 대응 | 기록으로 남는 것 전부(CI 결과 기록, 커밋 SHA, observability, trial 환경 격리) | 일반 소프트웨어의 "저장"으로 넓어짐 |
| 아래 근거 확인 3의 2023년 앞선 형태 | AutoGPT의 persistent memory와 장기 memory 관리 | 장기 기억이라 Memory 쪽 |

이름을 줄이면서 state가 빠졌고, 그 뒤로 남겨 두는 것이면 모두 Persistence에 붙였습니다. 두 칸이 겹쳐 보인 원인 중 하나입니다. 다른 원인은 출처에 있습니다. Weng 2026 본문도 같은 파일 저장을 persistent memory라고 부릅니다(해석).

#### 출처의 쓰임 (ai-wiki 확인)

- Weng 2026: 초기 공식 "agent = LLM + memory + tools + planning + action"에 workflow design, evaluation, permission controls, persistent state management를 더한다고 씁니다. memory는 원래 공식에 있고 persistent state management는 따로 셉니다(강). 그런데 Pattern 2의 이름은 "File System as Persistent Memory"입니다. 실험 로그, code diff, 과거 rollout trajectory를 파일에 durable state로 두라고 하면서, 같은 대상을 persistent memory라고도 부릅니다(중). Pattern 3은 기록을 남기면 중단 뒤에 복구할 수 있다고 씁니다(중).
- Xu 2026: 기능 이름은 Execution and State Management이고 정의는 "Keeping durable state across sessions; avoiding duplicate effects on retry"입니다. 효과를 attempted, accepted, committed, verified 네 상태로 나눠, 재개할 때 이미 한 편집을 되풀이하지 않게 합니다. Memory는 따로 두고 "preserving useful experience across tasks", "remembering what still applies"로 설명합니다(강).
- 제품
  - Claude Code: 세션은 서로 독립입니다("Sessions are independent"). 세션을 넘는 지식은 CLAUDE.md와 auto memory로만 넘기고, 세션 JSONL은 resume, fork, rewind에 씁니다(강).
  - Codex: rollout(resume·fork 때 replay)과 memories(rollout에서 추출)를 다른 모듈로 둡니다. rollout이 memories의 원료입니다(강).
  - Hermes: 세션 저장소는 persistence 계층에 두고, 과거 세션 검색(session_search)은 장기 memory 쪽에 묶습니다(강).
  - Pi: 따로 memory 저장소가 없고 세션 트리가 memory 역할을 합니다. 나누지 않는 사례입니다(강).
- Weng 2023: sensory는 embedding, short-term은 in-context learning, long-term은 외부 vector store에 대응시킵니다. episodic, semantic, procedural을 각각 무엇에 대응시키지는 않습니다(강). CoALA는 위키에 2차 정리 초안만 있어 네 memory 모듈의 정의를 인용할 수 없습니다(중).
- ai-wiki의 정리(해석): 같은 파일 저장소라도 다음 결정에 쓰려고 다시 읽으면 memory, 중단 뒤 복구에 쓰면 state입니다.

#### 두 안

| 안 | 내용 | 받치는 근거 | 잃는 것 |
|---|---|---|---|
| A. Memory로 합침 | Memory를 working(context 조립, compaction), episodic(세션 transcript), semantic(장기 memory 파일), procedural(skills)로 나눔. 아랫줄은 세 칸, 개념 장은 8칸 | Pi, Weng 2026 Pattern 2의 이름. 네 갈래 대응은 Weng 2023에 없는 해석 | Weng 2026과 Xu 2026이 따로 세운 항목이 빠짐. 재개, fork, rewind, 재시도 안전 같은 운영 쪽 성격이 가려짐. Claude Code, Codex, Hermes의 나눔과 어긋남 |
| B. 나눠 두고 뜻을 좁힘 | Memory는 다음 판단에 쓰려고 다시 읽는 내용, Persistence는 실행 상태를 세션과 중단 너머로 유지하는 것(Xu의 정의). transcript는 Persistence ●, Memory ○ | Weng 2026의 셈, Xu 2026, 제품 셋(강) | 두 칸의 차이를 청중에게 따로 설명해야 함. Pi는 각주 |

#### 다시 본 판단 (해석)

- 앞서 A를 추천했지만 근거가 약해졌습니다. 네 갈래 기억 대응은 Weng 2023에 없고, 제품 대부분이 세션 기록과 memory를 다른 기능으로 나눕니다.
- 좁힌 뜻의 Persistence는 2023년 무렵 근거가 없습니다. 근거 확인 3에서 persistent memory는 있었지만 세션 저장과 재개는 위키에 없었습니다. 실사용 단계에서 독립 항목이 됐다는 아랫줄 설명과 맞습니다.
- 그래서 B를 추천합니다. 이름은 Weng의 말에서 state를 살려 Persistent state로 바꾸는 안을 함께 냅니다. persistent memory와 겹쳐 읽히는 것을 막고, Xu의 State Management와도 맞습니다. 이름의 근거와 범위 각주는 아래 "이름 확인"에 있습니다.

| 칸 | 한 줄 정의(후보) | 구현 |
|---|---|---|
| Memory | 다음 판단에 쓰려고 다시 읽는 내용 | context 조립, compaction, 장기 memory 파일, skills |
| Persistent state | memory 밖의 실행·세션 상태를 중단과 세션 너머로 유지하고, 다시 시도해도 효과가 겹치지 않게 함 | 세션 저장(resume, fork, rewind) |

- 판별 기준(슬라이드 각주 후보): 같은 기록이라도 다음 판단의 재료로 읽으면 Memory, 이어 가거나 되돌리는 데 쓰면 Persistent state.
- B를 고르면 매트릭스는 그대로입니다(세션 저장: Persistence ●, Memory ○, Evaluation ○). 바꿀 곳은 칸 이름, evaluation-elements.md에서 넓은 뜻으로 붙인 대응, 아래 근거 확인 3의 Persistence 행입니다. 다이어그램에서 세션 저장은 지금 자리(Persistence와 Evaluation의 경계)에 두고 Memory 쪽은 점선으로 잇습니다.
- A를 고르면 매트릭스의 Persistence 열이 없어지고 세션 저장 행은 Memory ●, Evaluation ○가 됩니다. 다이어그램의 Persistence 상자가 없어지고 세션 저장 블록이 Memory 상자로 들어갑니다.
- 고려한 다른 안: Persistence를 Agent loop의 성질(실행 엔진의 durable execution)로 보고 칸을 없앰. Weng 2026과 Xu 2026이 모두 따로 세우고 있어 근거가 약합니다.
#### 이름 확인 (ai-wiki, 2026-11-24)

| 이름 | 위키 페이지 수 | 쓰는 출처와 비고 |
|---|---|---|
| persistence | 37 | 가장 많지만 뜻이 가장 넓음. Xu의 work persistence(책임이 열려 있는 기간), always-on survey의 persistence, 제품의 persistence layer 등이 섞임 |
| persistent state | 12 | Weng 2026의 추가 항목 이름, always-on agents survey(Ding 2026)(강). Ding은 memory를 persistent state의 한 층으로 넣음 |
| durable state | 7 | Weng 2026 Pattern 2, Xu 2026, LangGraph 1.0 발표 글(중) |
| state management | 7 | Xu 2026의 기능 이름, Feng 2026의 Runtime state management, Harness Handbook(Wang 2026)(강) |
| durable execution | 0 | 원천 세 곳에 프레임워크나 연구 분야 이름으로만 지나가듯 나옴 |

페이지 수는 단순 문자열 집계라 뜻이 섞여 있습니다.

- Ding 2026은 "persistent-state systems, not merely memory-augmented ones"라고 쓰고 persistent state를 두 층으로 나눕니다. 하나는 memory(episodic, semantic, preferences, procedural)이고, 다른 하나는 memory 밖의 control-relevant state(workflow·task ledger, policy·permission, provenance·audit, trigger, tool·credential, external commitments & side effects)입니다(강). 이 분류에서 Memory와 Persistent state는 나란한 칸이 아니라 포함 관계입니다. 둘을 나누기 애매하다는 사용자 지적을 받치는 출처입니다.
- LangGraph 1.0 발표 글(중): persistence, observability, human-in-the-loop를 그동안 부족했던 핵심 기능으로 묶습니다. Durable state는 서버가 재시작되거나 작업이 중단돼도 "picks up exactly where it left off"하게 하고, Built-in persistence는 아무 지점에서 저장하고 재개하게 합니다(며칠 걸리는 승인 절차 등). memory와의 관계와 time travel은 위키에 없습니다.
- Claude Code(강, 공식 문서): rewind는 대화와 파일 편집을 따로 또는 함께 되돌리고, 문서는 이 기능을 "manage session state"로 설명합니다. 자세한 내용은 [agent-components-implementation.md](agent-components-implementation.md)의 세션 저장 표 아래에 있습니다.
- Anthropic의 긴 작업 하니스 글(Effective harnesses for long-running agents)은 원문이 위키에 없습니다. OpenDev의 요약으로는 이 글이 하니스를 runtime framework로 보고 session persistence를 하니스의 몫으로 둡니다(중).
- OpenAI 프롬프트 가이드가 persistence를 "끝날 때까지 계속하라"는 지시로 쓴다는 것은 위키에 없어 확인하지 못했습니다. 슬라이드에는 쓰지 않습니다.
- 정리(해석): 이름은 Persistent state가 근거가 가장 좋습니다. Ding 2026처럼 memory를 그 안에 넣는 분류가 있으므로, Memory를 따로 두는 이 발표에서는 "memory 밖의 실행·세션 상태"라고 범위를 각주로 밝힙니다. Persistence만 쓰는 것은 뜻이 가장 넓어 피합니다. 대안 이름은 Durable state입니다.
- 고려한 다른 안: Ding처럼 Persistent state를 상위 칸으로 두고 Memory를 그 안에 넣는 구성. Memory는 2023년 틀의 기본 칸이라 윗줄과 아랫줄을 가로지르게 되어 두 줄 구성과 맞지 않습니다.
- 매트릭스에 주는 영향: 세션 저장 행 이름에 rewind(checkpoint)를 넣을 수 있습니다. Claude Code의 rewind는 파일 편집도 되돌리므로 세션 저장이 transcript만이 아님을 보여 줍니다.

## 근거 확인 (ai-wiki, 2026-11-24)

두 줄 구성안의 역사 서술을 ai-wiki에 확인했습니다. 근거 강도는 ai-wiki가 매긴 값입니다(강: 원문에서 직접 확인, 중: 위키 요약이나 맥락, 약: 추론).

1. 루프의 초기 형태는 윗줄 넷과 함께 나왔습니다(강).
   - Weng 2023은 ReAct의 Thought, Action, Observation 반복을 인용하고, AutoGPT의 시스템 프롬프트를 싣고, AutoGPT, GPT-Engineer, BabyAGI를 proof-of-concept demo로 소개합니다. 다만 루프를 구성요소로 세우지는 않습니다. 구성요소는 Planning, Memory, Tool use이고 LLM은 agent's brain입니다.
   - 시점: ReAct 2022-10, AutoGPT 저장소 2023-03-16, BabyAGI 2023-03-28, Weng 2023 글 2023-06-23, Building Effective Agents의 루프 정의 2024-12-19.
   - Weng 2026은 2023년 틀을 LLM, memory, tools, planning, action으로 요약하고 workflow design(예: loop engineering)을 2026년 추가로 꼽습니다. ai-wiki는 윗줄 Agent loop에 "루프를 설계하고 제어하는 loop engineering은 2026년 하니스 단계"라는 각주를 제안했습니다(중). 그러나 사용자 정정(2026-11-24)으로 loop engineering은 agent loop 코드가 아니라 Ralph loop 같은 goal 추구 루프를 가리키므로, 각주는 Planning·Goal 쪽에 답니다. ai-wiki 재확인 결과, Weng은 이 말을 정의 없이 쓰고 goal 지향 반복 workflow(goal을 이룰 때까지 계획, 실행, 관찰·테스트, 개선을 반복)를 예로 들 뿐이라 바깥 루프만으로 한정할 근거는 없습니다(중). 슬라이드에는 "Weng의 예시: goal을 이룰 때까지 계획·실행·테스트·개선을 반복하는 workflow"로 적고, Ralph loop(Huntley, 2025-07)와 여러 제품의 goal 명령(2026-04~05)은 실무 사례로 따로 출처를 답니다.
2. Weng 2026이 추가 이유를 설명하는 방식(원문은 강, 정리는 중)
   - 하니스가 런타임과 소프트웨어 시스템 설계에 가까워졌다고 하고, 하니스를 배포의 중요한 구성요소로 보며 Claude Code와 Codex를 예로 듭니다.
   - persistent state는 긴 작업의 기록과 산출물을 파일에 두어 중단 뒤에도 이어 가게 한다는 실사용 이유를 직접 씁니다.
   - evaluation과 permission은 자기 개선에서 reward hacking을 막는 맥락으로 설명합니다(evaluator와 permission control은 하니스를 바꾸는 루프 밖에 둠). 항목마다 "실사용 때문"이라고 단 문장은 없습니다.
3. 초기 에이전트에 아랫줄의 앞선 형태가 있었는지

   | 칸 | 2023년 무렵 | 독립 구성요소가 된 근거 |
   |---|---|---|
   | Verification | AutoGPT 프롬프트의 Performance Evaluation 절(자기 점검 지시), Weng 2023 Planning의 Reflection and refinement(강) | 2026년 분류의 verification(Xu, MC, Zhang) |
   | Evaluation | 에이전트 벤치마크 AgentBench(2023-08), SWE-bench(2023-10), MLAgentBench(2023-10)(강) | Demystifying evals(2026), Weng 2026 |
   | Permission controls | 사람 승인 기능의 근거는 위키에 없음. GPT-Engineer의 확인 질문 정도(강) | Building Effective Agents(2024-12)의 sandbox 테스트, guardrails, checkpoint, stopping condition 권고(강) |
   | Persistence | AutoGPT의 persistent memory, 장기 memory 관리, 파일 출력(강). 세션 저장과 재개는 위키에 없음. 앞의 둘은 뜻을 좁히면 Memory 쪽(위 "Memory와 Persistence") | Weng 2026 Pattern 2, Xu 2026의 세션을 넘는 작업(강) |

   - 그래서 아랫줄은 "새로 생긴 것"보다 "실사용이 늘면서 독립 구성요소로 자리 잡은 것"이 근거에 맞습니다(중). 앞선 형태가 가장 약한 것은 Permission controls라 "거의 새로 생김"이라는 각주를 달 수 있습니다(약).
   - AutoGPT 프롬프트의 Performance Evaluation은 이름과 달리 실행 중 자기 점검이라, 이 문서의 정의로는 Verification의 앞선 형태입니다.
4. 기본 루프에서 시작해 실사용 요소를 더한다는 흐름을 서술한 출처(강)
   - Building Effective Agents(2024): 단순한 패턴에서 시작하고, 자율성이 비용과 오류 누적을 부르므로 sandbox 테스트, guardrails, checkpoint, stopping condition을 더하라고 권고합니다.
   - Anthropic 기업용 가이드(2025): 단순하게 시작해 측정이 정당화할 때 확장하고 observability를 내장하라고 권고합니다.
   - Weng 2026: 초기 프레임워크 공식에서 하니스(런타임과 소프트웨어 시스템 설계)로 갔다고 서술합니다.
   - Demystifying evals(2026): 운영 단계에서 규모가 커지면 평가 없이 만드는 방식이 무너진다고 씁니다.
   - three-layer model 페이지(위키 문장): 하니스 없는 에이전트는 연구 데모이지 제품이 아니라고 쓰고, 하니스 범주에 sandbox, permission, hooks, eval harness를 둡니다.
5. 줄 이름에 주는 영향(해석)
   - 단계로 나누는 사용자 제안은 외부 근거가 충분합니다. 비판적 검토 2와 3에서 지적한 근거 부족은 상당 부분 풀립니다.
   - 단계로 이름 붙이려면 출처의 말을 따라 윗줄 "데모 단계", 아랫줄 "제품 단계"가 가능합니다. Weng 2023이 초기 사례를 proof-of-concept demo로 부르고, three-layer model이 하니스 없는 에이전트를 연구 데모라고 부릅니다. "보강"과 달리 아랫줄이 선택 사항처럼 읽히지 않습니다.
   - 비판적 검토 1(윗줄 칸도 제품 단계에서 구현이 바뀜)은 남습니다. 줄은 "그 범주가 언제 구성요소가 됐나"로 나누고, 윗줄 칸의 제품 단계 구현은 구현 장에서 보인다고 설명하면 됩니다.

## 변경 이력

- 2026-11-24: Persistence를 Memory에 합친 결정을 문서 전체에 반영(구성 표, 아랫줄 표, 비판적 검토 6). 합친 Memory의 설명 후보(단기 기억과 장기 기억)를 더함
- 2026-11-24: 이름 확인 절을 더함(ai-wiki 요청 9: 위키 페이지 수, Ding 2026의 포함 관계, LangGraph 1.0, Claude Code checkpoint, OpenAI 쓰임은 확인 못 함). Persistent state의 한 줄 정의에 "memory 밖" 범위를 넣음
- 2026-11-24: Persistence를 어떤 뜻으로 썼는지 점검(쓴 곳마다 뜻이 달랐음). ai-wiki 답(Weng 2023·2026, Xu 2026, 제품 넷, CoALA)으로 두 안의 근거를 고치고, 추천을 A에서 B(뜻을 좁히고 이름 후보 Persistent state)로 바꿈. 아랫줄 표의 Persistence 행에 Xu의 정의를 더함
- 2026-11-24: Memory와 Persistence를 나누기 애매하다는 사용자 지적으로 두 안(합침, 정의를 바꿔 나눔)을 적음. Weng 2023, CoALA의 기억 분류는 ai-wiki 확인 중
- 2026-11-24: loop engineering의 원문 확인 결과(정의 없음, 바깥 루프로 한정할 근거 없음)와 슬라이드 표기안을 적음
- 2026-11-24: 사용자 정정 반영. loop engineering은 goal 추구 바깥 루프라 각주를 Agent loop가 아니라 Planning·Goal 쪽에 둠. 비판적 검토 3의 Weng과 다른 점을 고침
- 2026-11-24: ai-wiki 근거 확인 절을 더하고, 아랫줄 표에 근거 열, 비판적 검토 2·3에 보완 내용, 고칠 방법에 단계 이름 후보와 Agent loop 각주를 넣음
- 2026-11-24: agent-component-views.md의 개념 장 구성안 절을 옮겨 새 문서로 만듦
