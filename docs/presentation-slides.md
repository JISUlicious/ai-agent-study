# 발표 슬라이드: AI Agent 구성요소

사용자가 2026-11-24에 준 54쪽 구성안으로 만든 HTML 슬라이드의 기록입니다. 파일은 저장소 루트의 `ai-agent-slides.html`입니다. 구성안에 없던 질의 기반 RAG(11쪽), Tool call 반복 실패(17쪽), LLM 한계 극복 현황(25쪽), Context window 초과(36쪽), Hook 개념(49쪽), Hook 위치(50쪽), Hook 사례 둘(52, 54쪽)을 더하고, 구성안의 Transformer 구조 한계를 두 장(33, 35쪽)으로 나눠 지금은 63쪽입니다. 2026-11-24에 더한 Hook 판정 구조 장은 2026-11-25에 뺐습니다.

쪽 번호 기준: 장을 자주 더하고 옮겨서, 이 문서는 구성 표, 목차 설명, 순서 비교 표만 지금(66쪽) 기준으로 고칩니다. 구현 방식, 구성안에서 바꾼 것, 검토 의견과 [presentation-fact-checks.md](presentation-fact-checks.md)의 쪽 번호는 적은 날의 기준입니다. 슬라이드 안의 목차와 쪽 참조는 자동으로 계산되어 늘 맞습니다.

## 보는 방법

- 브라우저로 파일을 엽니다. 미리보기 서버는 `.claude/launch.json`의 `agent-slides`(포트 8768)입니다.
- 키보드: →, Space, PageDown은 다음, ←, PageUp은 이전, Home과 End, G는 목록. 화면 오른쪽 아래 버튼으로도 넘깁니다. 터치 밀기로 넘기기는 확대한 채 화면을 움직여도 장이 넘어가서 2026-11-25 사용자 요청으로 뺐습니다.
- 주소 끝의 `#번호`로 그 쪽을 바로 엽니다. 인쇄하면 한 쪽에 한 장씩 1280×720으로 나옵니다(PDF 저장용).
- 링크: https://claude.ai/artifact/MSGCBLEptcaF9znmMG4ZJd (claude.ai 비공개 아티팩트, 2026-11-25 사용자 요청으로 올림). `#번호`도 여기서 그대로 됩니다. 파일을 고친 뒤 다시 올려야 링크에 반영되고, 다른 대화에서 올릴 때는 이 주소를 지정해야 같은 링크가 갱신됩니다. 다른 사람이 보려면 페이지의 Share 메뉴로 공유해야 합니다. Cloudflare quick tunnel([hosting.md](hosting.md))은 주소를 아는 누구나 볼 수 있고 Mac이 켜져 있을 때만 열려서 쓰지 않았습니다.

## 디자인과 작성 기준

- 디자인은 시안 D입니다([whiteboards-and-slides.md](whiteboards-and-slides.md)의 "슬라이드 디자인 시안"). 바탕 #EDEDEA, 글자 #1A1A18, 포인트 컬러 #F0591E, 글꼴 Space Grotesk와 Noto Sans KR, 알약 모양 노드, 1280×720. 값은 Claude Design 캔버스의 시안 D 파일에서 그대로 가져왔습니다.
- 사용자 조건: 키워드와 아주 짧은 한 줄 설명, 그래프는 한 층만 펼침.
- 기존 작성 기준을 따릅니다. 은유를 쓰지 않고, 통용 용어는 원래 표기로, 제목은 용어와 명사로 씁니다. 핵심 노드 하나만 포인트 컬러로 칠하고, 설명 문장은 그래프 아래 왼쪽에 둡니다. 점선은 원인이나 실행 순서가 아닌 관계, 실선은 이어짐과 대응입니다.
- 오른쪽 위에는 섹션 이름과 쪽 번호를 둡니다. 사실 확인이 끝나지 않은 장에는 "확인 중" 표시가 붙습니다.

## 구성

| 쪽 | 섹션 |
|---|---|
| 1–2 | 제목, 목차 |
| 3 | 구성요소(L1 기본 구성: LLM, Tool, Memory, Agent Loop / L2 확장 구성: Planning, Verification, Evaluation, Control) |
| 4–13 | LLM: 토큰 생성, Pre-training, Text generation, In-context learning(같은 과제를 예시 few-shot과 지시 zero-shot으로 나란히, instruction following은 지시 쪽 각주), Prompt 구성(역할별 메시지 → chat template → 토큰 열), Prompt engineering(역할 지정, 명확한 지시, 예시, 출력 형식), 한계, 한계 극복 1~3(RAG, Chain-of-Thought, Prompt chaining) |
| 14–20 | Tool Use: 질의 기반 RAG, WebGPT, JSON 출력, Tool call 템플릿(호출 형식 지시와 모델 출력), 실행, 효과, 반복 실패(Act-only 사례) |
| 21–23 | ReAct: 루프, 이력 활용(17쪽과 같은 과제의 ReAct 궤적), 핵심 개념(Memory, Agent loop) |
| 24–27 | Memory(내부, 외부), Agent Loop(구조, 작업 수행: 구조와 같은 루프 그림에 예시) |
| 28–34 | Planning: LLM 한계 극복 현황, 오작동, Prompt chaining 다시 보기, CoT 프롬프트와 구조, 구현, Primitive AI Agent |
| 35–43 | AI Agent 한계, Context Engineering(Transformer 구조 한계 1: Attention budget, Lost in the middle, Transformer 구조 한계 2: Context window 상한, Context window 초과, 개념, 원칙, 대상, 구현) |
| 44–47 | Agent Skills(개념, 구성), Sub-agents(Multi-agent 구조, 목적) |
| 48–51 | MCP(개념, 구성요소, 구조, 호출 과정) |
| 52–62 | Hook: Controls · Verification(Hook 개념, 위치, 쓰임, 사례: Context engineering, Controls 개념, Hook 사례: Control, Sandbox 필요성과 구현, 조기 종료, Goal loop 구현, Verifier 검증 루프) |
| 63–64 | General-Purpose AI Agent: 구조(매트릭스 보드의 구현요소 흐름), 사례 |
| 65 | Evaluation 확장 (방법론 장은 2026-11-26 사용자 요청으로 뺌) |
| 66 | 정리: '에이전트 구성요소' 화이트보드 최종안(사용자 확정)을 옮긴 그림. AI Agent 상자 안에 Agent Loop(LLM 호출 → 완료? → Tool 호출), Context 구성, Controls(Model · Tool · Stop Hook과 Permission · Verification · Context Control · Goal loop), Internal Tools, Context engineering, Transcript. 바깥에 LLM, External Tools, Tool Exec. Env., Evaluation, 활용 사례 |

목차는 처음에 제목 "구성과 구현"에 맞춰 "구성"(3~28쪽)과 "구현"(29~55쪽) 두 부분으로 묶었습니다. 2026-11-25 사용자 의견(두 부분의 경계가 모호함)으로 묶음을 없애고, 섹션 제목 18개를 쪽 범위와 함께 두 단으로 나열합니다. 제목은 각 장 오른쪽 위의 섹션 이름을 따릅니다. 그래서 전에 한 줄로 합쳤던 Memory · Agent Loop와 AI Agent 한계 · Context Engineering을 나누고, Planning 범위에 들어 있던 Primitive AI Agent(31쪽)도 따로 적습니다. Hook 섹션은 Hook(49~52), Hook · Controls(53~56, Sandbox 포함), Hook · Verification(57~59) 세 줄입니다. 쪽 범위는 2026-11-25부터 장의 섹션 이름으로 계산하므로, 장을 더하거나 옮겨도 목차를 따로 고칠 필요가 없습니다(아래 "구현 방식"). 고려한 대안은 둘이었습니다. 하나는 이전 13줄을 묶음 제목만 빼고 그대로 두는 것인데, 합친 줄이 장의 섹션 이름과 어긋나 택하지 않았습니다. 다른 하나는 쪽 번호까지 빼는 것인데, 발표 중 목차에서 바로 이동할 때 쪽 범위가 쓸모 있어 남겼습니다.

2026-11-24 사용자 승인으로 Sub-agents를 Agent Skills 뒤(38~39쪽)로 옮겼습니다. Context window 한계에 대응하는 장(Context Engineering, Skills, Sub-agents)이 이어지게 하려는 것입니다. MCP부터 Goal Loop까지는 두 쪽씩 밀렸고, 29쪽의 대응 쪽 번호와 목차도 고쳤습니다. 아래 "구성안에서 바꾼 것"과 [presentation-fact-checks.md](presentation-fact-checks.md)의 "사실 확인 결과" 표의 쪽 번호는 옮기기 전 기준입니다.

### 구성안과 순서 비교 (2026-11-25 확인)

처음 구성안(54쪽)과 지금 슬라이드(66쪽)를 한 쪽씩 맞댄 결과입니다. 구성안에 없던 장을 여덟 더했고(11쪽 질의 기반 RAG, 17쪽 Tool call 반복 실패, 25쪽 LLM 한계 극복 현황, 36쪽 Context window 초과, 49쪽 Hook 개념, 50쪽 Hook 위치, 52쪽 Hook 사례: Context engineering, 54쪽 Hook 사례: Control), 한 장을 둘로 나눴고(Transformer 구조 한계 → 33, 35쪽), 자리를 옮긴 곳이 셋(Sub-agents 앞당김, Hook 쓰임을 Controls 앞으로, Lost in the middle을 Transformer 구조 한계 1과 2 사이로)입니다. 나머지는 순서 그대로 쪽 번호만 밀렸습니다.

