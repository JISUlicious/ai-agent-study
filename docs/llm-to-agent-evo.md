# LLM에서 에이전트까지 발전 흐름 페이지

`llm-to-agent-evo.html`과 그 독립 실행판 `site/index.html`에 대한 문서입니다.

## 무엇을 보여 주나

LLM의 동작 방식에서 출발해, 각 한계가 어떤 대응 방향을 낳고 그것이 어떤 기법과
에이전트 구성요소로 이어졌는지를 그래프로 보여 줍니다. 노드는 네 종류입니다.

| 색 | 종류 | 예 |
|---|---|---|
| 노랑 | Agent component | LLM, Tool use, Planning, Memory, Agent loop |
| 파랑 | Technique / concept | Transformer, RAG, ReAct, MCP, Hook |
| 분홍 | Limit | Hallucination, Context window, Non-deterministic behavior |
| 초록 | Response to a limit | Enrich knowledge, Manage input prompt |

실선은 "이어진다(재료가 된다)", 점선은 "한계의 원인"입니다. 화살표는 시간 순서가 아닙니다.

## 원본과 동기화

- 편집의 원본은 claude.ai의 화이트보드 `llm-to-agent-evo`입니다. 노드 위치와 연결은 보드에서 고칩니다.
- `tools/sync_board.py`가 보드의 요소를 읽어 HTML의 `NODES`, `EDGES`를 바꾸고 `site/index.html`을 다시 만듭니다.
- 선의 경로는 보드의 것을 쓰지 않고 페이지가 다시 계산합니다. 노드를 피해 가는 격자 경로 탐색이며,
  다른 선과 같은 길을 겹쳐 가지 않도록 벌점을 줍니다. 어느 변에서 나가고 들어오는지는 보드의 지정을 따릅니다.
- 카드 설명(`CONTENT`)은 HTML에만 있고 보드에는 없습니다.

## 화면 기능

- 노드를 누르면 바로 이전·다음 노드와 그 선만 강조됩니다. 여러 개를 이어서 선택할 수 있고, 배경을 누르면 풀립니다.
- 선택한 노드마다 오른쪽 패널에 "제목 + 핵심 내용" 카드가 세로로 쌓입니다. 제목 앞의 점 색이 노드 종류입니다.
- 위쪽 표시줄에 선택·이전·다음 개수가 나오고, 목록은 기본으로 접혀 있습니다.
- 틀 위에서 Ctrl/⌘ + 휠(또는 핀치)로 마우스 위치를 기준으로 확대합니다.

## 정한 것과 그 이유

- **선을 자동 배치:** 보드의 선을 그대로 옮기면 노드 위를 지나가는 선이 생겼습니다. 강조 용도에는 겹치지 않는 선이 낫다고 보고 자동 배치를 택했습니다.
- **배치 편집 기능 제거:** HTML에서 노드를 끌어 옮기는 기능을 넣었으나 태블릿 터치에서 잘 동작하지 않았고, 편집 원본이 둘이 되는 문제가 있어 뺐습니다. 배치는 보드에서만 고칩니다.
- **포스(물리) 보기 제거:** 선택한 노드의 이전은 왼쪽, 다음은 오른쪽으로 모으는 보기를 시험했으나 사용하지 않기로 했습니다.
- **카드 형식:** 처음에는 정의, 이유, 이전·다음 노드별 설명, 참고 자료까지 넣는 긴 패널을 설계했으나, 발표용으로 짧은 카드(제목과 핵심 내용)로 줄였습니다.
- **흰 배경 고정:** 어두운 테마에서도 흰 배경과 파스텔 원색을 유지합니다.

## 카드 내용에서 검증한 것

- **Instruction following:** "규모만으로 발현되는가"를 ai-wiki로 확인했습니다. 사전학습만으로도 싹은 보이지만(GPT-2, GPT-3),
  지시를 안정적으로 따르게 만드는 것은 instruction tuning입니다(InstructGPT 1.3B가 175B GPT-3보다 선호됨).
  2025~2026년 모델에서는 이 역할을 post-training의 SFT 단계가 맡습니다. "zero-shot"과 같은 말이 아니라서 카드에서 그 표현을 뺐습니다.
