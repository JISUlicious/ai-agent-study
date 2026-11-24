# AI 에이전트 구성요소: 구현 관점

발표의 구현 장에 쓸 구성요소를 정한 기록입니다. 개념·추상 관점의 분류와 시각화 방향은 [agent-component-views.md](agent-component-views.md)에 있습니다. 2026-11-24에 그 문서의 "구현 관점 재검토" 절을 이 문서로 옮겼습니다.

## 결정

- 구현 장은 14개를 모두 씁니다. MC의 12개에 Model(모델 호출 계층)과 Sessions(세션 저장)를 더한 것입니다(2026-11-24 사용자 결정). Sessions는 처음에 Persistence라고 불렀고, 개념 장에서 Persistence를 Memory에 합치면서 이름을 바꿨습니다(아래 "칸 이름").
- 개수 상한 10개는 없앴습니다(2026-11-24 사용자 결정). 한 층의 동등한 칸으로 두고 칸 안에 하위 구성요소를 두지 않는다는 조건은 그대로입니다.
- 합치거나 빼서 줄인 안(6·8·10개, A·B·C안)과 고르지 않은 이유는 아래 "개수를 정한 과정"에 남겼습니다.
- 개념 장에서는 Verification과 Evaluation을 각각 칸으로 둡니다(2026-11-24 사용자 결정). 구현 14개에는 Verification만 있고, Evaluation은 에이전트 밖의 평가용 하니스에서 합니다(아래 "Evaluation과 닿는 구현"). 사용자 요청으로 매트릭스와 다이어그램에는 평가 요소 다섯(eval 세트·grader, capability 평가, CI 회귀 평가, telemetry, 운영 지표·모니터링)을 더해 구현요소가 19개입니다([evaluation-elements.md](evaluation-elements.md)).

## 근거와 범위

- 주요 출처는 위키의 main-components-of-top-agent-harnesses(이하 MC), comparisons/agent-harness-code-study-2026-11(이하 CS), 에이전트별 조사 페이지입니다.
- 모두 2026-11-18에 조사했고 빌드하거나 실행하지는 않았습니다. 2026-11-24에 ai-wiki 세션에서 받은 답을 정리했습니다.
- 근거 강도는 ai-wiki가 매긴 값입니다. 강은 코드를 읽은 조사, 중은 문서만 본 조사나 위키 종합, 약은 추론입니다.
- MC의 범위는 "the loop and what plugs into it, not servers, UIs or storage"입니다. MC를 만들 때 범위를 "에이전트 자체"로 한정한 결과입니다.

## 14개와 하니스 6개의 보급

| 칸 | MC 항목 | OpenClaw | Hermes | opencode | Claude Code | Codex | Pi |
|---|---|---|---|---|---|---|---|
| Agent loop | Agent loop | ● | ● | ● | ● | ● | ● |
| Model | MC 밖(모델 호출 계층) | ● | ● | ● | ● | ● | ● |
| Tools | Tool definition and execution | ● | ● | ● | ● | ● | ● |
| Context assembly | Context assembly and system prompt | ● | ● | ● | ● | ● | ● |
| Compaction | Compaction | ● | ● | ● | ● | ● | ● |
| Skills | Skills | ● | ● | ● | ● | ● | ● |
| Hooks | Hooks | ● | ● | ● | ● | ● | ● |
| Sessions | MC 밖(세션 저장) | ● | ● | ● | ● | ● | ● |
| Permission·Sandbox | Permissions and the sandbox boundary | ● | ● | ● | ● | ● | ○ |
| Loop guards | Loop guards and error recovery | ● | ● | ● | ● | ● | ○ |
| Planning·Goal | Planning, todo and goal | ● | ● | ● | ● | ● | — |
| Sub-agents | Sub-agents | ● | ● | ● | ● | ● | — |
| Long-term memory | Long-term memory | ● | ● | — | ● | ● | — |
| Verification | Verification before stopping | ○ | ● | ○ | ○ | ○ | — |

- ●는 있음, ○는 부분, —는 없음입니다.
- Claude Code 열은 유출 스냅샷 해설과 문서로 채워 근거가 중이고, 나머지 열은 코드를 읽은 조사(강)입니다.
- OpenClaw의 Planning은 UI 체크리스트가 부분이고 /goal은 있어 ●로 셌습니다.
- 위의 8개는 6개 하니스 모두에 있습니다. Permission·Sandbox와 Loop guards는 Pi만 부분이고, Planning·Goal과 Sub-agents는 Pi에만 없습니다. Long-term memory는 4개에 있고, Verification은 기본으로는 Hermes 하나에만 있습니다.

MC의 배치에서 알아 둘 점:

- goal은 Agent loop가 아니라 Planning, todo and goal에 들어갑니다("a loop around the loop"와 누가 완료를 판정하는지). Weng 2026이 2026년 추가로 꼽은 loop engineering(workflow design)이 이 goal 루프에 해당합니다(2026-11-24 사용자 정정). 다만 Weng은 정의 없이 goal 지향 반복 workflow를 예로 들 뿐이라, 바깥 루프만 가리킨다고 단정하지는 않습니다(ai-wiki, 중).
- steering은 Agent loop에, tool search와 code mode는 Tools에 들어갑니다.
- MCP는 항목이 아니라 Tools 안의 도구 공급원으로만 나옵니다. fundamental-components는 MCP를 여러 범주에 걸치는 것으로 봅니다(중).
- Sub-agents는 "the same loop, called as a tool"로 설명됩니다.
- sandbox는 루프 단계가 아니라 명령 하나를 감싸는 경계입니다.
- failover와 fallback은 Loop guards에 들어갑니다.