| 구성안 | 지금 | 내용 | 바뀐 점 |
|---|---|---|---|
| 1–6 | 1–6 | 제목부터 LLM Text generation까지 | 그대로 |
| 없음 | 7 | In-context learning | 새 장(2026-11-26 사용자 요청, in-context learning과 instruction following을 함께 설명하려고 Prompt 두 장 앞에 둠. 처음 제목은 "In-context learning과 Instruction following"이었으나 ai-wiki 요청 29 답으로 바꿈. 15쪽 JSON 출력의 두 알약이 이 장을 가리킴) |
| 없음 | 8 | LLM Prompt 구성 | 새 장(2026-11-26 사용자 요청, prompt가 역할별 메시지를 chat template으로 이어 붙인 토큰 열임을 보임) |
| 없음 | 9 | Prompt engineering | 새 장(2026-11-26 사용자 요청, 37쪽 Prompt engineering → Context engineering 대비의 앞 장) |
| 7–10 | 10–13 | LLM 한계부터 한계 극복 3(Prompt chaining)까지 | 순서 그대로, 두 쪽 밀림 |
| 없음 | 14 | 질의 기반 RAG | 새 장(2026-11-25 사용자 제안, 질문으로 한 번 검색하는 일반 RAG를 보여 WebGPT로 잇는 다리) |
| 11–15 | 15–19 | WebGPT부터 Tool use 효과까지 | 순서 그대로, 한 쪽 밀림 |
| 없음 | 20 | Tool call 반복 실패 | 새 장(2026-11-25 사용자 요청, ReAct로 가는 근거) |
| 16–22 | 21–27 | ReAct부터 Agent Loop까지 | 순서 그대로, 두 쪽 밀림 |
| 없음 | 28 | LLM 한계 극복 현황 | 새 장(2026-11-25 사용자 요청, 복잡한 작업 오작동으로 잇는 다리) |
| 23–29 | 29–35 | Planning부터 AI Agent 한계까지 | 순서 그대로, 세 쪽 밀림 |
| 30 | 36, 38 | Transformer 구조 한계 | 두 장으로 나눔(2026-11-25 사용자 요청): 33쪽 한계 1 Attention budget, 35쪽 한계 2 Context window 상한 |
| 31 | 37 | Lost in the middle | 한계 1과 한계 2 사이로 옮김(2026-11-25 사용자 요청) |
| 없음 | 39 | Context window 초과 | 새 장(2026-11-25 사용자 요청, 대화 이력과 문서가 쌓여 창을 넘고 thinking과 출력도 창을 씀) |
| 32–37 | 40–45 | Context engineering 개념부터 Agent Skills까지 | 순서 그대로, 다섯 쪽 밀림 |
| 49–50 | 46–47 | Sub-agents | Agent Skills 뒤로 앞당김(2026-11-24 사용자 승인) |
| 38–41 | 48–51 | MCP | 순서 그대로, 일곱 쪽 밀림 |
| 없음 | 52 | Hook 개념 | 새 장(2026-11-26 사용자 구성: 이전 단계 → Hook → 다음 단계, Hook이 하는 일 다섯) |
| 없음 | 53 | Hook 위치 | 새 장(2026-11-26 사용자 구성: LLM 호출 · Tool 호출 루프의 화살표 넷 모두에 hook) |
| 43 | 54 | Hook 사용 예시 → Hook 쓰임 | 2026-11-26 사용자 구성으로 다섯 범주 표(context 가공, permission · HITL, 검증 · 계속 강제, metadata 추출, 자동화)로 다시 씀 |
| 없음 | 55 | Hook 사례: Context engineering | 새 장(2026-11-25 사용자 요청, 40쪽 Context engineering 구현과 이어짐) |
| 42 | 56 | Controls | Hook 네 장 뒤로 감 |
| 없음 | 57 | Hook 사례: Control | 새 장(2026-11-25 사용자 요청). 2026-11-24에 더한 Hook 판정 구조 장은 이 장과 겹쳐 뺌 |
| 44–45 | 58–59 | Sandbox | 순서 그대로 |
| 46–48 | 60–62 | Goal Loop | 순서 그대로, 섹션 이름이 Hook · Verification으로 바뀜 |
| 51–54 | 63–65 | General-Purpose AI Agent, Evaluation | 순서 그대로, 아홉 쪽 밀림. Evaluation 방법론(구성안 53쪽)은 2026-11-26 사용자 요청으로 뺌 |

- 2026-11-26 Prompt 세 장(7~9쪽)을 넣으면서 10쪽부터 세 쪽씩 더 밀렸습니다. 위 표의 "지금" 열은 이를 반영했고, "바뀐 점"의 밀린 쪽 수는 넣기 전 기준입니다.

- 구성안의 Controls(42), Hook(43), Sandbox(44~45), Goal Loop(46~48) 네 섹션은 2026-11-24 사용자 결정으로 "Hook: Controls · Verification" 한 섹션(지금 49~59쪽)이 됐습니다.
- Hook 쓰임을 옮긴 경위: 2026-11-25에 제안한 두 안은 "46쪽(당시 쪽 번호)을 그 자리에서 쓰임별로 바꾸기"와 "그 장은 두고 섹션 앞에 Hook 쓰임 장 추가"였고, 사용자 답은 "넓혀서 작성"이었습니다. 첫 안대로 넓히면서 자리는 섹션 맨 앞으로 옮겼습니다. 쓰임 전체에서 판정(당시 판정 구조 표)으로 좁혀 가는 순서가 낫다고 본 판단이고, 이동은 따로 승인받지 않았습니다. 2026-11-25 사용자 요청으로 Hook 섹션을 개념 → 쓰임 → 사례(Context engineering)로, Controls 쪽에 사례(Control)를 두는 구성으로 다시 짰고, 판정 구조 장은 Control 사례와 겹쳐 뺐습니다. 결과 판정(Stop hook, /goal, verifier)은 Verification 장(57~59쪽)이 다룹니다. 2026-11-26에는 hook 스터디([hook-uses.md](hook-uses.md), [loop-interventions.md](loop-interventions.md))를 마친 뒤 사용자 구성으로 앞 두 장을 개념 · 위치 · 쓰임 세 장으로 나눴습니다.
- 구성안 43쪽의 "HITL hook 포함"은 지금 51쪽 Hook 쓰임의 "permission · HITL" 줄과 54쪽(Hook 사례: Control)의 "사람 승인"(PermissionRequest hook) 칸에 있습니다. 넓히기 전 "Hook 사용 예"는 PermissionRequest(사람의 승인, HITL)를 강조 카드로 두었는데, 쓰임 여덟 가지로 바꾸면서 빠졌습니다.

## 구현 방식