- **Chain-of-Thought로 들어오는 선:** 방법보다 흐름을 보이기 위해 `Scaling → Chain-of-Thought`만 남겼습니다.
- **Coding agent 노드:** 검토했으나 넣지 않기로 했습니다.
- **환각의 대응을 두 갈래로:** 보드는 환각의 원인을 Next token prediction으로 그렸는데 대응은 지식 보충 하나뿐이라 짝이 맞지 않았습니다.
  ai-wiki 검증 결과 RAG는 환각을 줄일 뿐 없애지 못하고(Lewis 2020, Sunil 2026 서베이), 검증과 불확실성 표현이 별도 대응으로 있습니다.
  그래서 초록 노드 `Verify output, express uncertainty`를 추가해 `Hallucination → Verify… → ReAct`로 잇고, `knowledge limitation ⇢ Hallucination` 점선을 넣었습니다.
  ReAct가 환각을 줄였다는 수치는 확인하지 못했으므로 "실행 결과로 확인할 수단이 생긴다" 정도로만 말합니다.
  대안이던 "Hallucination → Enrich 선을 지우고 점선만 추가"는 생성 방식 쪽 원인에 대응이 없어 택하지 않았습니다.
  Fine-tuning은 지식 보충이 아니라 행동 교정(truthfulness, 확신도 보정)으로 환각에 듣는다는 것이 위키 근거이며, "새 지식 fine-tuning이 환각을 늘린다"는 연구는 위키에서 확인되지 않아 쓰지 않습니다.

### In-context learning → RAG는 점선 "Uses"로

실선은 앞 기법에서 뒤 기법이 이어진다는 뜻인데, 이 연결은 그렇게 읽으면 틀립니다. ai-wiki로 확인한 내용입니다.

- RAG 원 논문(Lewis et al., arXiv:2005.11401)이 "in-context learning"을 정의한 GPT-3 논문(Brown et al., arXiv:2005.14165)보다 먼저 나왔습니다. 둘 다 2020년 5월입니다.
- RAG 원 논문은 GPT-3나 in-context learning을 참조하지 않습니다. GPT 계열은 GPT-1, GPT-2만 인용합니다.
- 원 방식은 DPR 검색기와 BART 생성기를 함께 fine-tuning하고 검색 문서를 확률적으로 합산합니다. 프롬프트에 문서를 넣는 방식이 아닙니다.
- 검색 문서를 학습 없이 프롬프트에 넣는 지금의 RAG는 in-context learning 능력을 씁니다. 다만 이 연결을 명시한 논문(In-Context RALM, REPLUG)은 위키에 없고, 근거는 위키 개념 페이지의 서술뿐입니다.

지금의 구현을 설명하는 데 필요해서 연결은 남기고, 점선과 "Uses" 라벨로 "의존"임을 표시했습니다. RAG 설명 카드에 원 논문 방식과 지금 방식의 차이를 한 문장 더했습니다. 연결을 지우는 안과, 검색 연구(REALM, DPR) 노드를 따로 그리는 안은 택하지 않았습니다. 앞의 것은 지금의 RAG가 가능한 이유가 빠지고, 뒤의 것은 발표 범위 밖의 가지가 생깁니다.

정확한 제출일(5월 22일, 5월 28일)은 확인되지 않았으므로 쓰지 않습니다.

### 지식 보충의 두 번째 갈래는 Fine-tuning이 아니라 Tool use

`Enrich knowledge → Fine-tuning`은 근거가 약해 뺐고(사용자가 보드에서 이 선을 `Pre-training → Fine-tuning`으로 바꿈), `Enrich knowledge → Tool use`를 실선으로 추가했습니다. ai-wiki로 확인한 내용입니다.