## MC 밖의 두 항목: 모델 호출과 세션 저장

사용자 의견(2026-11-24): 세션 저장과 모델 호출도 중요한 구성요소로 봐야 한다. 같은 날 받은 ai-wiki 답(CS와 에이전트별 조사 페이지)을 다시 보면 둘 다 6개 하니스 모두에 있습니다.

| 하니스 | 모델 호출 계층 | 세션 저장 |
|---|---|---|
| OpenClaw | `packages/ai`와 `llm-core`, provider plugin 76개 | 에이전트별 SQLite 세션. fork는 위키에 없음 |
| Hermes | provider-profile plugin 39개 | SQLite와 FTS5. resume는 위키에 없음 |
| opencode | 자체 `@opencode/ai` 패키지(약 95k줄, provider 약 50개) | SQLite event log, fork, export/import |
| Claude Code◇ | 문서상 Anthropic API, Bedrock, Vertex, Foundry, 게이트웨이 | JSONL, `--resume`, `--fork-session`, rewind(checkpoint) |
| Codex | providers(openai, bedrock, gcp, ollama, lmstudio) | SQLite, resume, fork, archive |
| Pi | `pi-ai`(provider 파일 43개) | JSONL tree, `/resume`, `/fork`, `/clone` |

◇는 문서만 본 조사(중)이고 나머지는 코드를 읽은 조사(강)입니다. 6개 밖에서도 Cline `@cline/llms`와 Goose `goose-providers`가 같은 계층을 별도 패키지로 두고, OpenHands는 LiteLLM을 거칩니다. 세션 저장은 11개 제품 중 Cursor만 위키에 없습니다.

Claude Code의 rewind는 대화만이 아니라 파일 편집도 되돌립니다(공식 문서 2026-11-18 스냅샷, ai-wiki 강).

- 메뉴는 Restore code, Restore conversation, 둘 다입니다. Restore code는 대화를 둔 채 파일 변경만 되돌립니다.
- Claude의 파일 편집 도구로 바꾼 파일의 스냅샷을 최근 checkpoint 100개분까지 둡니다. 스냅샷은 별도 파일이고, checkpoint는 대화와 함께 저장돼("saves checkpoints with the conversation") resume 뒤에도 rewind가 됩니다. 약 30일 뒤 지워집니다.
- Bash로만 바꾼 파일, 다른 세션이나 사용자가 바꾼 내용, 대부분의 subagent 편집은 되돌리지 못합니다. 문서는 이런 변경은 git으로 되돌리라고 합니다.
- 문서는 이 기능을 "manage session state"로 설명합니다. 세션 저장이 대화 기록만이 아니라 작업 상태까지 다룬다는 예입니다. 개념 장에서는 세션 저장을 Memory에 묶었으므로(2026-11-24 사용자 결정), rewind의 파일 되돌리기는 세션 저장의 부가 기능으로 짧게 설명합니다([agent-components-concept.md](agent-components-concept.md)의 "Memory와 Persistence").

앞서 뺀 이유와 다시 본 결과:

| 항목 | 앞서 뺀 이유 | 다시 본 결과 |
|---|---|---|
| 세션 저장 | MC가 storage를 범위에서 뺐고, 2026-11-19에 Persistence를 뺀 판단과 같은 기준 | 2026-11-19 결정은 발전 흐름 그래프(한계와 대응)에 대한 것이라 구현 장으로 옮길 근거가 아니었음. MC가 뺀 것도 조사 범위를 "에이전트 자체"로 한정한 결과임. Weng 2026이 하니스에 더해진 항목으로 persistent state management를 꼽고(강), 위키 보편 8개에도 Persistence가 있음(중, 위키 종합) |
| 모델 호출 | 구성요소로 둔 분류가 없고, 하니스가 모델을 부르는 통로라 다른 칸과 층위가 다름 | MC의 Agent loop 설명이 모델 호출과 도구 실행을 반복하는 루프이고, 한 턴 흐름에도 모델 호출이 한 단계로 있음. 도구 실행은 Tools 칸인데 모델 호출만 빠지면 짝이 맞지 않음. 여러 하니스가 이 계층에 hook 지점을 둠(Pi `before_provider_request`, opencode `model.request`, Hermes `pre/post_api_request`, Codex model-request interceptor) |

남는 한계:

- 모델 호출 계층을 독립 구성요소로 둔 분류는 위키에 여전히 없습니다. three-layer model은 I/O와 streaming 같은 인프라를 L1(모델 능력) 아래로 보고 뺍니다(중). 가장 가까운 것은 Lin 2026의 Middleware(도구 호출과 모델 호출 앞뒤의 처리)입니다. 발표에서는 "분류 문헌의 항목"이 아니라 "조사한 하니스 코드에 모두 별도 계층으로 있는 항목"으로 말해야 합니다.
- 저장은 루프의 한 단계가 아니라 계속 일어납니다(아래 "한 턴의 순서").

## 구현 목록이 분류보다 긴 이유

| 종류 | 출처와 개수 |
|---|---|
| 개념·정의 분류 | Böckeler 2, Weng 2023 3, CoALA 3, Harness Handbook 4, Ning 5, Meng·Xu·three-layer model 6 |
| 코드·기능 목록 | Harness² 8(파일 단위), fundamental-components 통합 10(보편 8과 신흥 2), MC 12 |
| 예외 | Raj 2026은 정의형인데 9개(실패 위치를 찾으려고 User와 Environment까지 넣음). Weng 2026은 2023년 5개(LLM, memory, tools, planning, action)에 4개를 더해 누적 9개 |