- 한 파일 안에 슬라이드 내용을 데이터 배열로 두고, 그림 종류별 함수가 그립니다. 내용을 고칠 때는 배열의 글자만 바꾸면 됩니다.
- 그림 종류: 관계 그래프(hub, 시안 D의 원인·핵심·대응 배치), 흐름(flow, flows), 짝(pairs), 카드, 코드, 대화, 토큰, 층(layers), 수식, 루프(타원 궤도), 시퀀스, 좌표 다이어그램(canvas), Transformer 블록, 곡선.
- 54쪽은 매트릭스 보드의 구현요소 흐름(hook 감싸는 상자 포함)을 같은 배치로 다시 그렸습니다.
- 34쪽은 Anthropic 글의 그림을 복사하지 않고 같은 비교를 다시 그렸고, 출처를 적었습니다.
- 쪽 번호 계산(2026-11-25): 목차의 쪽 범위와 본문의 쪽 참조를 장의 섹션 이름(sec)이나 제목으로 계산합니다. 목차 항목은 `[제목, 첫 섹션, 끝 섹션]`, 본문 참조는 `⟨첫|끝⟩` 꼴로 적습니다(예: 31쪽 대응 칸의 `⟨Context Engineering|Sub-agents⟩쪽` → "32–41쪽"). 장을 더하거나 옮길 때마다 목차와 대응 쪽 숫자를 손으로 고치다 틀릴 수 있어 바꿨습니다. 24쪽을 더할 때 목차와 31쪽 숫자가 따로 고치지 않아도 맞게 바뀐 것을 확인했습니다.
- 8~10쪽 제목(2026-11-25): 7쪽 LLM 한계의 세 대응임을 보이려고 처음에는 제목 위에 작은 머리표(kicker) "한계 극복 방안 1~3"을 따로 달았습니다. 사용자 요청("제목 윗줄에 따로 붙이지 말고 제목 자체를")으로 제목을 "한계 극복 1: RAG", "한계 극복 2: Chain-of-Thought", "한계 극복 3: Prompt chaining"으로 바꾸고 머리표 기능은 뺐습니다.
- 짝(pairs)의 줄마다 선 모양(2026-11-25): 줄에 `style`을 주면 그 줄 화살표만 점선이나 실선이 됩니다. 24쪽에서 대응(실선)과 원인(점선)을 한 장에 섞으려고 더했습니다. 오른쪽 노드에 `span`을 주면 그 노드가 여러 줄에 걸칩니다(격자 배치, 걸쳐진 줄은 b를 비움). 24쪽의 RAG · Tool call을 Hallucination과 지식 한계 두 줄이 함께 가리키는 노드 하나로 합치려고 더했습니다(2026-11-25 사용자 의견). span이 없는 7, 31쪽은 원래 배치 그대로입니다. 이름을 못 찾으면 "?"를 보이고 콘솔에 경고를 남깁니다.
- 한국어 줄바꿈(2026-11-25): 문서 전체를 `word-break: keep-all`로 바꿔 어절 사이에서만 줄을 바꿉니다. 16쪽 설명이 "되풀/이함"처럼 낱말 안에서 끊겨서입니다. 바꾼 뒤 56장 모두 넘침과 잘림이 없음을 확인했습니다.
- 16쪽(Tool call 반복 실패)과 18쪽(ReAct 이력 활용)은 같은 코드 상자 + 옆 알약 배치로, 같은 ALFWorld 과제의 Act-only 실패와 ReAct 성공을 보입니다. 두 궤적 모두 논문 Figure 1 원문(영어)을 그대로 옮겼습니다. 16쪽은 실패한 관찰 "Nothing happens."와 되풀이한 Act 5를, 18쪽은 Think 두 줄과 성공한 Obs 11을 포인트 색으로 칠했습니다.
- 18쪽은 처음에 검색어를 바꿔 다시 찾는 지어낸 예였으나, 2026-11-25 사용자 요청("16쪽의 예시나 논문의 것을 가져와 해결되는 것을 명확하게")으로 Figure 1 (2b) ReAct 궤적으로 바꿨습니다. 원문은 arXiv HTML판(ar5iv)의 그림을 키워 직접 읽었습니다. 원문 그대로라 "the agent go", "a apple", "......", "Drawer 1"(대문자)이 그림과 같고, Act-only 쪽은 "peppershaker 1", ReAct 쪽은 "pepper shaker 1"로 그림에서도 표기가 다릅니다. 옆 알약 셋(하위 목표로 나눔, 현재 상태 추적, 같은 과제 성공)은 논문이 Act-only 실패 이유로 든 두 가지("fails to correctly decompose goals into smaller subgoals, or loses track of the current state")에 맞춘 것입니다. 라벨과 설명 문장의 "16쪽"은 쪽 참조로 계산합니다. code 블록도 wrap 옵션(긴 줄 접기)을 받게 했습니다.
- 브라우저 창에서 1280×760으로 열어 주요 장(3, 4, 8, 12, 13, 14, 21, 29~32, 39, 41, 49, 51)을 화면으로 확인했고, 모든 장에서 넘침을 스크립트로 점검했습니다.
- 13쪽은 템플릿을 입력과 출력 두 블록으로 나눕니다(2026-11-25 사용자 요청). 입력 블록은 처음에 템플릿을 줄여 실제 도구(get_weather)와 질문을 넣은 예였으나, 같은 날 사용자 요청("실제 사용 가능한 예시 말고 호출 형식을 알려 주는 부분")으로 템플릿 중 호출 형식을 지시하는 부분을 원문 그대로 옮겼습니다. 처음에는 Li 2026 부록 E.1(ai-wiki 요청 16)의 인용을 썼으나, 사용자가 실제 chat template(Jinja)의 해당 문자열을 주어 그 원문으로 바꿨습니다. "If you choose to call a function ONLY reply in the following format with NO suffix:"부터 형식 예시, `<IMPORTANT>` Reminder 네 줄, `</IMPORTANT>`까지 22줄입니다. 원문은 빈 줄 둘, 둘째 parameter 값의 세 줄("This is the value for the second parameter" / "that can span" / "multiple lines"), 따로 된 줄의 "Reminder:", 마침표 없는 항목을 씁니다. 부록 인용은 이 줄바꿈과 마침표가 달랐습니다. 22줄을 출력 블록과 나란히 넣으려고 입력 블록만 12px로 두고, 긴 Reminder 줄은 상자 안에서 접어(접힌 줄은 2칸 들여 원래 줄과 구분) 빈 줄은 반 줄 높이로 줄였습니다(code 블록의 wrap 옵션). 아래 알약 줄은 높이가 모자라 뺐습니다. 도구 목록(`<tools>`)이 이 부분 앞에 온다는 점은 입력 라벨에, Qwen3·Qwen2.5의 JSON 형식은 출처 칸에 옮겼고, 질문 "서울 날씨 알려줘"는 출력 블록 라벨에 둡니다. 두 블록이 형식 지시와 그대로 따른 출력이 되어, 자리표시(example_function_name, example_parameter_1, value_1)가 출력의 get_weather, city, Seoul에 맞대어집니다. 출력은 처음에 `<parameter=city>Seoul</parameter>`를 한 줄로 썼으나, 템플릿의 형식 예시와 다르다는 사용자 지적(2026-11-25)으로 값 `Seoul`을 여는 태그와 닫는 태그 사이의 따로 된 줄에 두었습니다(ai-wiki 요청 16으로 원문과 같음을 확인). 두 블록을 12쪽처럼 화살표로 나란히 두려고 글자를 15px에서 14px로 줄이고(code2에 글자 크기 값을 받게 함, 12, 27쪽은 18px 그대로), 설명 알약 셋은 아래 줄로 옮겼습니다. 그 뒤 사용자 요청(2026-11-25)으로 `<IMPORTANT>` 블록(Reminder 네 줄, 앞의 빈 줄 포함 8줄)을 빼 14줄이 되었고, 줄 수가 줄어 입력 블록 글자를 출력 블록과 같은 14px로 되돌렸습니다.
- 23쪽(Agent 작업 수행)은 22쪽(Agent loop 구조)과 같은 루프 그림(loop)을 쓰고 노드 설명만 예시로 바꿉니다. 예시가 두 줄이라 루프 노드 높이를 고정 72px에서 최소 72px로 바꿨습니다. 한 줄 설명인 17, 22, 53쪽은 72px 그대로입니다(2026-11-25 확인).
- hub의 `rgroup`: 오른쪽 노드가 가운데 노드와 따로 이어지는 대상이 아니라 그 안의 단계일 때 씁니다. 단계를 회색 상자 하나로 묶고, 가운데에서 상자로 가는 화살표는 하나만 둡니다. 상자 안 단계 사이에는 짧은 아래 화살표로 순서를 표시하고, 가운데 노드 높이는 다른 hub 장과 같게 둡니다. 8쪽(RAG)과 10쪽(Prompt chaining)에 씁니다(2026-11-25 사용자 의견). hub 장 16개 중 오른쪽이 단계인 장은 이 둘뿐이고, 9쪽 CoT의 오른쪽은 특징과 효과라 그대로 둡니다.
- Script error: 주소 끝 `#번호`를 바꾸는 `history.replaceState`가 샌드박스 미리보기(origin이 null인 iframe, 예: 앱의 파일 미리보기)에서 SecurityError를 냅니다. 미리보기 쪽에서는 다른 출처의 오류라 내용 없이 "Script error"로만 보입니다. 2026-11-25에 이 호출을 try로 감싸 실패해도 넘어가게 했습니다. 샌드박스 iframe(srcdoc, allow-scripts만 허용)에 파일을 넣어 고치기 전에는 806번째 줄 오류가 나고 고친 뒤에는 오류가 없음을 확인했습니다. 샌드박스 안에서는 주소의 쪽 번호만 갱신되지 않고 넘기기와 목록은 그대로 됩니다.
- attention 그림의 `key`, `grid`(2026-11-25): 33쪽을 Attention budget과 Context window 상한 두 장으로 나누며 더했습니다. `key`로 포인트 색을 칠할 부분(Self-attention 또는 Positional encoding)을 고르고, `grid:0`이면 n×n 격자를 뺍니다. 두 한계를 한 장에 둘 때 Positional encoding 블록에 쓰던 점선 표시는 없앴습니다. 같은 날 사용자 요청으로 RoPE가 들어가는 자리에 맞춰 Positional encoding을 맨 아래 블록(지금은 Embedding)에서 Self-attention 블록 안으로 옮겼고, × N층 괄호는 층 묶음의 높이를 따라가게 바꿨습니다. 그 뒤 사용자 요청으로 Positional encoding을 Self-attention 왼쪽의 따로 된 노드로 떼어 선으로만 이었습니다(세로 흐름에는 넣지 않음). 그 자리를 만들려고 블록 너비를 330px에서 260px로 줄이고 왼쪽에 150px을 비웠으며, 설명 칸이 좁아지지 않게 그림 사이 간격(44→36px), 설명 칸 왼쪽 여백(96→80px), 격자 칸(18→16px)을 줄였습니다. 이어서 입력 토큰에서 Positional encoding으로 꺾여 올라가는 선(`.pein`, 블록 높이 50px와 연결선 14px에 맞춘 고정 크기)을 더해, 두 길이 입력 토큰에서 갈라졌다가 Self-attention에서 합쳐지게 했습니다. 그 뒤 사용자 제안으로 Positional encoding 노드를 Embedding 옆으로 내리고(Embedding을 감싼 `.emb` 기준), 입력 토큰에서 오는 선(`.pein`)과 Self-attention으로 가는 선(`.peout`)을 각각 꺾인 선으로 그렸습니다. 그 뒤 사용자 제안으로 Embedding과 Positional encoding을 한 줄에 나란히 두는 배치(`.pair`, 칸마다 위아래 세로 연결선)로 바꿔 꺾인 선과 왼쪽 여백을 없앴습니다. 블록 너비는 330px로, 그림 간격 · 설명 칸 여백 · 격자 칸은 원래 값(44px, 96px, 18px)으로 되돌렸습니다.
- 16쪽 카테고리 예(chips)는 라벨 뒤에서 줄을 바꿔 알약을 다음 줄에 둡니다(2026-11-25 사용자 요청).
- 카드의 `rows`(2026-11-26): 줄마다 카드 수를 정하고(예: `[3, 2]`) 각 줄을 가운데에 맞춥니다. 카드 폭은 가장 많은 줄에 맞춰 같게 둡니다. 51쪽 Hook 쓰임에서 윗줄 신뢰도 셋, 아랫줄 편의 · 운영 둘을 나눠 보이려고 더했습니다.
- 알약의 `prob`(2026-11-26): 문제점(한계, 원인이 된 동작, 사고 사례)에 해당하는 알약의 큰 글자를 포인트 색 굵은 글씨로 씁니다. 포인트 색으로 채운 key 알약은 그대로 둡니다. 사용자 요청으로 7, 8, 9, 10, 17(Hallucinating action), 25, 26, 30, 32, 53, 55, 58쪽의 23개에 붙였다가, 같은 날 사용자 요청으로 17쪽(실패 궤적 설명), 26쪽 오른쪽 셋(오작동 예시), 55쪽 왼쪽 둘(사고 사례)에서 빼 지금은 7, 8, 9, 10, 25, 30, 32, 53, 58쪽의 17개입니다. 38쪽 부족 · 과잉은 원칙의 양 끝이라 빼고, 57쪽 조기 종료 흐름은 key인 완료 보고가 이미 문제 지점이라 그대로 뒀습니다(Claude 판단).
- 좌표 그림(canvas) 선의 출발 · 도착 위치(2026-11-26): 변 이름 뒤에 `@비율`을 붙이면(예: `t@0.125`) 변 가운데 대신 그 위치에서 선이 나갑니다. 50쪽 Hook 위치에서 Agent loop와 LLM 호출, Tool 호출 사이에 오가는 선 두 줄을 나란히 그리려고 더했습니다. 노드 `cls:'hk'`는 작은 Hook 노드(제목 16px, 설명 12px)입니다.
- 좌표 그림(canvas) 노드의 `cls`(2026-11-26): `big`(제목 24px)과 `mid`(18px)로 글자를 키웁니다. 기본 15px은 노드가 많은 장(37, 47쪽)에 맞춘 크기라, 노드가 적은 49쪽 Hook 개념에서 씁니다.
- 루프 그림의 `hooks`(2026-11-25): 49쪽 Hook 개념에서 루프에 hook 노드를 포인트 색으로 끼웁니다. `at`이 'entry' · 'exit'면 들어오고 나가는 선 위에, 숫자 i면 노드 i와 i+1 사이 궤도 위에 둡니다. hook이 있는 구간의 방향 표시는 hook 노드에 가리지 않게 궤도를 따라 옮깁니다. 가운데 노드는 `center.key:0`으로 칠하지 않을 수 있습니다(hook 노드가 포인트이므로).
- 시퀀스(seq)의 메시지 강조(2026-11-25): 메시지 넷째 값에 `{key:1}`을 주면 그 화살표와 메서드 이름을 포인트 색으로 칠합니다. 강조가 있으면 서버 머리 노드는 칠하지 않아 포인트가 한 곳에만 있게 합니다. 48쪽 tools/list 요청과 결과에 씁니다.
## 구성안에서 바꾼 것