- Fine-tuning으로 새 사실을 넣을 수는 있지만 대가가 큽니다. Zhang 2026: 장치 없이 순차 학습하면 과제 100개 뒤 1.2%만 남고, 여러 장치를 써도 34.9%이며 기존 능력 평균이 69.4%에서 13%대로 떨어집니다. Back 2026은 LoRA 지식 저장을 RAG와 in-context learning의 보조 수단으로 봅니다.
- Fine-tuning이 환각을 줄인다는 근거는 모두 행동 교정 경로입니다(InstructGPT, RLMF, PROBE). 지식 주입으로 환각이 줄었다는 근거는 위키에 없습니다.
- 도구로 지식을 가져오는 쪽은 근거가 강합니다. Toolformer(2023)는 최신 정보 부족과 사실 환각을 동기로 들고, ReAct(2022)는 정확하고 최신인 지식 검색을 듭니다. WebGPT(2021)는 브라우저로 근거를 모아 인용합니다.
- 측정: ReAct의 HotpotQA 실패 원인 중 환각 비율은 0%, Chain-of-Thought는 56%입니다(사람이 분류한 궤적 200개). 대신 ReAct는 검색 실패가 23%입니다. 도구는 환각을 없애지 않고 실패의 종류를 바꿉니다.
- WebGPT, ReAct, Toolformer는 텍스트 명령 방식이고, JSON 스키마 기반 function calling은 2023년 6월부터입니다.

쓰지 않는 것: Gekhman 2024, Ovadia 2023은 위키에 없어 미확인입니다. WebGPT의 TruthfulQA 퍼센트 값도 원문 텍스트로 확인되지 않았습니다.

HTML 페이지와 터널 사이트에 반영했습니다(노드 47개, 연결 81개). 설명 카드는 Enrich knowledge, Fine-tuning, Tool use 세 개를 고쳤습니다. 도구가 환각을 없애지 못한다는 점은 "줄이는 방향"이라는 뜻으로 받아들이기로 했습니다. ReAct 카드에 넣었던 HotpotQA 수치(환각 0% 대 56%, 검색 실패 23%)는 사용자 요청으로 뺐고, 근거로만 이 문서에 남깁니다. 슬라이드 구성 보드에는 아직 반영하지 않았습니다.

### 검증은 왼쪽의 Verify output이 아니라 뒤쪽의 Plan-Execute-Verify로

`Verify output, express uncertainty` 노드와 선 두 개를 지우고, `Plan-Execute-Verify`(아랫줄 Explore · Plan · Act · Verify) 노드를 Sub-agents와 Goal 뒤, General purpose agents 앞에 두었습니다. 앞서 정한 "환각의 대응을 두 갈래로"를 바꾼 것입니다.

이유:
- `Enrich knowledge → Tool use → ReAct` 경로가 생기면서 `Verify output → ReAct`와 내용이 겹쳤습니다.
- 테스트 실행, 독립 critic, completion gate 같은 검증 장치는 agent loop가 생긴 뒤의 것입니다. LLM 단계의 대응으로 두면 시기가 앞당겨집니다.
- Hallucination과 Non-deterministic behavior는 한계로서는 다르지만(내용이 틀림 / 결과가 달라짐) 대응이 겹칩니다. 검증 노드를 하나로 합쳤습니다.
- explore-plan-act-verify는 탐색, 계획, 검증을 sub-agent가 맡아야 성립하므로 Sub-agents 뒤에 옵니다.

연결은 `Sub-agents →`, `Keep working until the goal is met →`, `→ General purpose agents` 세 개입니다. `Enforce deterministic control →` 연결은 검증이 강제(enforcing)는 아니라는 점 때문에 보류했습니다. `Verify output →`, `Planning →` 연결은 선이 그래프를 가로지르거나 같은 관계가 두 번 그려져 넣지 않았습니다.

ai-wiki로 확인한 근거:
- 노드 이름의 Plan-Execute-Verify는 Ning 2026 서베이의 용어입니다. "explore, plan, code, commit", "gather context → take action → verify work"라는 표현은 위키에 없어 출처가 확인되지 않았고, 그래서 아랫줄에만 두었습니다.
- Claude Code에 Explore, Plan, code-reviewer subagent가 기본으로 있습니다.
- Zhang 2026: 새 컨텍스트에서 실제 환경에 접근하는 독립 critic이 Terminal-Bench +5.9~9.5점, 비용 1.00~1.25배. 멈출 때 다시 확인하는 completion gate는 최대 +6.0점, 비용 1.56배까지.
- Reflexion: 테스트 피드백으로 HumanEval 91%(GPT-4 단발 80%). Building Effective Agents의 evaluator-optimizer 패턴.
- verify가 조기 종료의 대응이라는 근거는 명시적이고, 환각의 대응이라는 근거는 간접적입니다. Ning 2026은 테스트 통과가 거짓 확신을 줄 수 있다고 경고합니다.
- CoVe, SelfCheckGPT는 위키에 없고 FActScore는 이름만 언급됩니다. 쓰지 않습니다.