- 코드 목록은 정의 분류의 한 범주를 메커니즘 단위로 쪼갭니다. Context는 context assembly와 compaction으로, Loop는 loop, loop guards, steering으로, 제어는 hooks, permission·sandbox, verification으로 나뉩니다(중, 위키 종합).
- MC는 직접 "Code adds three that its framework sources underweight: compaction, steering and loop guards"라고 씁니다(강).
- 14개는 MC 12개에 두 가지를 더한 것입니다. MC가 범위에서 뺀 storage(Sessions)와, 어느 분류에도 독립 항목이 없는 모델 호출 계층(Model)입니다.
- Lin 2026의 개수는 위키 페이지마다 6 또는 7로 달라 원문 확인이 필요합니다.
- 처음 정리에서 "코딩 에이전트 11종 공통 9개"라고 적은 목록은 별도 페이지가 아니라 2026-11-19 ai-wiki 답이 MC와 fundamental-components를 묶어 정리한 것입니다.

## 개수를 정한 과정

| 단계 | 안 | 결과 |
|---|---|---|
| 첫 후보 | 코드 기반 후보 10개와 기준 A·B·C | goal을 Agent loop로 옮긴 것은 MC 배치와 달라 되돌림. 기준 B(Memory와 Verification을 넣고 compaction과 loop guards를 합침)는 MC가 코드 쪽 특징으로 짚은 항목을 가려 순위를 낮춤. 기준 C는 Lin 2026의 개수가 확실하지 않아 약해짐 |
| ai-wiki 후속 답 | MC 12개의 보급으로 6·8·10개 | Long-term memory와 Verification은 일부에만 있어 뺌. 모델 호출 계층과 세션 저장도 뺌 |
| 모델 호출과 세션 저장 추가 | A(10개, 둘씩 합침), B(10개, 보급 기준), C(8개) | 상한 10 때문에 합치거나 빼야 했음. A를 추천 |
| 결정 | 상한을 없애고 14개 전부 | 2026-11-24 사용자 결정 |

14개를 모두 쓸 때 달라지는 점(해석):

- 합치거나 빼는 판단이 없어져 MC 항목을 그대로 칸으로 씁니다. MC가 코드 쪽 특징으로 짚은 compaction과 loop guards가 칸으로 남고, steering은 Agent loop 안에 있습니다.
- Long-term memory와 Verification이 들어가 개념 장의 모든 칸에 대응하는 구현 칸이 생깁니다(아래 "개념 장과의 대응").
- 대신 이 두 칸은 보급 점이 많이 비어 보입니다. 개념 분류에서는 중요한데 제품 기본값으로는 일부에만 있다는 차이가 점으로 드러납니다.
- 칸이 많아 한 장에서 칸이 작아집니다. 배치는 아래 "구현 장의 시각화"에 있습니다.

## 칸 이름

개념 이름을 앞에, 구현을 아랫줄에 둡니다. 확립된 용어는 그대로 쓰고 MC의 설명형 이름만 줄였습니다(예: Tool definition and execution → Tools, Permissions and the sandbox boundary → Permission·Sandbox). 아랫줄 예: Model(provider·streaming), Sessions(resume·fork·rewind), Permission·Sandbox(allow·ask·deny), Loop guards(retry·budget·failover), Verification(completion gate·critic). 아랫줄은 슬라이드를 만들 때 정합니다.

- 세션 저장 칸은 처음에 Persistence라고 불렀습니다. Session storage는 브라우저의 sessionStorage API와 헷갈릴 수 있어 피했습니다. 개념 장에서 Persistence를 Memory에 합친 뒤(2026-11-24 사용자 결정)에는 개념 이름과 겹치지 않게 Sessions로 바꿨습니다. Claude Code 문서도 resume, fork, rewind를 Sessions 절에서 설명합니다(ai-wiki, 강).
- Model 칸은 모델 자체가 아니라 하니스가 모델을 부르는 계층입니다. 아랫줄로 이를 드러냅니다.

## 11개 제품의 추가 항목

| 항목 | 기본 있음 | 부분 | 없음 | 위키에 없음 |
|---|---|---|---|---|
| 세션 간 Memory | Claude Code, Codex†, OpenHands†, Hermes, OpenClaw† | Cursor, Goose | Antigravity, opencode, Cline, Pi | 없음 |
| Planning | Claude Code, Codex, Cursor, Antigravity, opencode, Cline, Hermes | OpenHands, Goose, Pi, OpenClaw | 없음 | 없음 |
| Verification | Hermes | Claude Code, Codex, Cursor, Antigravity, opencode, OpenHands, Cline, OpenClaw | Goose, Pi | 없음 |
| 세션 저장·resume·fork | Cursor 말고 전부 | 없음 | 없음 | Cursor |
| Telemetry | Cline† | Claude Code, Cursor, Goose, Pi | 없음 | 나머지 6개 |
| Checkpoint·rewind | Claude Code, Cursor, Antigravity, opencode, Cline | OpenHands, Pi | 없음 | Codex, Goose, Hermes, OpenClaw |

- †는 기능은 확인했지만 기본으로 켜져 있는지는 위키에 없는 것입니다.
- Claude Code, Cursor, Antigravity는 문서만 본 조사(중)이고 나머지는 코드를 읽은 조사(강)입니다.
- Antigravity와 Hermes는 resume, OpenClaw는 fork 여부가 위키에 없습니다.
- 세션 저장은 가장 널리 있는 기능입니다. 처음에는 MC가 storage를 범위에서 뺀 것과 2026-11-19 결정을 근거로 구현 장에서도 뺐다가, 2026-11-24에 넣기로 바꿨습니다(위 "MC 밖의 두 항목").
- Telemetry는 조사 항목이 아니어서 "위키에 없음"이 많습니다. 없다는 뜻이 아닙니다. Telemetry와 Checkpoint는 14개에 넣지 않았습니다.