| 쪽 | 구성안 | 슬라이드 | 이유 |
|---|---|---|---|
| 1 | 부제 없음 | "LLM에서 범용 에이전트까지" | 시안 D의 부제 자리. 자리표시로 둔 제안 |
| 3 | 층 이름 없음(L1, L2) | L1 기본 구성, L2 확장 구성 | 층마다 이름을 붙임. L2는 처음에 "실사용 보강"이었으나 2026-11-25 사용자 의견으로 "확장 구성"으로 바꿈 |
| 7 | 지능 한계 | 추론 한계(다단계 추론), 원인 칸은 복잡한 작업 | "지능"은 범위가 넓어 CoT가 대응하는 한계로 좁힘. 기존 기준의 "다단계 추론"과 맞춤. 원인 칸은 처음에 "중간 단계 없는 생성"이었으나, 2026-11-25 사용자 의견으로 당시 10쪽 Prompt chaining의 왼쪽 노드와 같은 "복잡한 작업(여러 단계를 한 번에 처리)"으로 바꿈. 같은 날 8~10쪽에 "한계 극복 방안 1~3"을 단 뒤, 사용자 지적으로 10쪽 왼쪽 노드를 원인(복잡한 작업)이 아닌 한계(추론 한계, 칸 이름 "한계")로 고쳐 8~10쪽의 왼쪽이 모두 7쪽 오른쪽의 한계가 되게 함. 추론 한계 하나에 CoT(9쪽)와 Prompt chaining(10쪽) 두 방안이 대응하고, 24쪽 LLM 한계 극복 현황의 "CoT · Prompt chaining으로 일부 대응"과도 맞음 |
| 8–10 | "LLM 개선방향: 지식 보강(RAG)", "깊은 추론(CoT)", "작은 단위로 분해(prompt chaining)" | 제목 "한계 극복 1: RAG", "한계 극복 2: Chain-of-Thought", "한계 극복 3: Prompt chaining" | 2026-11-25 사용자 요청. 구성안의 "개선방향"을 7쪽 한계와 잇는 번호로 다시 살림. 처음 제목은 RAG 지식 보강, Chain-of-Thought 추론, Prompt chaining 분해였고, 제목 위 머리표를 거쳐 제목 자체로 바꿈 |
| 10과 11 사이 | 없음 | 새 11쪽 질의 기반 RAG(흐름): 질문 → Retriever(질문으로 한 번 검색, 포인트 색) → 상위 k개 문서(벡터 색인에서 질문과 가까운 문서) → LLM(질문 + 문서로 생성) → 답변 | 2026-11-25 사용자 제안. 처음에는 일반 RAG와 동적 검색 다섯 가지(생성 중 검색, 검색 판단 토큰, 추론과 번갈아 검색, 도구 호출 검색, Agentic search)를 비교한 표 "RAG 검색 방식"이었고 ai-wiki 요청 17로 확인까지 마쳤으나, 같은 날 사용자 요청으로 질의 기반 RAG만 간단히 남김. 동적 검색 사례와 근거는 presentation-fact-checks.md의 요청 17에 기록으로 둠. 설명 문장 "무엇을 언제 찾을지는 프로그램이 정함"은 모델이 검색 명령을 내는 다음 장 WebGPT와 대비하려는 것. 흐름은 Lewis 2020(입력 x로 상위 K개 문서, DPR 검색기)을 따름. table의 widths, compact 옵션은 그때 더한 채로 남김 |
| 22와 23 사이 | 없음 | 새 24쪽 LLM 한계 극복 현황: Hallucination과 지식 한계 → RAG · Tool call(실선, 대응, 두 줄에 걸친 노드 하나), 추론 한계 → 복잡한 작업 오작동(점선, 원인, 포인트 색) | 2026-11-25 사용자 요청: 두 한계가 RAG와 Tool call로 극복됐음을 보이고 복잡한 작업 오작동 장으로 매끄럽게 이음. "극복"은 제목에만 쓰고, 칸에는 8쪽 설명("환각을 줄이지만 없애지는 못함")과 맞춰 "줄임", "보충"으로 씀. 추론 한계는 CoT와 Prompt chaining으로 일부 대응했지만 에이전트의 긴 작업에서 다시 드러나는 것으로 적어, 뒤의 Prompt chaining 재검토와 CoT 장과 어긋나지 않게 함. 같은 날 사용자 요청으로 환각이 부분 해소임을 밝힘: Hallucination 칸 설명을 "사실과 다른 내용을 생성"에서 "부분 해소: 줄었지만 남아 있음"으로 바꾸고(추론 한계 칸의 "일부 대응"처럼 칸 설명에 현황을 적음), 설명 문장을 "환각과 지식 한계는 RAG와 Tool call로 대응했고, …"에서 "환각은 부분 해소, 지식 한계는 보충: 남은 추론 한계는 복잡한 작업에서 오작동으로 드러남"으로 고침 |
| 17 | 자기 행동의 이력을 보며 동작을 수정 | ReAct 논문 Figure 1 (2b)의 ALFWorld 궤적(16쪽과 같은 과제를 Think로 풀어 성공) | 2026-11-25 사용자 요청: 16쪽 실패가 ReAct로 해결되는 것을 같은 과제로 보임. 처음에는 검색어를 바꿔 다시 찾는 지어낸 예였음 |
| 22 | 작업을 수행하는 에이전트의 탄생 | 21쪽과 같은 루프에 예시: 사용자 입력 "README에 설치 방법 추가해줘", ① read_file 요청 ② README.md 읽기 ③ 파일 내용 ④ edit_file 요청 ⑤ 설치 방법 절 추가 ⑥ 수정 완료 ⑦ 도구 호출 없이 답 | 2026-11-25 사용자 요청. 처음에는 사용자 입력 → Agent loop → 작업 결과 흐름이었음. 번호는 처음에 LLM 호출 차례(①, ②, ③)로 매겨 한 번호가 노드 세 곳에 나왔으나, 같은 날 사용자 요청으로 단계마다 ①~⑦을 하나씩 매김. 루프가 여러 번 도는 것을 보이려고 도구를 두 번 쓰는 작업을 골랐고, 도구를 한 번 쓰는 날씨 예시는 14쪽 Tool call 실행과 겹쳐 쓰지 않음 |
| 15와 16 사이 | 없음 | 새 16쪽 Tool call 반복 실패: ReAct 논문 Figure 1의 ALFWorld Act-only 궤적. 없는 물건을 집는 같은 행동이 두 번 "Nothing happens."로 실패. 옆에 Act-only 뜻, 같은 호출 반복, ALFWorld 성공률 | 2026-11-25 사용자 요청: ReAct 바로 앞에 도구 호출이 계속 실패하는 사례를 두고 ReAct로 가는 근거로 씀. 논문이 ReAct의 비교 대상(Act-only)으로 직접 보인 실패라 근거로 바로 이어짐. HotpotQA 예(검색 실패 뒤 틀린 답)보다 "같은 호출 반복"이 뚜렷해 ALFWorld 예를 고름. ai-wiki 요청 15로 흐름, 수치, 실패 이유를 확인(강)하고, 위키로 못 본 번호와 과제 문장 구두점은 사용자 승인으로 원문 그림(ar5iv)에서 확인해 "확인 중"을 지움 |
| 25 | Planning: CoT 프롬프트 예시 | Kojima 2022 Figure 1의 저글러 문제로 CoT 미적용과 적용을 비교: 같은 질문에 "A: The answer (arabic numerals) is" → 8 ✗, "A: Let's think step by step." → 풀이 뒤 4 ✓. 아래 줄에 수학 밖 과제의 Zero-shot → Zero-shot-CoT 정확도(Last Letter 0.2% → 57.6%, Coin Flip 12.8% → 91.4%, Date 49.3% → 67.5%) | 2026-11-25 사용자 요청(지금 28쪽). 처음 예시(책 15권 문제)는 지어낸 것이었음. ai-wiki 요청 19~21로 후보를 찾아 한때 Last Letter의 성공(ynln ✓)과 실패(tkaea ✗)를 실었으나, 둘 다 CoT를 적용한 출력이라 CoT 적용 · 미적용 비교가 안 된다는 사용자 지적으로 바꿈. 수학 밖 과제에서 미적용 출력과 적용 출력을 원문으로 나란히 보인 예시는 두 논문에 없어서, 출력 비교는 원문 그림이 있는 저글러 문제(수학)로 하고, 수학 밖 과제는 정확도 수치로 보탬. Last Letter 성공 · 실패 예시는 presentation-fact-checks.md 요청 21에 남김. 입력 하나에 출력 여럿과 아래 알약 줄을 그리는 codefan을 씀. 같은 날 사용자 요청으로 설명 문장 끝을 "오답이 정답으로 바뀜"에서 "정답률이 개선됨"으로 바꿈 |
| 27 | Planning: Plan mode, Tasks 등 예시 | (지금 30쪽) 오른쪽 셋을 묶음 상자로: "실행 전: Plan mode" → "실행 중: Tasks" → "실행 중: 계획 갱신", 계획 갱신에서 Tasks로 되돌아가는 "반복" 화살표 | 2026-11-25 사용자 질문("오른쪽 노드도 순서대로 실행되는 항목처럼 보인다")에 답하고 다시 그림. Plan mode만 실행 전에 한 번이고, Tasks와 계획 갱신은 실행 중에 함께 되풀이되는 관계라 가운데에서 세 칸으로 따로 나가던 화살표가 관계를 잘못 보였음. hub에 묶음 상자 안 반복 화살표(rloop, 그린 뒤 위치를 재는 drawLoops)를 더함 |
| 28 | Primitive AI Agent: LLM + Tool Use + Memory + Agent Loop + Planning | (지금 31쪽) Planning과 그 앞의 +를 흐리게(점선 테두리) 두고, 설명은 "LLM, Tool Use, Memory, Agent Loop가 기본"(Planning은 말로 언급하지 않음, 사용자 요청). 같은 날 사용자 요청으로 식 아래에 사례 둘을 날짜와 함께 붙임: "예: AutoGPT (2023-03)"(검색 · 파일 · 코드 실행, 단기 · 장기 기억, 사람 개입 없이 반복)와 점선 테두리의 "Devin (2024-03): Planning 포함"(셸 · 에디터 · 브라우저로 계획을 세워 끝까지 작업). 근거는 presentation-fact-checks.md 요청 23(출시 당시 기능 기준) | 2026-11-25 사용자 의견: Planning은 꼭 필요한 구성요소가 아님. 3쪽에서 Planning을 L2(확장 구성)에 둔 것과도 맞음. equation에 흐리게 표시(dim)를 더함 |
| 29 | AI Agent 문제점: context window limit, stops before the task is done, non-deterministic behavior | (지금 32쪽) 세 줄을 Context window 한계 → Context engineering, 비결정론적 동작 → Controls, 조기 종료 → Goal loop · Verification 순서로 둠 | 2026-11-25 사용자 요청: "비결정성"을 "비결정론적"으로 바꾸고 조기 종료를 마지막 줄로 옮김. 처음에는 구성안 순서(Context window 한계, 조기 종료, 비결정성)를 따랐음. 옮긴 뒤에는 줄 순서가 대응 장의 순서(Controls 49~52쪽, Verification 53~55쪽)와 같음. 50쪽 Controls 개념의 왼쪽 노드도 같은 말로 바꿈. 아래 검토 의견 2의 "비결정성"은 그때 표현이라 그대로 둠. 같은 날 사용자 요청으로 첫 줄 대응 칸을 "Context engineering · Skills · Sub-agents"에서 "Context engineering"으로 줄임. 쪽 표시는 Skills와 Sub-agents 장까지 포함한 33~43쪽 그대로 둠(41쪽이 Skill의 역할 하나를 context engineering으로 설명하고, Sub-agents도 context를 나누는 방법이라서). Context Engineering 섹션(33~39쪽)만 가리키게 좁히는 안도 물었으나 사용자가 그대로 두기로 정함. 이어서 사용자 요청으로 "비결정론적"을 "비결정론적 동작"으로 바꾸고 Controls 개념(지금 51쪽)의 왼쪽 노드도 맞춤 |
| 30 | transformer 모델의 구조적인 한계(어느 부분인지 명시) | 두 한계로 정리: "Attention budget → 품질 저하"(Self-attention, 토큰이 늘수록 주의가 n²쌍에 얇게 퍼져 필요한 정보를 놓치고 중간 위치에서 특히 심함, 다음 장 Lost in the middle)와 "학습 길이 → Context window 상한"(Positional encoding(RoPE), 학습한 길이를 넘는 위치에서 attention이 무너지고 RoPE 조정 · YaRN과 추가 학습으로 늘림, 예 256K → 1M). KV cache와 prefill은 아래 "사용 단계 비용" 한 줄 | 2026-11-25 사용자 의견(지금 33쪽). 처음에는 O(n²), 학습 길이를 넘는 위치, KV cache, attention budget 네 칸이었음. ai-wiki 요청 18 조사와 이어진 질문에서 "창의 상한은 학습한 길이와 위치 표현이 정하고, KV cache와 prefill은 사용 단계 비용"으로 정리한 것에 맞춤. 학습 하드웨어는 큰 회사에 걸림돌이 아니라는 사용자 판단을 따름. 단 긴 문서 데이터가 드문 문제는 "학습 길이" 안에 들어감. 같은 날 사용자 요청으로 두 장으로 나눔: 33쪽에는 Attention budget만 두고(Self-attention 강조, n×n 격자), 바로 뒤 새 34쪽 "Context window 상한"에 학습 길이 → Context window 상한과 사용 단계 비용 한 줄을 옮김(Positional encoding 블록을 포인트 색으로, 격자는 뺌). 33쪽 설명의 "(다음 장)"도 사용자 요청으로 뺌(새 장이 끼어 다음 장이 Lost in the middle이 아님). 설명 문장과 출처도 두 장에 나눔. 이어서 사용자 요청으로 순서를 한계 1(33쪽, 제목 "Transformer 구조 한계 1: Attention budget") → Lost in the middle(34쪽) → 한계 2(35쪽, "Transformer 구조 한계 2: Context window 상한") → Context window 초과(36쪽)로 바꿈. 두 그림 모두 RoPE가 들어가는 자리를 반영해 맨 아래 블록을 "Embedding"으로 두고 "Positional encoding (RoPE)"를 Self-attention 블록 안에 표시함(RoPE는 입력에 더하지 않고 층마다 attention 안에서 query · key에 적용). 한계 1은 Self-attention 블록을, 한계 2는 그 안의 Positional encoding (RoPE)를 포인트 색으로 칠하고, 35쪽 설명에 "층마다 Q · K를 위치에 따라 회전"을 더함. ai-wiki 요청 24 답으로 확인하고(Q · K 회전은 강, 입력 쪽 위치 embedding 없음과 층마다 적용은 중) "확인 중"을 지움. 그 답으로 35쪽 첫 줄의 "층마다"를 "attention 안에서"로 바꾸고, "YaRN과 추가 학습으로 늘림 (예: 256K → 1M)"을 "RoPE 조정(YaRN 등)으로 늘림: 방법에 따라 짧은 추가 학습"과 "예: Qwen3.8-Flash-Next는 256K로 학습, YaRN ×4 설정으로 1M"으로 고침(그 예는 추가 학습 없이 설정으로 늘림). 알약 표기는 사용자 의견으로 "Positional encoding"으로 줄임. 이어서 사용자 요청으로 Positional encoding을 Self-attention 블록 밖 옆 노드로 떼어 선으로만 잇고(Self-attention 안에 두는 것이 애매하고, Positional encoding과 Q · K의 세부 계산은 발표에서 다루지 않음), 35쪽 설명에서 RoPE와 Q · K 언급을, 출처 칸에서 예외 각주를 빼 "Positional encoding"으로만 적음. 설명 문장의 "위치 표현"도 "Positional encoding"으로 바꿈. 이어서 사용자 제안으로 입력 토큰에서 Positional encoding으로 가는 선을 더해, 입력 토큰에서 갈라진 두 길(입력 토큰 → Embedding → Self-attention, 입력 토큰 → Positional encoding → Self-attention)이 Self-attention에서 합쳐지게 함. 옆에 떼어 두기만 하면 위치 정보도 입력 토큰에서 온다는 연결이 끊겨 보였음. 그 뒤 사용자 제안으로 Positional encoding 노드를 Embedding 옆(같은 높이)으로 내림. Positional encoding에서 나온 선은 Embedding을 거치지 않고 Self-attention 옆으로 들어가, embedding에 더하는 것으로 읽히지 않음. 이어서 사용자 제안으로 Embedding 너비를 줄여 Positional encoding과 나란히 두고(두 노드가 Self-attention 아래 너비를 반씩 차지), 입력 토큰에서 두 노드로, 두 노드에서 Self-attention으로 세로 선으로만 이어 옆으로 빠지는 선을 없앰 |
| 30과 31 사이 | 없음 | 새 34쪽 Context window 초과(막대 개념도): 1턴 · 10턴 · 30턴마다 System prompt · Tools, 문서, 대화 이력 · Tool 결과, Thinking, Output이 쌓이고, 30턴에서 입력이 한도 근처까지 차 있는 상태에서 Thinking과 Output이 한도를 넘음(넘는 부분은 포인트 색). 아래 줄에 "입력 + Thinking + Output ≤ Context window" | 2026-11-25 사용자 요청: 대화 이력과 문서가 쌓여 창을 넘는 모습과, thinking budget과 출력도 창의 토큰을 쓴다는 점. 비율은 예시라 "개념도"로 표시. 막대를 그리는 ctxbars를 더함. ai-wiki 요청 22로 확인한 뒤 "확인 중"을 지우고 근거 알약 셋(Thinking은 max_tokens에 포함, 도구 정의만 약 55K, 넘으면 compaction 또는 "Prompt is too long")을 더함. 이어서 사용자 요청으로 맨 위에 토큰 생성 되짚기 띠를 넣음: 4쪽 예시(대한민국 의 수도 는 + 앞서 생성한 "서울")가 LLM에 들어가 "입니다"를 만들고, 점선 화살표로 그 토큰이 입력 끝에 다시 붙는 모습. 출력 토큰도 다음 입력이 되어 창을 차지한다는 근거를 그림으로 보이고, 같은 말을 하던 식("입력 + Thinking + Output ≤ Context window")은 자리가 모자라 뺌. 되돌림 화살표는 그린 뒤 위치를 재서 그림(drawGenBack). 그 뒤 사용자 요청으로 아래 근거 알약 셋을 빼고 막대를 다시 키움. 근거는 presentation-fact-checks-transformer.md 요청 22에 남기고, 출처 칸에는 설명 문장의 thinking 근거(Osmani 2026)만 둠. 같은 날 사용자 요청으로 1턴과 10턴 막대를 줄여(한도 100 기준 합계 46 → 32, 80 → 64, 문서와 대화 이력 몫을 줄이고 System prompt · Thinking · Output은 그대로) 턴마다 쌓이는 모습이 더 드러나게 함. 30턴(110)은 그대로. 이어서 사용자 요청으로 더 줄여 1턴 23, 10턴 48로 함. System prompt · Tools를 모든 턴에서 10 → 6으로 줄이고, 30턴은 문서와 대화 이력을 2씩 늘려(28, 62) 합계 110과 넘치는 모양(Thinking 일부와 Output)을 그대로 둠 |
| 32 | Anthropic Context Engineering 도표 | 오른쪽 후보에 Agent Skills를 더해 System instructions, Tools, MCP, Agent Skills, 외부 데이터, Message history 여섯 칸 | 2026-11-25 사용자 요청(지금 35쪽). Agent Skills도 필요할 때 context에 들어오는 정보라 선별 대상에 넣음. 원 글(2025-09)의 목록에는 없어 출처 칸에 "Agent Skills는 발표자가 더함"을 적음. 여섯 칸이 들어가도록 칸 높이를 44px에서 40px로 줄임 |
| 35 | Context Engineering 구현: hook/callback/plugin 등 | (지금 40쪽) Transcript(메시지 · 도구 결과를 쌓은 기록), Tool call(필요할 때 불러옴, Skill · MCP 포함), Hook(정해진 지점에서 context 수정), Compaction(오래된 기록을 요약으로 교체). 설명 "transcript를 바탕으로 매 턴 context를 조립하고, tool call로 필요할 때 불러오고, hook으로 더하거나 고치고, compaction으로 줄임"(처음 문장 "transcript에서 매 턴 context를 조립하고…"는 transcript가 조립하는 것처럼 읽힌다는 사용자 지적으로 "바탕으로"로 고침. 한때 주어 "하니스가"를 붙였다가 사용자 요청으로 뺌), 출처 칸은 Hook 예(Pi context, opencode session.context, OpenClaw before_prompt_build) | 2026-11-25 사용자 의견: 전에는 Hook, Middleware · Callback, Plugin, Compaction 네 칸이었으나, 앞의 셋은 모두 정해진 지점에 코드를 끼우는 같은 개념으로 보임. 셋을 Hook 하나로 묶고, 매 턴 context를 조립하는 원본인 Transcript를 더함. 칸 설명이 두 줄로 넘쳐 한 줄로 줄이고, 자세한 설명은 아래 문장으로 옮김. 이어서 사용자 의견(Skill 사용도 결국 tool 호출로 진행됨)으로 Tool call 칸을 더해 넷이 됨. 필요한 정보를 그때 도구로 불러오는 방식이고 Skill과 MCP 도구도 여기에 들어감. Skills와 MCP를 40쪽에 따로 적지는 않음(37쪽 선별 대상에 이미 있고, 40쪽은 context를 만들고 고치고 줄이는 방법을 모은 장) |
| 37 | SKILLS.md | SKILL.md | 실제 파일 이름 |
| 39, 50 | 컨택스트 | 컨텍스트, context | 표기 통일 |
| 13 | Qwen3 계열 템플릿 | Qwen3.5 기본 tool call 템플릿(요약), Qwen3·2.5의 JSON 형식은 아래에 표시 | 위키에서 원문이 확인된 것은 Qwen3.5 템플릿뿐. 호출 형식은 JSON이 아니라 `<function=…><parameter=…>` 중첩 |
| 41 | health check | ping | MCP에서 연결 확인에 쓰는 메시지 이름(위키에 없어 확인 못 함) |
| 42–43 | Controls, Hook 사용 예시(HITL hook 포함) | (지금 49~53쪽) Hook 개념: 23쪽 Agent loop 구조와 같은 루프 그림에 hook 노드 다섯(턴 시작, 도구 호출 전 · 후, LLM 호출 전, 멈추기 전)을 포인트 색으로 끼움. Hook 쓰임. Hook 사례: Context engineering(State, Context 가공, Tool result 변환, Compaction). Controls 개념. Hook 사례: Control(위험 명령 차단, 편집 범위 제한, 작업 규칙 강제, 사람 승인) | 2026-11-25 사용자 요청: Hook 개념과 쓰임을 두 장으로 하고, context engineering 관점의 사례와 Controls 쪽 hook 사례를 더함. 검토안에는 판정 구조 표를 옮겨 두는 안이 있었으나, Control 사례와 많이 겹친다는 사용자 지적으로 뺌. Hook 개념은 사용자 요청대로 루프 그림에 hook 노드만 끼운 간단한 그림. 사례는 모두 hook-points.md에서 근거가 강인 것만 씀(중인 기억 주입, 출력 압축, context 사용량 경고는 뺌). 이어서 2026-11-26 hook 스터디(hook-uses.md, loop-interventions.md) 뒤 사용자 구성으로 앞 두 장을 셋으로 나눔: 49쪽 Hook 개념(이전 단계 → Hook → 다음 단계, 점선으로 이은 상자에 하는 일 다섯: context 가공, permission · HITL, 검증 · 계속 강제, metadata 추출, 자동화 등), 50쪽 Hook 위치(처음에는 LLM 호출 · Tool 호출 두 노드의 루프에 화살표 넷. 같은 날 사용자 지적(LLM 호출 전후 hook 자리가 안 보임)으로 가운데에 Agent loop를 두고 위에 LLM 호출, 아래에 Tool 호출, 왼쪽에 사용자 입력, 오른쪽에 답변을 둔 그림으로 바꿈. 화살표 여섯(턴 시작, LLM 호출 전 · 후, 도구 호출 전 · 후, 멈추기 전)에 모두 hook. 가운데 이름은 사용자 후보 reasoning, agent loop, Agent engine 중 Agent loop로 정함: reasoning은 LLM 호출 안에서 일어나는 일이라 헷갈리고, Agent engine은 통용 용어가 아니며, Agent loop는 23쪽과 같은 이름), 51쪽 Hook 쓰임(다섯 범주 × 사례 · 위치 표, 위 셋은 신뢰도 · 아래 둘은 편의 · 운영). "검증 · 계속 강제"는 사용자가 적은 네 범주에 Claude가 더함(Verification 장과 잇기 위해). 같은 날 사용자 요청으로 51쪽 범주를 49쪽 항목보다 한 단계 추상화해 Context, 통제, 검증, 유틸리티, 자동화로 바꿈. 유틸리티에는 감사 로그, 비용 · 토큰 기록, 알림을, 자동화에는 편집 뒤 Prettier · lint, 세션 시작의 공유 skill 저장소 갱신을 둠. 설명 문장에 위 셋이 이어지는 장(Context engineering · Controls · Verification)을 적음. 이어서 사용자 요청으로 표를 카드 상자로 되돌림: 윗줄에 신뢰도 셋(Context, 통제, 검증), 아랫줄 가운데에 편의 · 운영 둘(유틸리티, 자동화). 뒤에 사례 장이 있는 Context와 통제를 포인트 색으로 칠함(포인트를 둘로 둔 것은 사용자 요청). 카드에는 사례 두 줄만 두고 위치 칸은 뺌. 같은 날 사용자 요청으로 52쪽 사례 카드를 context 넣기 · 조립 · 도구 결과 변환 · compaction 보완에서 State(task 진척 · 브랜치 상태), Context 가공, Tool result 변환, Compaction으로 다시 정리. 순서는 사용자가 적은 순서(context 가공, compaction, state, tool result) 대신 hook이 도는 순서(턴마다 → LLM 호출 직전 → 도구 호출 뒤 → compaction)로 놓아 50쪽 Hook 위치와 맞춤(Claude 판단). 포인트는 51쪽 Context 카드의 첫 사례(브랜치 상태 주입)와 이어지는 State. State 사례는 Claude Code UserPromptSubmit 브랜치 상태 주입(문서, 강)과 opencode가 context hook으로 넣는 goal · plan 알림(hook-uses.md, 강). 첫 카드 이름은 "Context 가공" 그대로 둠: 49쪽에서 같은 말이 hook의 context 쓰임 전체를 가리켜 52쪽 네 카드의 상위 개념과 겹치므로 Claude가 "Messages 가공"으로 좁히는 안을 권했으나, 앞에서 설명한 Context engineering과 이어진다는 이유로 사용자가 그대로 두기로 정함. 같은 날 사용자 요청으로 54쪽 설명 문장을 "꼭 지킬 규칙은 skill이 아니라 hook으로 강제"에서 "instruction이 아니라 hook으로 강제"로 바꿈. hook-uses.md 3.1절의 근거(Claude Code 문서: CLAUDE.md와 skill의 지시는 요청이지 보장이 아니고, 매번 지켜야 하면 "make it a hook rather than a prompt instruction")와도 맞음. 문장이 길어져 콜론 뒤에서 줄을 나눔 |
| 44 | 사고 사례(OpenClaw 등) | Replit 운영 DB 삭제, 이메일 200통 이상 삭제 | 위키에 있는 사례만 씀. OpenClaw 사고는 위키에 없음 |
| 48 | explore-plan-act-verify | 노드 이름은 두고 아랫줄에 Claude Code 문서의 표현(gather context, take action, verify results) | 정확한 문구의 출처가 위키에 없음 |
| 49 | 분산화 예: handoff | 분산화 · 협업형(swarm) | 출처(Building Effective AI Agents 2025)의 분류. handoff를 분산형으로 묶은 서술은 위키에 없음 |