잃은 것과 보완: 지식 보충으로 해결되지 않는 환각 원인(Next token prediction)의 대응이 그래프에서 빠졌습니다. Hallucination 카드에 뒤쪽 검증 단계로 잇는 문장을 넣었고, "모르는 것을 모른다고 말하게 한다"는 Fine-tuning 카드의 행동 학습으로 옮겼습니다.

슬라이드 구성 보드에는 아직 반영하지 않았습니다.

### 비결정성의 대응은 강제에 한정

`Enforce deterministic control`을 hard/soft verification으로 나누거나, 비결정성 아래에 모델 기반 검증 노드를 두는 안을 검토했지만 넣지 않았습니다. 보드는 그대로입니다. ai-wiki로 확인한 내용입니다.

- "hard/soft verification"은 문헌의 용어가 아닙니다. 근거 있는 표현은 Computational / Inferential control(Böckeler 2026)과 code-based / model-based grader(Anthropic 평가 글 2026)입니다.
- 모델 기반 검증을 비결정성의 대응으로 서술한 문헌이 없습니다. 조기 종료, 환각, 거짓 성공의 대응으로 서술됩니다. Böckeler는 모델 기반 통제 자체를 비결정적이라고 분류합니다.
- Plan-Execute-Verify의 검증은 테스트 실행 같은 결정적 검증이 중심이라, 모델 판단 노드가 가리킬 대상이 아닙니다.
- Zhang 2026의 네 층은 hard와 soft로 나뉘지 않습니다. completion gate와 독립 critic은 검증 시점은 코드가 강제하고 통과 여부는 모델이 판단하는 혼합형입니다(ai-wiki의 해석).
- Bhardwaj 2026: 결정적 검사와 모델 판정을 AND로 묶으면 모델 판정은 잘못된 통과를 늘릴 수 없습니다.

구분은 카드 설명에만 넣었습니다. Hook 카드에 "반드시 지켜야 할 규칙은 코드로 하는 검사에 둔다", Plan-Execute-Verify 카드에 "모델이 하는 검증은 줄일 뿐 보장하지 못하므로 결정적 검사와 함께 쓴다"를 더했습니다. 대안이던 Independent critic 노드 추가, 점선 연결은 택하지 않았습니다.

## 변경 이력

- 2026-11-18: 비결정성 대응을 강제에 한정하기로 결정, Hook과 Plan-Execute-Verify 카드 보충
- 2026-11-18: Verify output 노드 제거, Plan-Execute-Verify 노드 추가, 카드 세 개 수정
- 2026-11-18: ReAct 카드에 넣었던 HotpotQA 수치 제거
- 2026-11-18: 보드의 위치 조정과 연결 변경(Pre-training → Fine-tuning, Enrich knowledge → Tool use)을 HTML에 동기화, 카드 네 개 수정
- 2026-11-18: 지식 보충 갈래를 Fine-tuning에서 Tool use로 바꾼 근거 기록(보드만 반영)
- 2026-11-18: In-context learning → RAG 연결을 점선 "Uses"로 변경, RAG 카드 보충
- 2026-11-18: 보드에서 조정한 위치를 페이지에 동기화. 새 검증 노드의 선이 지나갈 자리를 내기 위해 Fine-tuning 줄을 위로 올린 배치
- 2026-11-18: 환각 대응을 두 갈래로 나눈 결정 추가. 보드와 HTML 모두 반영(노드 47개, 연결선 80개), 새 노드의 카드 문장 추가
- 2026-11-17: 문서 작성. 저장소 생성 시점의 페이지 구조와 결정 사항 정리