## 한 턴의 순서

MC의 공통 흐름입니다(강, Claude Code는 중).

① context 조립 → ② compaction 확인 → 모델 호출(streaming) → 도구 호출이 있으면 ③ pre-tool hook과 ④ permission → ⑤ 도구 실행(병렬, sandbox는 이 경계) → post-tool hook, 결과 추가 → ⑥ loop guard → ①로 돌아감. 도구 호출이 없으면 ⑦ stop gate(stop hook, verification, goal judge) → 종료 → 배경에서 memory 정리와 review.

제품마다 다른 점:

- compaction 시점: Hermes는 도구 라운드마다, Codex는 턴 전·중·후, Pi는 턴 사이. overflow가 나면 사후에 한 번 더 하는 것은 공통입니다.
- 저장은 단계가 아니라 계속 일어납니다. OpenClaw는 부수효과를 허용하기 전에 transcript 저장을 기다리고, Goose는 step마다 세션을 다시 읽습니다.
- stop gate는 계속 진행을 강제할 수 있습니다. Stop hook의 block이 곧 continue입니다.
- permission과 hook의 선후: Claude Code 스냅샷은 hook이 먼저(중), Hermes와 opencode는 permission이 도구 handler 안, Codex는 policy → 사용자나 Guardian 리뷰 → 실행이고 sandbox에서 거부되면 새 승인을 받아 다시 시도, Cursor는 hook 결과와 권한을 병합(중), Antigravity는 permission이 sandbox mount와 네트워크 허용목록으로 컴파일됨(중).
- 공통: 거부되면 도구 결과로 모델에 돌려줍니다.

이 흐름을 그리면 Agent loop는 칸이 아니라 경로가 되고 Hooks가 ③과 ⑦ 두 곳에 나옵니다. 구성요소 장보다 "한 턴이 어떻게 돌아가나"를 보여 주는 별도 장에 맞습니다.

14개를 쓰면 이 흐름의 단계마다 대응하는 칸이 있습니다. 모델 호출은 Model, ⑥은 Loop guards, ⑦의 verification은 Verification, goal judge는 Planning·Goal, 끝난 뒤의 배경 memory 정리는 Long-term memory입니다. 저장은 단계로 그리지 않고 경로 전체에 걸친 것으로 표시합니다.

### hook을 감싸는 상자로 그리는 안

2026-11-24 사용자 제안(hook을 ③ 단계 대신 모델 호출과 도구 호출을 감싸는 상자로 그림)의 검토와 하니스 6개의 hook 지점은 [hook-points.md](hook-points.md)로 나눴습니다. 요약하면 도구 호출 앞뒤 hook은 6개 모두에 있고, 모델 호출 앞뒤 hook은 Claude Code만 settings hook에 없습니다(mods로는 가능). 그래서 두 상자에 각주를 달았습니다. 2026-11-24 사용자 승인으로 보드에 반영했고, 흐름의 번호는 ①~⑥으로 줄었습니다.

## 개념 장과의 대응 (해석)

방향 1과 방향 2 확장은 [agent-component-views.md](agent-component-views.md)의 "후보 방향"에 있습니다.

| 구현 칸 | 방향 1의 칸 | 방향 2 확장의 칸 |
|---|---|---|
| Model | Model | LLM |
| Agent loop, Loop guards | Agent loop | Agent loop |
| Planning·Goal | Agent loop | Planning |
| Tools, Sub-agents | Tools | Tool use |
| Context assembly, Compaction, Skills, Long-term memory | Context | Memory |
| Sessions | Context | Memory(2026-11-24 Persistence를 합침) |
| Hooks, Permission·Sandbox | Permission controls | Permission controls |
| Verification | Verification | Verification |
| 평가 요소 다섯(eval 세트·grader, capability 평가, CI 회귀 평가, telemetry, 운영 지표·모니터링) | Evaluation | Evaluation |