## 검토 의견 (해석)

1. 3쪽의 L2 네 칸과 뒤 섹션이 바로 이어지지 않습니다. Planning(23~27), Control(42~45), Evaluation(53~54)은 섹션이 있지만 Verification은 Goal Loop(46~48) 안에만 나옵니다. Goal Loop 섹션 이름에 Verification을 붙이면 L2가 모두 목차에 드러납니다.
2. 29쪽의 세 한계와 대응이 흩어져 있습니다. Context window 한계는 Context Engineering(30~35), Agent Skills(36~37), Sub-agents(49~50)가, 조기 종료는 Goal Loop가, 비결정성은 Controls가 대응합니다. Sub-agents의 주된 목적이 context 분리이므로 Agent Skills 뒤로 옮기면 한계와 대응의 순서가 맞습니다. 2026-11-24 사용자 승인으로 반영했습니다.
3. MCP(38~41)는 세 한계의 대응이 아니라 Tool use의 표준화입니다. 지금 자리도 괜찮지만, 슬라이드에서 Tool Use(11~15)로 이어진다는 점을 한 줄 말해 두면 흐름이 끊기지 않습니다.
4. 3쪽은 Planning을 L2에 둡니다. 이전 개념 장 검토에서는 Planning을 윗줄에 두었지만, 이 발표는 Planning을 Agent loop 뒤의 확장으로 설명하므로 3쪽 배치가 발표 흐름과 맞습니다([agent-components-concept.md](agent-components-concept.md)).
5. 19쪽의 내부 메모리는 매트릭스의 세션 저장(transcript)과 같은 것을 가리킵니다. Persistence를 Memory에 합친 결정과 맞습니다.

## 사실 확인 기록

사실 확인 결과는 두 문서에 있습니다. Context window와 Transformer 구조(ai-wiki 요청 18, 22, 24, 25)는 [presentation-fact-checks-transformer.md](presentation-fact-checks-transformer.md)에, 나머지(ai-wiki 요청 11, 15~17, 19~21, 23과 analysis-docs의 MCP 스펙 확인)는 [presentation-fact-checks.md](presentation-fact-checks.md)에 있습니다. 2026-11-25에 이 문서가 300줄에 가까워져 사실 확인 기록을 따로 뺐고, 같은 날 그 문서도 300줄을 넘게 되어 다시 주제별로 나눴습니다.

## 검토: Verification을 hook으로 합칠지

[verification-hook-review.md](verification-hook-review.md)로 옮겼습니다(2026-11-26).

## 변경 이력

- 2026-11-26: 사용자 결정으로 발표 제목을 "AI Agent: 구성과 구현"에서 "AI Agent 구성요소"로 바꿈(후보 다섯 중 1번: 3쪽 구성요소로 시작해 66쪽 AI Agent Overview로 끝나는 구조와 맞음. 다른 후보는 AI Agent의 발전과 구성요소, AI Agent: 한계와 대응, LLM에서 AI Agent까지, AI Agent 구조와 구현). 부제는 그대로. 표지의 발표자와 날짜 자리를 채움. 브라우저 탭 제목도 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 66쪽 제목을 "AI Agent 정리"에서 "AI Agent Overview"로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 66쪽 설명 문장을 빼고 그림을 최대한 넓힘(아래 꼬리말 영역을 없애는 nofoot 옵션, 그림 확대 zoom 1.08, 세로 간격 1.08배, 범례는 그림 왼쪽 아래로). 노드 색을 덱 색에 맞춤: 단계 · hook 네모는 포인트 색의 옅은 색, 사용자 입력 · 최종 응답은 따뜻한 회색, 완료는 흰색, External Memory · Transcript는 짙은 회갈색. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자가 보드를 더 고친 최신본으로 66쪽을 다시 그림. Controls 상자를 AI Agent 안으로 줄이고 기능 알약 넷(Permission, Verification, Context Control, Goal loop)을 hook 네모 왼쪽에 둠. 보드의 색을 옅게 옮김(단계 · hook 네모는 복숭아색, 사용자 입력 · 최종 응답은 초록, 완료는 파랑, External Memory · Transcript는 보라). 좌표 그림 노드에 배경색(bg) 옵션을 더함. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자가 확정한 화이트보드 정리 그림을 66쪽에 그대로 옮김(배치 · 이름 · 선 방향 · 모양 유지, 슬라이드 크기에 맞춰 줄임). 좌표 그림에 작은 노드(sm), 네모(rc), 타원(ov), 마름모(dia), 원통(db) 모양과 작은 상자 이름(sm)을 더함. 확정 전 검토에서 짚은 두 가지(도구 결과가 Context 구성을 건너뜀, Controls 상자가 AI Agent 경계를 넘음)는 사용자 결정으로 그대로 둠. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 7쪽 설명 문장을 앞부분 "가중치를 바꾸지 않고 prompt만으로 과제를 정함"만 남김. 사용자가 7쪽 구성(In-context learning, few-shot · zero-shot)을 그대로 쓰기로 함. 아티팩트 링크에 다시 올림
- 2026-11-26: ai-wiki 요청 29 답으로 7쪽을 고침. GPT-3 정의상 지시만 주는 zero-shot도 in-context learning이라, "ICL = 예시, Instruction following = 지시" 대비가 원문과 어긋남. 수정안 A(제목 In-context learning, 두 열을 예시로 보여 주기 few-shot · 지시로 시키기 zero-shot)를 택하고, instruction following은 지시 쪽 각주(instruction tuning · RLHF로 크게 강화, 규모만으로는 부족)로 둠. 각주 B안(제목 유지 + 각주)은 두 개념의 층위가 달라 덜 깔끔하다고 보고 쓰지 않음. "나타남"은 emergent 논쟁을 피해 "커질수록 강해짐"으로. '확인 중'을 지움. 이 문서가 300줄에 가까워 Verification · hook 검토 절을 verification-hook-review.md로 옮김
- 2026-11-26: 사용자 요청(in-context learning과 instruction following을 함께 설명)으로 7쪽 In-context learning과 Instruction following을 Prompt 구성 앞에 넣어 66쪽이 됨. 같은 번역 과제를 예시와 지시로 나란히 보이는 duo 그림을 더하고, 15쪽 JSON 출력의 두 알약에 이 장 쪽 번호를 붙임. 자리는 Prompt 구성(chat template, instruction tuning 출처) 앞: 두 능력이 먼저 있고 prompt 구성과 기법이 그 위에 선다는 순서. ai-wiki 요청 29로 확인 중
- 2026-11-26: ai-wiki 요청 28 답으로 7쪽 출처를 FLAN과 InstructGPT로 고치고 Qwen3 thinking 토큰 주석을 붙임. 8쪽 설명 문장을 "모델 가중치를 바꾸지 않고 입력(지시 · 예시 · 형식)만 설계해 원하는 출력을 얻는 일"로, 출처를 Weng 2023 · Anthropic context engineering 글 · Brown 2020으로 바꿈. 두 장의 '확인 중'을 지움
- 2026-11-26: 사용자 요청으로 6쪽 뒤에 7쪽 LLM Prompt 구성(Messages → Chat template → 토큰 열 → LLM 흐름과 ChatML 예시 토큰 열)과 8쪽 Prompt engineering(역할 지정, 명확한 지시, 예시 few-shot, 출력 형식 카드)을 넣어 65쪽이 됨. 처음 제안(6쪽 뒤 한 장)에 사용자가 두 장 안을 고름. 코드 글꼴의 합자(<| |>가 삼각형으로 보임)를 끔. ai-wiki 요청 28로 사실 확인 중이라 두 장에 '확인 중' 표시. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 제안(완성된 에이전트 그림 둘레에 기능과 사례를 배치)으로 63쪽 AI Agent 정리를 더함. 가운데는 50쪽과 같은 Agent loop · LLM 호출 · Tool 호출 루프(Memory · Planning은 Agent loop 설명으로), 왼쪽 위 Context engineering(Skills, MCP, Sub-agents, Compaction), 왼쪽 아래 Controls(Permission, Sandbox, Hook), 오른쪽 위 Verification · Evaluation(Goal loop, Verifier agent, Evaluation), 오른쪽 아래 사례(개발, 디자인, 데이터 분석, 연구). 상자와 루프는 점선(실행 순서가 아닌 관계)으로 잇고 목차에 정리를 더함. Claude가 앞서 낸 두 단계 한계 → 대응 안과 3쪽 구성요소로 돌아가는 안은 쓰지 않음. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 58~61쪽 설명 문장을 고치고(58쪽 /goal 설명 앞부분 삭제, 59쪽 verifier agent의 판단, 60쪽 범용 에이전트 개요 한 문장, 61쪽 도구 · skill · hook으로 응용), 62쪽 Evaluation 방법론을 빼 62쪽이 됨. 59 · 60쪽 문장은 한 줄에 들어가게 줄임. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 17쪽 Hallucinating action, 26쪽 오른쪽 셋, 55쪽 왼쪽 둘에서 문제점 강조색을 뺌(17개 남음). 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 문제점 알약 23개(7~10, 17, 25, 26, 30, 32, 53, 55, 58쪽)의 큰 글자를 포인트 색으로 바꿈(`prob` 옵션). 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 27쪽 제목을 "Prompt chaining 재검토"에서 "Prompt chaining 다시 보기"로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 54쪽 설명 문장의 "skill이 아니라"를 "instruction이 아니라"로 바꾸고 콜론 뒤에서 줄을 나눔. 52쪽 첫 카드 이름은 사용자 결정으로 "Context 가공" 그대로 둠. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 52쪽 Hook 사례: Context engineering의 카드를 State, Context 가공, Tool result 변환, Compaction으로 다시 정리. hook이 도는 순서로 놓고 State를 포인트 색으로 칠함. 출처에 opencode를 더함. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 51쪽 Hook 쓰임을 표에서 카드 상자로 되돌림(윗줄 Context · 통제 · 검증, 아랫줄 유틸리티 · 자동화). Context와 통제를 포인트 색으로 칠함. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 요청으로 51쪽 Hook 쓰임의 범주를 Context, 통제, 검증, 유틸리티, 자동화로 추상화하고, 사례 칸 폭을 줄이고 위치 칸을 넓혀 위치가 한 줄에 들어가게 함. 아티팩트 링크에 다시 올림
- 2026-11-26: 사용자 지적(LLM 호출 전후 hook 자리가 안 보임)으로 50쪽 Hook 위치를 Agent loop 중심 그림으로 바꿈. 위 LLM 호출, 아래 Tool 호출, 왼쪽 사용자 입력, 오른쪽 답변, 화살표 여섯에 hook. 가운데 이름은 Agent loop. 아티팩트 링크에 다시 올림
- 2026-11-26: hook 스터디를 마친 뒤 사용자 구성으로 Hook 앞 두 장을 49쪽 Hook 개념(이전 단계 → Hook → 다음 단계, 하는 일 다섯), 50쪽 Hook 위치(LLM 호출 · Tool 호출 루프의 화살표 넷에 hook), 51쪽 Hook 쓰임(다섯 범주 표)으로 나눠 63쪽이 됨. 구성 표, 목차 설명, 순서 비교 표를 고치고 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 Hook 섹션을 다시 짬. 49쪽 Hook 개념(루프 그림에 hook 노드), 50쪽 Hook 쓰임, 51쪽 Hook 사례: Context engineering, 52쪽 Controls 개념, 53쪽 Hook 사례: Control. Hook 판정 구조 장은 Control 사례와 겹쳐 뺌. 62쪽이 되어 구성 표, 목차 설명, 순서 비교 표를 고치고 32쪽 Controls 쪽 참조를 섹션 이름으로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 50쪽 Hook 판정 구조의 행 이름을 "실행 전 판정 · Control", "결과 판정 · Verification"으로 줄이고 표를 다듬음. 칸마다 두 줄로 맞추려고 permission 규칙의 평가 순서(deny → ask → allow)와 /goal의 "(prompt Stop hook)"을 칸에서 빼고(아래 줄의 판정 모델 붙이는 방법에 hook 종류가 남음), 테스트 · 린트 · CI를 한 줄로, 설명 문장의 "(넓은 뜻의 hook)"을 뺌. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 49쪽 설명 문장 맨 앞에 "context 가공"을 더해 "루프의 정해진 지점에서 자동으로 실행: / context 가공 · 판정 · 알림 · 자동화 · 기록 등"으로 둠. 한 줄로 두면 "· 기록 등"만 다음 줄로 넘어가서 콜론 뒤에서 줄을 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 49쪽 Hook 쓰임의 설명 문장을 쓰임 전체를 짧게 말하는 "루프의 정해진 지점에서 자동으로 실행: 판정 · 알림 · 자동화 · 기록"으로 바꿈. 전 문장("판정은 일부: Claude Code 공식 예시 약 40개 중 판정 · 검증은 5~6개")의 근거는 hook-points.md 쓰임 조사에 남음. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 의견으로 40쪽 Context engineering 구현에 Tool call 칸(필요할 때 불러옴, Skill · MCP 포함)을 더해 Transcript, Tool call, Hook, Compaction 넷이 됨. 설명 문장에도 "tool call로 필요할 때 불러오고"를 넣음. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 지적으로 48쪽 tools/call 문구를 "get_weather + _meta"에서 "get_weather + arguments"로 바꿈. 요청 본문의 핵심은 도구 이름과 arguments(inputSchema에 맞춘 입력)이고, _meta는 2026-07-28판에서 모든 요청에 붙어 오른쪽 카드에 따로 있음. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 48쪽 MCP 호출 과정의 tools/list 요청과 결과를 포인트 색으로 강조하고 문구를 "필요할 때 불러오는 도구 목록", "도구 설명 · inputSchema → context"로 바꿔 context engineering과 잇게 함. 전 문구 "+ _meta"(오른쪽 카드에 남음)와 "tools · ttlMs · cacheScope"는 이 자리에서 빠짐. 서버 머리 노드의 포인트 색은 뺌. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 47쪽 MCP 구조의 상자 이름을 "Host (Claude Code 등)"에서 "Host (AI Agent)"로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 45쪽 둘째 칸 작은 글자에서 "에이전트가 볼 수 있는"을 빼 "도구 설명과 입력 형식을 포함한 API"로 둠(한 줄에 들어감). 알약은 다른 hub 장과 같은 기본 크기. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 제안으로 45쪽 둘째 칸을 큰 글자 "도구 활용 context 제공", 작은 글자 "에이전트가 볼 수 있는 도구 설명과 입력 형식을 포함한 API"로 다시 바꿈. 큰 글자가 한 줄에 들어가 넓혔던 오른쪽 칸을 기본 너비로 되돌리고 hub `rw` 옵션은 뺌. 작은 글자는 두 줄. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 45쪽 MCP 개념의 오른쪽 둘째 칸을 큰 글자 "설명 · 입력 형식 context 제공", 작은 글자 "에이전트가 사용하기 쉬운 API"로 바꿈(전에는 "에이전트용 API" / "설명 · 입력 형식을 함께 제공"). 큰 글자가 두 줄로 넘쳐 이 장의 오른쪽 칸만 넓힘(hub `rw`). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 44쪽 효율 칸 설명에서 "(1,000~2,000 토큰)"을 빼 "요약만 반환"만 둠. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 44쪽 Main agent 칸 설명을 "Tool call로 생성"에서 "Tool call로 sub-agent를 생성"으로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 44쪽 Sub-agent 목적의 설명 문장 끝을 "결과만 돌려줌"에서 "결과를 돌려줌"으로 바꿈. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 42쪽 Agent Skills 구성의 오른쪽 칸 이름에서 "(발표자 해석)"을 빼 "역할"만 둠. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 40쪽 설명 문장에서 "하니스가"를 뺌("transcript를 바탕으로 매 턴 context를 조립하고…"). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 지적으로 40쪽 설명 문장의 주어를 하니스로 밝힘("하니스가 transcript를 바탕으로 매 턴 context를 조립하고…"). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 의견으로 40쪽 Context engineering 구현의 오른쪽을 Hook, Middleware · Callback, Plugin, Compaction에서 Transcript, Hook, Compaction으로 바꿈(앞의 셋은 같은 개념이라 Hook으로 묶음). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 36쪽 1턴 · 10턴 막대를 더 줄임(32 → 23, 64 → 48). System prompt · Tools를 10 → 6으로 줄이고 30턴 합계(110)와 넘치는 모양은 유지. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 36쪽 Context window 초과의 1턴 · 10턴 막대를 줄임(합계 46 → 32, 80 → 64). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 제안으로 33, 35쪽에서 Embedding과 Positional encoding을 나란히 두고 세로 선으로만 이음(옆으로 빠지는 꺾인 선 없앰). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 제안으로 33, 35쪽의 Positional encoding 노드를 Embedding 옆으로 내림(입력 토큰 → Positional encoding → Self-attention 선은 그대로). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 제안으로 33, 35쪽 그림에 입력 토큰 → Positional encoding 선을 더해, 입력 토큰에서 갈라진 Embedding과 Positional encoding이 Self-attention에서 합쳐지게 함. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 33, 35쪽의 Positional encoding을 Self-attention 옆 노드로 떼어 선으로만 잇고, 35쪽에서 RoPE · Q · K 언급과 예외 각주를 빼 "Positional encoding"으로만 적음. 아티팩트 링크에 다시 올림
- 2026-11-25: 사실 확인 기록을 두 문서로 나눈 것에 맞춰 사실 확인 기록 절과 34쪽(당시) 근거 위치를 고침
- 2026-11-25: ai-wiki 요청 24 답으로 33, 35쪽 "확인 중"을 지우고 35쪽 설명(attention 안에서 Q · K 회전, 256K → 1M은 YaRN ×4 설정으로 늘린 예)과 출처를 고침. 사용자 의견으로 알약 표기를 "Positional encoding"으로 줄임. 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 33~36쪽 순서를 한계 1(Attention budget) → Lost in the middle → 한계 2(Context window 상한) → Context window 초과로 바꾸고 두 한계 장 제목에 번호를 붙임. 두 그림에서 Positional encoding (RoPE)를 Self-attention 블록 안으로 옮김(ai-wiki 요청 24로 확인 중). 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 33쪽 Transformer 구조 한계를 Attention budget 장과 새 34쪽 Context window 상한(Positional encoding 강조)으로 나눠 60쪽이 됨. 14쪽 `<IMPORTANT>` 블록을 빼고 입력 글자를 14px로, 16쪽 카테고리 예의 알약을 다음 줄로, 28쪽 설명 끝을 "정답률이 개선됨"으로, 32쪽과 51쪽을 "비결정론적 동작"으로 바꿈. 구성 표, 목차 설명, 순서 비교 표의 쪽 번호를 고치고 아티팩트 링크에 다시 올림
- 2026-11-25: 사용자 요청으로 25쪽 Hallucination 칸 설명을 "부분 해소: 줄었지만 남아 있음"으로 바꾸고 설명 문장을 맞춤. 아티팩트 링크에도 다시 올림
- 2026-11-25: 사용자 요청으로 덱을 claude.ai 비공개 아티팩트로 올리고 보는 방법에 링크를 적음
- 2026-11-25: 사용자 요청으로 32쪽 첫 줄 대응 칸에서 Skills와 Sub-agents를 빼고 "Context engineering"만 남김. 쪽 표시(33~43쪽)는 사용자 결정으로 그대로 둠
- 2026-11-25: 사용자 요청으로 32쪽의 "비결정성"을 "비결정론적"으로 바꾸고 조기 종료를 마지막 줄로 옮김. 50쪽 Controls 개념의 왼쪽 노드도 같은 말로 맞춤
- 2026-11-25: 사용자 요청으로 31쪽 아래에 AutoGPT(2023-03) 예시와 Planning을 포함한 Devin(2024-03)을 날짜와 함께 붙임
- 2026-11-25: 사용자 요청으로 31쪽 설명을 "LLM, Tool Use, Memory, Agent Loop가 기본"으로 줄임(Planning 언급 뺌)
- 2026-11-25: 사용자 의견으로 31쪽 Primitive AI Agent에서 Planning을 흐리게 표시하고 설명을 고침
- 2026-11-25: 사용자 질문으로 30쪽 Planning 구현을 "실행 전 Plan mode → 실행 중 Tasks ↔ 계획 갱신(반복)" 묶음 상자로 다시 그림
- 2026-11-25: 사용자 요청으로 터치 좌우 밀기로 넘기는 동작을 뺌(확대 중에도 넘어가는 문제)
- 2026-11-25: 사용자 요청으로 34쪽 아래 근거 알약 셋을 빼고 막대 크기를 되돌림
- 2026-11-25: 사용자 요청으로 34쪽 맨 위에 토큰 생성 되짚기 띠(4쪽 예시, 생성한 토큰이 입력 끝에 다시 붙는 점선 화살표)를 넣고, 막대를 줄여 자리를 만듦
- 2026-11-25: ai-wiki 요청 22 답으로 34쪽의 "확인 중"을 지우고 근거 알약 셋과 출처를 더함
- 2026-11-25: 사용자 요청으로 33쪽 뒤(34쪽)에 Context window 초과 개념도를 더해 59쪽이 됨(ai-wiki 요청 22로 확인 중)
- 2026-11-25: 사용자 지적(둘 다 CoT 적용 사례)으로 28쪽을 CoT 적용 · 미적용 비교로 바꿈. 출력 비교는 Kojima Figure 1 저글러 문제(8 ✗ → 4 ✓), 수학 밖 과제는 정확도 알약 셋
- 2026-11-25: 사용자 요청으로 28쪽 CoT 프롬프트를 지어낸 수학 예시에서 Kojima 2022의 Last Letter 원문 예시(성공 ynln ✓, 실패 tkaea ✗)와 정확도 0.2% → 57.6%로 바꿈
- 2026-11-25: 사용자 의견으로 33쪽 Transformer 구조 한계를 두 한계(Attention budget → 품질 저하, 학습 길이 → Context window 상한)와 "사용 단계 비용" 한 줄로 다시 씀
- 2026-11-25: 사용자 요청으로 35쪽 Context engineering 개념 그림의 후보에 Agent Skills를 더함(출처 칸에 발표자가 더함을 적음)
- 2026-11-25: 사용자 요청으로 11쪽을 동적 검색까지 비교한 표에서 질의 기반 RAG 흐름(질문 → Retriever → 상위 k개 문서 → LLM → 답변) 하나로 줄이고, 제목을 "질의 기반 RAG"로 바꿈
- 2026-11-25: ai-wiki 요청 17 답으로 11쪽 표를 고치고(FLARE · DRAGIN, Self-RAG arXiv 2023, Search-R1 추가, Agentic search) "확인 중"을 지움
- 2026-11-25: 사용자 제안으로 Tool Use 첫머리(11쪽)에 RAG 검색 방식 표를 더해 58쪽이 됨(ai-wiki 요청 17로 확인 중). 쪽 번호를 지금 기준으로 유지하는 절을 구성 표, 목차 설명, 순서 비교 표로 좁힘
- 2026-11-25: 사용자 의견으로 24쪽의 RAG · Tool call 두 노드를 두 줄에 걸친 노드 하나로 합침(pairs의 span)
- 2026-11-25: 사용자 요청으로 8~10쪽의 제목 위 머리표를 없애고 제목 자체를 "한계 극복 1: RAG", "한계 극복 2: Chain-of-Thought", "한계 극복 3: Prompt chaining"으로 바꿈
- 2026-11-25: 사용자 지적으로 10쪽 왼쪽 노드를 "복잡한 작업"에서 "추론 한계"(칸 이름 "한계")로 바꿔, 8~10쪽 왼쪽이 모두 7쪽의 한계가 되게 함
- 2026-11-25: 사용자 요청으로 8~10쪽 제목 위에 "한계 극복 방안 1~3"을 달고, Planning 첫머리(24쪽)에 LLM 한계 극복 현황을 더해 57쪽이 됨. 문서가 300줄에 가까워져 사실 확인 기록을 presentation-fact-checks.md로 나눔
- 2026-11-25: 사용자 요청으로 18쪽(ReAct 이력 활용)을 지어낸 검색 예에서 ReAct 논문 Figure 1 (2b)의 ALFWorld 궤적으로 바꿔, 16쪽 Act-only 실패와 같은 과제가 해결되는 것을 보임
- 2026-11-25: 사용자가 준 Qwen3.5 chat template 원문으로 13쪽 입력 블록을 바꿈(형식 예시와 `<IMPORTANT>` Reminder 22줄, 원문 줄바꿈). 입력만 12px로 접어 보이게 하는 wrap 옵션을 더하고 아래 알약 줄을 뺌
- 2026-11-25: 사용자 요청으로 13쪽 입력 블록을 실제 도구를 넣은 요약 예에서 템플릿의 호출 형식 지시 부분 원문(형식 예시 포함)으로 바꿈. 질문은 출력 라벨로, 도구 목록은 알약으로 옮기고 설명 문장을 줄임
- 2026-11-25: ai-wiki 요청 16 답으로 13쪽 출력이 Qwen3.5 템플릿 형식 예시와 같음을 확인(강)하고 "확인 중"을 지움. `<tools>` 안 JSON 표기와 Reminder 원문도 확인. 출처를 "Li 2026 부록 E.1"로 구체화
- 2026-11-25: 사용자 지적으로 13쪽 출력을 템플릿 형식 예시처럼 parameter 값을 따로 줄에 두게 고침. 템플릿 원문은 ai-wiki 요청 16으로 확인 중
- 2026-11-25: 사용자 승인으로 ReAct 원문 Figure 1(arXiv HTML판)을 직접 읽어 16쪽의 번호와 과제 문장 구두점이 원문과 같음을 확인. 그림처럼 되풀이한 Act 5도 포인트 색으로 칠하고 "확인 중"을 지움
- 2026-11-25: ai-wiki 요청 15 답으로 16쪽을 고침(행동 대소문자, 과제 문장, 옆 알약 "Hallucinating action", 성공률에 "6번 시도 중 최고", 설명 문장을 원문의 "현재 상태를 놓침"에 맞춤). 확인 결과, ReAct도 반복에 빠진다는 주의, 하니스의 반복 호출 대응을 기록
- 2026-11-25: 사용자 요청으로 ReAct 앞(16쪽)에 Tool call 반복 실패(ReAct 논문 ALFWorld Act-only 궤적)를 더해 56쪽이 됨. 사실 확인은 ai-wiki 요청 15로 보내고 "확인 중" 표시. 목차와 본문 쪽 참조를 섹션 이름으로 계산하게 바꾸고, 한국어 줄바꿈을 어절 단위로 바꿈. 구성 표, 순서 비교 표, 구현 방식의 쪽 번호를 지금 기준으로 고침
- 2026-11-25: 사용자 요청으로 22쪽 번호를 LLM 호출 차례(①이 세 곳, ②가 세 곳)에서 단계마다 하나씩 ①~⑦로 바꿈
- 2026-11-25: 사용자 요청으로 13쪽 템플릿을 입력(system, user, assistant 시작)과 출력(`<tool_call>`) 두 블록으로 나눔. 글자 14px, 설명 알약은 아래 줄
- 2026-11-25: 사용자 요청으로 22쪽(Agent 작업 수행)을 21쪽과 같은 루프 그림에 README 수정 예시를 넣은 장으로 바꿈. 루프 노드 높이를 최소 72px로 바꿈
- 2026-11-25: 사용자 의견 반영. 목차를 두 부분(구성, 구현) 대신 섹션 제목 18개 나열로 바꿈. 3쪽 L2 이름을 "확장 구성"으로, 7쪽 셋째 원인을 "복잡한 작업"으로 바꿈. 8, 10쪽의 오른쪽 단계를 상자 하나로 묶음(hub rgroup). 샌드박스 미리보기의 Script error(history.replaceState의 SecurityError)를 고침
- 2026-11-25: 처음 구성안과 순서를 맞댄 "구성안과 순서 비교" 절을 더함. 44쪽 이동을 사용자 결정으로 적었던 아래 기록을 바로잡음
- 2026-11-25: 사용자 결정으로 "Hook 사용 예"(판정 예 넷)를 "Hook 쓰임"(쓰임 여덟 가지)으로 넓힘. 같은 작업에서 Hook 섹션 맨 앞(44쪽)으로 옮김(옮긴 것은 Claude 판단). 판정 구조는 45쪽. 근거는 hook-points.md의 쓰임 조사
- 2026-11-24: 사용자 결정으로 Controls와 Goal Loop를 "Hook: Controls · Verification"(44~51쪽)으로 묶고 44쪽 Hook 판정 구조(표)를 더함. 55쪽이 됨
- 2026-11-24: 판정 모델을 붙이는 세 가지 방법(내장 단계, hook, sub-agent 호출)을 검토에 더함(ai-wiki 요청 13). 유출 소스 분석에만 근거한 verification agent 세부를 50쪽에서 뺌
- 2026-11-24: 사용자 결정으로 43쪽 MCP 호출 과정을 최신 스펙(2026-07-28) 흐름으로 바꿈. "둘 다 hook으로 구현된 것 아닌가" 질문의 검토를 더함
- 2026-11-24: analysis-docs의 MCP 스펙 확인 결과로 37, 41~43쪽을 고치고 "확인 중" 표시를 모두 지움. 43쪽의 기준 판(2025-11-25 또는 2026-07-28)은 결정 대기
- 2026-11-24: auto mode classifier 확인 결과(내장 permission 단계, 실행 전 판정, /goal과의 공식 대비)로 Verification 검토를 보강
- 2026-11-24: Sub-agents를 Agent Skills 뒤로 옮김(사용자 승인). Verification을 hook으로 합칠지 검토를 더하고, MCP 세부 확인을 analysis-docs 세션에 요청
- 2026-11-24: ai-wiki 사실 확인 결과를 반영해 15개 장을 고치고 "확인 중" 표시를 지움(39, 41쪽은 남음). 구성안에서 바꾼 것에 13, 44, 48, 49쪽을 더함
- 2026-11-24: 문서 작성. 54쪽 HTML 슬라이드 초안, 구성안에서 바꾼 것, 검토 의견, 사실 확인 대기 목록