- 하니스 14개만 보면 Evaluation을 뺀 개념 칸마다 대응하는 구현 칸이 하나 이상 있고, 평가 요소 다섯을 더하면 여덟 칸이 모두 채워집니다. 평가 요소 다섯 중 넷은 에이전트 밖에 있습니다. 10개 안에서는 Verification이 빈칸이었습니다.
- Verification 칸은 기본으로는 Hermes에만 있어, 개념 칸은 채워지지만 보급 점은 거의 비어 보입니다. 나머지 하니스는 hook이나 skill로 부분 지원합니다.
- Verification 칸은 맡은 작업의 결과를 확인하는 것입니다(MC 12번, Zhang 2026의 L0~L3). 만든 에이전트를 재는 Evaluation은 실행 중인 에이전트 밖의 평가용 하니스에서 하므로 14개 안에 대응 칸이 없습니다. 에이전트 쪽 접점은 아래 "Evaluation과 닿는 구현"에 있습니다. 두 개념의 구분은 [agent-component-views.md](agent-component-views.md)의 "Verification과 Evaluation"에 있습니다.
- 방향 2 확장의 Memory에 Context assembly, Compaction, Skills를 둔 것은 Weng 2023이 in-context를 short-term memory로 보기 때문입니다. Sessions는 Persistence를 Memory에 합친 결정(2026-11-24)으로 Memory에 둡니다. 방향 1에서 Sessions를 Context에 둔 것은 Weng 2026의 harness 정의에서 stores artifacts가 context 관리와 나란히 나오기 때문입니다. 둘 다 해석입니다.
- 개념 장을 단계로 나누는 안(2026-11-24 사용자 제안, 기본 구성과 실사용 보강)으로 보면, 구현 14개 중 11개(Model, Agent loop, Loop guards, Planning·Goal, Tools, Sub-agents, Context assembly, Compaction, Skills, Long-term memory, Sessions)가 기본 구성 쪽이고 3개(Verification, Hooks, Permission·Sandbox)가 실사용 보강 쪽입니다. Sessions는 Persistence를 Memory에 합친 뒤(2026-11-24) 기본 구성 쪽으로 옮겼습니다. 기본 구성 쪽에도 Compaction, Skills, Sub-agents, Planning·Goal의 goal, Loop guards, Sessions처럼 실사용에서 더해진 메커니즘이 많습니다. 개념 장의 아랫줄은 새 범주이고, 윗줄 칸의 보강은 구현 장에서 보입니다(해석).
- 대응이 장마다 어긋나는 곳: Sub-agents는 이 표에서 MC를 따라 Tool use에 넣었지만, 발전 흐름 그래프는 Context window → Manage input prompt → Sub-agents로 Context 쪽 대응에 둡니다. Hooks는 Permission controls에 넣었지만 stop hook은 ⑦ stop gate에서 Verification과 goal 판정에도 쓰입니다. 칸마다 개념 색 하나(형태 J)로 칠하면 이 겹침이 가려집니다([agent-components-concept.md](agent-components-concept.md)의 "비판적 검토").
- 이 대응을 개념 8칸(열, 처음에는 Persistence까지 9칸) × 구현요소 19개(행, 평가 요소 다섯 포함) 표로 화이트보드에 그렸습니다(https://claude.ai/artifact/KMbmL7iE4x2GoX3W2M5YEG). 행은 구현 장의 칸 이름 대신 구현 쪽 이름(모델 호출 계층, 도구 호출 루프, 멈추기 전 검증, 세션 저장 등)으로 적었습니다. 칸 이름 중 Agent loop와 Verification이 개념 이름과 같아서(당시에는 Persistence도), 그대로 쓰면 두 축이 모두 개념처럼 보이기 때문입니다. 주된 대응은 ●, 함께 걸치는 대응은 ○입니다. ○는 네 곳입니다: Planning·Goal → Agent loop(MC의 "a loop around the loop"), Skills → Tool use(그래프의 Tool use → Agent Skills), Sub-agents → Memory(그래프의 Context window 대응), Hooks → Verification(stop gate). 평가 요소를 더하면서 eval 세트·grader → Verification(과제 하나의 판정)이 늘었고, transcript와 telemetry를 나누면서(2026-11-24) 세션 저장(transcript) → Evaluation(채점이 transcript를 읽음)이 더해졌습니다. Persistence를 Memory에 합치면서(2026-11-24) 세션 저장은 Memory ●, Evaluation ○가 됐습니다(그 전에는 Persistence ●, Memory ○). ○를 어디에 둘지는 해석입니다.

## Evaluation과 닿는 구현

개념 장의 Evaluation(만든 에이전트의 성능 평가)은 에이전트 밖의 평가 하니스에서 합니다. 하니스 쪽에서 평가에 쓰이는 기능을 2026-11-24에 ai-wiki로 확인했습니다. 2026-11-18 조사 원문 노트에서 키워드로 찾은 결과입니다. 그 조사가 평가 기능을 목표로 하지 않았으므로 ?는 "없음"이 아니라 "조사 범위 밖"입니다.

| 하니스 | trace·telemetry 내보내기 | trajectory·transcript 내보내기 | 비대화 실행·구조화 출력 | 저장소 안 평가 실행기 |
|---|---|---|---|---|
| Claude Code◇ | ● OpenTelemetry export | ○ hook 입력의 transcript_path | ● `-p`와 `--output-format`, Agent SDK | ○ plugin evals(플러그인 평가용) |
| Codex | ? | ○ JSONL rollout | ● `exec`(non-interactive), TypeScript SDK | ? |
| Hermes | ? | ○ batch_runner, save_trajectories(RL·데이터 생성용) | ○ OpenAI 호환 API 서버 | ● evals/ 디렉터리 |
| Pi | ○ pi-telemetry | ○ /export, JSON 모드 | ● print, JSON, RPC 모드와 SDK | ● pi-evals |
| opencode | ? | ○ 세션 export | ○ run 명령 | ? |
| OpenClaw | ? | ? | ? | ? |

- ◇는 문서만 본 조사입니다. 칸마다 근거 강도는 강과 중이 섞여 있습니다(●는 대부분 강, ○는 대부분 중).
- 저장소 안에 평가 실행기가 확인된 곳은 Pi와 Hermes뿐입니다. 공통점은 평가 하니스가 에이전트를 돌릴 수 있게 비대화 실행과 JSON 출력을 여는 것입니다(중).
- 제안(해석): 구현 장에 Evaluation용 15번째 칸은 두지 않습니다. 확인된 기능이 하니스마다 고르지 않고, 비대화 실행은 평가 말고도 CI나 SDK 연동에 쓰이는 일반 인터페이스라 MC가 범위에서 뺀 쪽(서버, UI)에 가깝습니다. 구현 장에는 Evaluation이 에이전트 밖에서 이 접점을 통해 돈다는 점을 한 줄로 적습니다. 이 제안은 하니스 칸만 보이는 구현 장(G안)에 대한 것이고, 매트릭스와 다이어그램에는 사용자 요청으로 평가 요소 다섯을 더했습니다([evaluation-elements.md](evaluation-elements.md)).
- 대안: 비대화 실행을 칸으로 넣으면 보급은 Claude Code, Codex, Pi가 ●, Hermes와 opencode가 ○, OpenClaw가 ?입니다.

## 구현 장의 시각화

| 형태 | 판단 |
|---|---|
| G. 격자 | 14개를 같은 크기 칸으로 두고 칸마다 하니스 6개 보급을 점으로 찍음. 16:9 한 장이면 2×7. 보급 순으로 놓으면 점이 차례로 비어 가고, 개념 색 순으로 놓으면 같은 색끼리 모임 |
| H. 보급도 표 | 위 보급 표 그대로. G와 데이터가 같아 부록용 |
| I. 한 턴의 순서 | MC 흐름. 14개면 단계마다 대응하는 칸이 있음. 구성요소 장이 아니라 별도 장 후보 |
| J. 개념 색 | 위 대응표로 칠함. G를 개념 색 순으로 놓으면 함께 쓸 수 있음. Evaluation 색은 구현 칸에 없으므로 장 아래 한 줄로 에이전트 밖 평가를 적음 |
| K. 연결 그래프와 선택 보기(2026-11-24 사용자 제안) | 개념 상자와 구현요소를 선으로 이은 그래프. 개념을 고르면 관련 구현요소만 남아 그 상자 안으로 들어가고, 두 개념에 걸치는 구현요소는 두 상자의 경계에 놓임. 매트릭스(●, ○)를 그대로 데이터로 씀 |

### K안 설계 메모 (해석)

사용자 제안: 연결 그래프를 그려 두고, 항목을 고를 때마다 관련 요소만 남고 나머지는 사라지는 애니메이션. 예를 들어 Memory를 고르면 context 조립, compaction, skills, 장기 memory, sub-agent가 Memory 상자 안으로 들어오고, Tool use와도 관련된 skills는 Memory와 Tool use 상자에 걸쳐 놓입니다.

- 장점: 여러 개념에 걸치는 구현요소를 복제하지 않고 한 번만 그립니다. 에이전트 구성요소 보드에서 "여러 기둥에 걸치는 노드는 경계 위에 둔다"고 정한 방식과 같고, 발표에서 개념을 하나씩 짚어 가는 흐름과도 맞습니다.
- 고정 배치의 한계: 걸침 쌍은 Memory–Tool use(skills, sub-agent), Planning–Agent loop(goal 루프), Permission controls–Verification(hooks)입니다. Evaluation 항목이 들어오면 Evaluation–Verification(과제별 grader), Evaluation–Memory(transcript) 같은 쌍이 더 생길 수 있습니다. 두 줄로 고정한 8칸에서는 이 쌍을 모두 이웃으로 둘 수 없으므로, 개념을 고를 때마다 상대 상자를 옆으로 불러오는 동적 배치가 필요합니다. 처음 화면에서는 걸침을 경계 대신 선으로 보여 줍니다.
- 처음 화면: 개념 8칸을 두 줄로 두고 구현요소를 그 아래에 놓아, ●는 실선, ○는 점선으로 잇는 연결 그래프.
- 개념을 고를 때: 고른 상자가 가운데로 커지고 ● 항목이 상자 안으로 들어갑니다. ○로 걸치는 항목이 있으면 상대 상자가 옆에 붙고 그 항목은 경계에 놓입니다. 나머지는 흐리게 남겨(불투명도 10~20%) 원래 자리를 잃지 않게 합니다.
- 구현요소를 고를 때: 그 항목이 속한 상자 한두 개만 남고, 항목은 그 사이 경계에 놓입니다.
- 항목 하나가 세 개념에 걸치면 경계에 놓기 어렵습니다(예: hooks는 goal 판정에도 쓰임). 항목마다 개념은 주 하나와 걸침 하나까지로 하고, 나머지는 설명으로 둡니다.
- 발표용: 클릭 말고 화살표 키로 개념을 차례로 넘기는 순서 보기를 둡니다.
- 만드는 방식: llm-to-agent-evo.html처럼 독립 HTML 페이지에서 SVG와 CSS 전환(또는 FLIP 애니메이션)으로 만들고, 데이터는 매트릭스와 같은 JSON 하나로 둡니다. 화이트보드 embed는 16,000자 제한이 있어 작습니다.
- 정적 초안(2026-11-24): 매트릭스 보드의 표 아래에 애니메이션 없이 먼저 그렸습니다(https://claude.ai/artifact/KMbmL7iE4x2GoX3W2M5YEG). 걸치는 짝이 이웃하도록 개념 순서를 바꿔, 윗줄은 LLM, Planning, Agent loop, Tool use, Memory, 아랫줄은 Permission controls, Verification, Evaluation, Persistence로 놓았습니다. 아랫줄은 Evaluation 양옆에 Verification과 Persistence를 두었고, 평가 요소를 더하면서 eval 세트·grader를 Verification 쪽 경계에 놓았습니다. transcript와 telemetry를 나눈 뒤(2026-11-24)에는 세션 저장(transcript)이 Persistence와 Evaluation의 경계에 걸치고, telemetry는 Evaluation 안에 있습니다. Persistence를 Memory에 합친 뒤(2026-11-24)에는 아랫줄이 Permission controls, Verification, Evaluation 세 칸입니다. Memory 상자를 아랫줄 높이까지 늘리고 Evaluation 상자를 Memory에 닿도록 넓혀, 세션 저장(transcript)이 Evaluation과 Memory의 경계에 걸칩니다. 에이전트 밖에서 하는 평가 요소는 회색 블록입니다.
- 사용자 수정(2026-11-24, 왼쪽 연결 다이어그램): Memory 상자를 세션 저장 아래까지만 오도록 줄였습니다(높이 704 → 456). 세션 저장은 아랫줄 첫 행으로 올렸고, 여전히 Evaluation과 Memory의 경계에 걸칩니다. sub-agent 블록은 넓혀 Agent loop, Tool use, Memory 세 상자에 걸치게 했습니다. 세 상자가 윗줄에서 이웃해 고정 배치에서도 세 개념에 걸칠 수 있다는 예이고(위 "항목 하나가 세 개념에 걸치면"의 예외), sub-agent가 도구로 부르는 같은 루프라 Agent loop와도 닿는다는 뜻으로 읽었습니다(해석). 매트릭스의 sub-agent 행에는 아직 Agent loop ○가 없고, 관계를 겹친 버전은 예전 배치 그대로입니다. 반영할지는 사용자 확인을 기다립니다.

### 관계 추가 검토 (2026-11-24, 해석)

사용자 질문: 구현요소 사이의 연결과 개념 사이의 연결을 더하면 어떻게 될까.

- 관계는 세 종류입니다. 개념과 구현의 대응(지금 상자와 블록으로 보임), 개념 사이의 관계, 구현요소 사이의 관계입니다.
- 개념 사이(근거가 있는 것 위주): Agent loop는 LLM을 부르고 Tool use를 실행합니다(MC). 매 턴 Memory에서 context를 조립하고 결과를 덧붙입니다(MC ①). Planning의 goal이 루프를 언제 끝낼지 정하고(MC), Verification 결과가 계속, 수정, 종료를 정합니다(MC ⑦, Zhang 2026). Permission controls는 Tool use를 실행 전에 판정하고 sandbox로 감쌉니다(MC ③④⑤). 루프의 진행은 Memory의 세션 저장에 계속 기록되고(MC), Evaluation은 그 기록을 읽어(DE) 모델과 하니스를 고치는 데 씁니다(Weng 2026의 개선 루프).
- 구현요소 사이: 대부분 한 턴의 순서(MC ①~⑦)입니다. 여기에 실행 순서가 아닌 관계가 더해집니다. sub-agent → 도구 호출 루프(도구로 부르는 같은 루프), skills와 장기 memory → context 조립, 세션 저장(transcript) → eval 세트·grader → CI 회귀 평가, telemetry → 운영 지표입니다.
- 지금 다이어그램에 겹치면: 상자 사이 간격이 24라 이웃 상자 사이의 화살표가 보이지 않습니다. 또 걸침 짝을 이웃하게 놓은 배치라 한 턴의 순서가 판 전체를 가로지릅니다(모델 호출 계층은 왼쪽 끝, context 조립은 오른쪽 끝, permission은 왼쪽 아래). 화살표가 상자와 블록을 가로질러 읽기 어렵습니다.
- 그래서 관계는 별도 보기가 낫습니다. 개념 관계 지도(노드 9개, 화살표 10개 안팎)와 구현 흐름(한 턴 순환, 형태 I)입니다. 인터랙티브(K안)에서는 고른 것의 관계만 화살표로 보이면 겹침 문제가 없습니다.
- 개념 관계를 그리면 Agent loop가 다른 개념을 잇는 중심으로 드러납니다. 비판적 검토 5번(Agent loop의 층위)과 같은 지점입니다. 개념 장은 같은 크기 칸으로 두더라도, 관계 지도에서는 Agent loop를 가운데 두어야 관계가 그대로 보입니다.
- 사용자 요청으로 두 버전을 모두 보드에 그렸습니다(2026-11-24).
  - 겹친 버전: 깨끗한 다이어그램 오른쪽에 같은 상자와 블록을 복사하고, 개념 사이 관계 9개를 파란 화살표로, 한 턴의 순서 9개를 번호 붙은 검은 화살표로, 실행 순서가 아닌 관계 4개를 점선으로 얹었습니다. Persistence를 Memory에 합친 뒤(2026-11-24)에는 Persistence와 이어진 파란 화살표 둘(저장·재개, 기록을 읽음)을 지워 파란 화살표가 7개입니다. 세션 저장 블록이 Memory와 Evaluation의 경계에 걸쳐 그 관계를 보여 주고, 다른 걸침 짝에도 파란 화살표를 두지 않았기 때문입니다. Memory 상자가 길어져 Agent loop → Memory 화살표는 상자들 위로 돌아가게 했습니다. hook을 감싸는 상자로 바꾼 뒤(2026-11-24)에는 hooks를 거치던 화살표를 지워 번호 화살표가 8개이고, 번호는 ⑥까지입니다([hook-points.md](hook-points.md)).
  - 따로 그린 버전: 다이어그램 아래에 둘을 나눠 그렸습니다. 개념 관계 지도는 Agent loop를 가운데 두고 LLM(부름), Tool use(실행), Memory(context 조립·덧붙임), Verification(계속·수정·종료)을 네 방향에 놓았습니다. Planning(완료 기준), Permission controls(실행 전 판정), Evaluation(기록을 읽음)은 그 바깥에 놓았습니다. 처음에는 Persistence(저장·재개)도 있었고, Memory에 합친 뒤(2026-11-24) 지우면서 기록을 읽음 화살표를 Memory → Evaluation으로 고쳤습니다. 구현요소 흐름은 한 턴의 순환(① context 조립부터 ⑥ loop guard까지)을 goal 루프 상자로 감싸고, ⑦ 멈추기 전 검증으로 빠지는 길, skills·장기 memory 입력, sub-agent, 기록에서 평가로 이어지는 사슬을 붙였습니다. hook을 감싸는 상자로 바꾼 뒤(2026-11-24)에는 ③ hook 단계가 없어져 순환이 ① context 조립부터 ⑤ loop guard까지이고, 빠지는 길은 ⑥ 멈추기 전 검증입니다. 처음에는 세션 저장 → trace → eval 세트·grader → CI 회귀 평가, 운영 지표였고, transcript와 telemetry를 나눈 뒤(2026-11-24)에는 세션 저장(transcript) → eval 세트·grader → CI 회귀 평가와 capability 평가, 루프 → telemetry → 운영 지표의 두 갈래입니다. telemetry와 운영 지표는 goal 루프 상자 오른쪽에 놓았습니다.
  - 사용자 수정(2026-11-24): 기록과 평가 사슬을 루프 왼쪽으로 옮기고, 세션 저장을 "세션 저장 (agent trajectory)"로 바꿨습니다. 화살표 이름도 일부 바꿨습니다(부름 → 호출, 완료 기준(goal) → 완료 기준, 계획을 세움 → LLM의 기능). 사용자 요청으로 세션 저장 → ① context 조립 점선("context에 넣음")을 더했습니다. 저장한 trajectory를 다시 context에 넣는 재개(resume)를 뜻합니다.

## 변경 이력

- 2026-11-24: hook을 감싸는 상자로 보드에 반영한 뒤의 번호(①~⑥)와 겹친 버전의 화살표 수를 고침
- 2026-11-24: hook 표현 검토를 hook-points.md로 나누고 요약만 남김(문서가 300줄에 가까워짐)
- 2026-11-24: hook을 단계 대신 감싸는 상자(모델 호출, 도구 호출)로 그리는 사용자 제안을 검토해 근거, 판단, 보드에 그리는 안을 적음
- 2026-11-24: 왼쪽 연결 다이어그램의 사용자 수정(Memory 상자 높이, 세션 저장 위치, sub-agent가 세 상자에 걸침)과 매트릭스·겹친 버전과 어긋나는 점을 적음
- 2026-11-24: Persistence를 Memory에 합친 결정 반영. 세션 저장 칸 이름을 Sessions로 바꾸고, 대응표, 기본 구성·실사용 보강 나눔(11개와 3개), 8칸 표기, 다이어그램과 관계 지도 설명을 고침
- 2026-11-24: Claude Code의 rewind(checkpoint)가 파일 편집도 되돌린다는 공식 문서 내용을 세션 저장 표와 그 아래에 더함(ai-wiki 확인)
- 2026-11-24: transcript와 telemetry를 나눈 결정을 대응 설명, ○ 목록, 다이어그램과 흐름 설명에 반영
- 2026-11-24: capability 평가(사용자 승인)를 더해 평가 요소 다섯, 구현요소 19개로 고침
- 2026-11-24: 따로 그린 버전의 사용자 수정(배치, 이름)과 세션 저장 → context 조립 점선 추가를 적음
- 2026-11-24: 관계를 겹친 버전과 따로 그린 버전을 보드에 그린 내용을 적음
- 2026-11-24: 개념 사이, 구현요소 사이의 관계를 더하는 안을 검토해 적음
- 2026-11-24: 매트릭스와 다이어그램에 평가 요소 넷을 더한 것을 대응표와 설명에 반영(구현요소 18개, ○ 두 곳 추가). Weng의 loop engineering 정의에 대한 ai-wiki 확인을 MC 배치 메모에 적음
- 2026-11-24: K안의 정적 초안을 매트릭스 보드 아래에 그리고 개념 배치 이유를 적음
- 2026-11-24: 사용자 제안 시각화 K안(연결 그래프와 선택 보기)과 설계 메모를 더함. Weng 2026의 loop engineering이 goal 루프임을 MC 배치 메모에 적음(사용자 정정)
- 2026-11-24: Weng 2026이 요약한 2023년 틀 5개를 적고, 비판적 검토 링크를 새 개념 장 문서로 고침
- 2026-11-24: 매트릭스 보드의 행을 구현 쪽 이름으로 바꾼 이유를 적음
- 2026-11-24: 개념 × 구현 매트릭스 보드와 ○ 대응 네 곳을 적음
- 2026-11-24: 비판적 검토에서 찾은 대응 어긋남(Sub-agents, Hooks)을 적음
- 2026-11-24: 개념 장 단계 구분안(기본 구성, 실사용 보강)으로 구현 14개를 나눈 결과와, 기본 구성 쪽에도 실사용에서 더해진 메커니즘이 많다는 점을 적음
- 2026-11-24: ai-wiki 답으로 "Evaluation과 닿는 구현" 절을 더함(하니스 6개의 평가 접점 표). 15번째 칸은 두지 않는 안을 적음
- 2026-11-24: 개념 장에서 Verification과 Evaluation을 각각 칸으로 두기로 한 결정 반영. 대응표에 Evaluation 행을 더하고, 구현 14개에는 대응 칸이 없음을 적음
- 2026-11-24: Verification 칸이 실행 중 확인임을 적고, 방향 2의 칸 이름을 Verification으로 바꾸는 안과 연결
- 2026-11-24: agent-component-views.md의 구현 관점 절을 옮겨 새 문서로 만듦. 상한을 없애고 14개를 모두 쓰기로 한 결정, 14행 보급 표, 개수를 정한 과정, 방향 1과 방향 2 확장의 대응을 반영
