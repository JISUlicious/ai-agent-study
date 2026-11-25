# 발표 슬라이드: AI Agent 구성과 구현

사용자가 2026-11-24에 준 54쪽 구성안으로 만든 HTML 슬라이드의 기록입니다. 파일은 저장소 루트의 `ai-agent-slides.html`입니다. 구성안에 없던 질의 기반 RAG(11쪽), Tool call 반복 실패(17쪽), LLM 한계 극복 현황(25쪽), Hook 판정 구조(48쪽)를 더해 지금은 58쪽입니다.

쪽 번호 기준: 장을 자주 더하고 옮겨서, 이 문서는 구성 표, 목차 설명, 순서 비교 표만 지금(58쪽) 기준으로 고칩니다. 구현 방식, 구성안에서 바꾼 것, 검토 의견과 [presentation-fact-checks.md](presentation-fact-checks.md)의 쪽 번호는 적은 날의 기준입니다. 슬라이드 안의 목차와 쪽 참조는 자동으로 계산되어 늘 맞습니다.

## 보는 방법

- 브라우저로 파일을 엽니다. 미리보기 서버는 `.claude/launch.json`의 `agent-slides`(포트 8768)입니다.
- 키보드: →, Space, PageDown은 다음, ←, PageUp은 이전, Home과 End, G는 목록. 화면 오른쪽 아래 버튼과 터치 밀기도 됩니다.
- 주소 끝의 `#번호`로 그 쪽을 바로 엽니다. 인쇄하면 한 쪽에 한 장씩 1280×720으로 나옵니다(PDF 저장용).

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
| 4–10 | LLM: 토큰 생성, Pre-training, Text generation, 한계, 한계 극복 1~3(RAG, Chain-of-Thought, Prompt chaining) |
| 11–17 | Tool Use: 질의 기반 RAG, WebGPT, JSON 출력, Tool call 템플릿(호출 형식 지시와 모델 출력), 실행, 효과, 반복 실패(Act-only 사례) |
| 18–20 | ReAct: 루프, 이력 활용(17쪽과 같은 과제의 ReAct 궤적), 핵심 개념(Memory, Agent loop) |
| 21–24 | Memory(내부, 외부), Agent Loop(구조, 작업 수행: 구조와 같은 루프 그림에 예시) |
| 25–31 | Planning: LLM 한계 극복 현황, 오작동, Prompt chaining 재검토, CoT 프롬프트와 구조, 구현, Primitive AI Agent |
| 32–38 | AI Agent 한계, Context Engineering(Transformer 한계, Lost in the middle, 개념, 원칙, 대상, 구현) |
| 39–42 | Agent Skills(개념, 구성), Sub-agents(Multi-agent 구조, 목적) |
| 43–46 | MCP(개념, 구성요소, 구조, 호출 과정) |
| 47–54 | Hook: Controls · Verification(Hook 쓰임, 판정 구조, Controls 개념, Sandbox 필요성과 구현, 조기 종료, Goal loop 구현, Verifier 검증 루프) |
| 55–56 | General-Purpose AI Agent: 구조(매트릭스 보드의 구현요소 흐름), 사례 |
| 57–58 | Evaluation: 방법론(AI-Native SDLC Playbook), 확장 |

목차는 처음에 제목 "구성과 구현"에 맞춰 "구성"(3~28쪽)과 "구현"(29~55쪽) 두 부분으로 묶었습니다. 2026-11-25 사용자 의견(두 부분의 경계가 모호함)으로 묶음을 없애고, 섹션 제목 18개를 쪽 범위와 함께 두 단으로 나열합니다. 제목은 각 장 오른쪽 위의 섹션 이름을 따릅니다. 그래서 전에 한 줄로 합쳤던 Memory · Agent Loop와 AI Agent 한계 · Context Engineering을 나누고, Planning 범위에 들어 있던 Primitive AI Agent(31쪽)도 따로 적습니다. Hook 섹션은 Hook(47~48), Hook · Controls(49~51, Sandbox 포함), Hook · Verification(52~54) 세 줄입니다. 쪽 범위는 2026-11-25부터 장의 섹션 이름으로 계산하므로, 장을 더하거나 옮겨도 목차를 따로 고칠 필요가 없습니다(아래 "구현 방식"). 고려한 대안은 둘이었습니다. 하나는 이전 13줄을 묶음 제목만 빼고 그대로 두는 것인데, 합친 줄이 장의 섹션 이름과 어긋나 택하지 않았습니다. 다른 하나는 쪽 번호까지 빼는 것인데, 발표 중 목차에서 바로 이동할 때 쪽 범위가 쓸모 있어 남겼습니다.

2026-11-24 사용자 승인으로 Sub-agents를 Agent Skills 뒤(38~39쪽)로 옮겼습니다. Context window 한계에 대응하는 장(Context Engineering, Skills, Sub-agents)이 이어지게 하려는 것입니다. MCP부터 Goal Loop까지는 두 쪽씩 밀렸고, 29쪽의 대응 쪽 번호와 목차도 고쳤습니다. 아래 "구성안에서 바꾼 것"과 [presentation-fact-checks.md](presentation-fact-checks.md)의 "사실 확인 결과" 표의 쪽 번호는 옮기기 전 기준입니다.

### 구성안과 순서 비교 (2026-11-25 확인)

처음 구성안(54쪽)과 지금 슬라이드(58쪽)를 한 쪽씩 맞댄 결과입니다. 구성안에 없던 장을 넷 더했고(11쪽 질의 기반 RAG, 17쪽 Tool call 반복 실패, 25쪽 LLM 한계 극복 현황, 48쪽 Hook 판정 구조), 자리를 옮긴 곳이 둘(Sub-agents 앞당김, Hook 쓰임을 Controls 앞으로)입니다. 나머지는 순서 그대로 쪽 번호만 밀렸습니다.

| 구성안 | 지금 | 내용 | 바뀐 점 |
|---|---|---|---|
| 1–10 | 1–10 | 제목부터 한계 극복 3(Prompt chaining)까지 | 그대로 |
| 없음 | 11 | 질의 기반 RAG | 새 장(2026-11-25 사용자 제안, 질문으로 한 번 검색하는 일반 RAG를 보여 WebGPT로 잇는 다리) |
| 11–15 | 12–16 | WebGPT부터 Tool use 효과까지 | 순서 그대로, 한 쪽 밀림 |
| 없음 | 17 | Tool call 반복 실패 | 새 장(2026-11-25 사용자 요청, ReAct로 가는 근거) |
| 16–22 | 18–24 | ReAct부터 Agent Loop까지 | 순서 그대로, 두 쪽 밀림 |
| 없음 | 25 | LLM 한계 극복 현황 | 새 장(2026-11-25 사용자 요청, 복잡한 작업 오작동으로 잇는 다리) |
| 23–37 | 26–40 | Planning부터 Agent Skills까지 | 순서 그대로, 세 쪽 밀림 |
| 49–50 | 41–42 | Sub-agents | Agent Skills 뒤로 앞당김(2026-11-24 사용자 승인) |
| 38–41 | 43–46 | MCP | 순서 그대로, 다섯 쪽 밀림 |
| 43 | 47 | Hook 사용 예시 → Hook 쓰임 | Controls 앞, Hook 섹션 맨 앞으로 옮김(2026-11-25 Claude 판단, 따로 승인받지 않음) |
| 없음 | 48 | Hook 판정 구조 | 새 장(2026-11-24, 넓은 뜻의 hook으로 묶는 사용자 결정과 함께 더함) |
| 42 | 49 | Controls | Hook 두 장 뒤로 감 |
| 44–45 | 50–51 | Sandbox | 순서 그대로 |
| 46–48 | 52–54 | Goal Loop | 순서 그대로, 섹션 이름이 Hook · Verification으로 바뀜 |
| 51–54 | 55–58 | General-Purpose AI Agent, Evaluation | 순서 그대로, 새 장 넷 때문에 네 쪽 밀림 |

- 구성안의 Controls(42), Hook(43), Sandbox(44~45), Goal Loop(46~48) 네 섹션은 2026-11-24 사용자 결정으로 "Hook: Controls · Verification" 한 섹션(지금 47~54쪽)이 됐습니다.
- Hook 쓰임을 옮긴 경위: 2026-11-25에 제안한 두 안은 "46쪽(당시 쪽 번호)을 그 자리에서 쓰임별로 바꾸기"와 "그 장은 두고 섹션 앞에 Hook 쓰임 장 추가"였고, 사용자 답은 "넓혀서 작성"이었습니다. 첫 안대로 넓히면서 자리는 섹션 맨 앞으로 옮겼습니다. 쓰임 전체에서 판정(48쪽 표)으로 좁혀 가는 순서가 낫다고 본 판단이고, 이동은 따로 승인받지 않았습니다.
- 구성안 43쪽의 "HITL hook 포함"은 지금 47쪽(Hook 쓰임)에 없고 48쪽 표의 "PermissionRequest 승인 (HITL)" 칸에만 있습니다. 넓히기 전 "Hook 사용 예"는 PermissionRequest(사람의 승인, HITL)를 강조 카드로 두었는데, 쓰임 여덟 가지로 바꾸면서 빠졌습니다.

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
- 13쪽은 템플릿을 입력과 출력 두 블록으로 나눕니다(2026-11-25 사용자 요청). 입력 블록은 처음에 템플릿을 줄여 실제 도구(get_weather)와 질문을 넣은 예였으나, 같은 날 사용자 요청("실제 사용 가능한 예시 말고 호출 형식을 알려 주는 부분")으로 템플릿 중 호출 형식을 지시하는 부분을 원문 그대로 옮겼습니다. 처음에는 Li 2026 부록 E.1(ai-wiki 요청 16)의 인용을 썼으나, 사용자가 실제 chat template(Jinja)의 해당 문자열을 주어 그 원문으로 바꿨습니다. "If you choose to call a function ONLY reply in the following format with NO suffix:"부터 형식 예시, `<IMPORTANT>` Reminder 네 줄, `</IMPORTANT>`까지 22줄입니다. 원문은 빈 줄 둘, 둘째 parameter 값의 세 줄("This is the value for the second parameter" / "that can span" / "multiple lines"), 따로 된 줄의 "Reminder:", 마침표 없는 항목을 씁니다. 부록 인용은 이 줄바꿈과 마침표가 달랐습니다. 22줄을 출력 블록과 나란히 넣으려고 입력 블록만 12px로 두고, 긴 Reminder 줄은 상자 안에서 접어(접힌 줄은 2칸 들여 원래 줄과 구분) 빈 줄은 반 줄 높이로 줄였습니다(code 블록의 wrap 옵션). 아래 알약 줄은 높이가 모자라 뺐습니다. 도구 목록(`<tools>`)이 이 부분 앞에 온다는 점은 입력 라벨에, Qwen3·Qwen2.5의 JSON 형식은 출처 칸에 옮겼고, 질문 "서울 날씨 알려줘"는 출력 블록 라벨에 둡니다. 두 블록이 형식 지시와 그대로 따른 출력이 되어, 자리표시(example_function_name, example_parameter_1, value_1)가 출력의 get_weather, city, Seoul에 맞대어집니다. 출력은 처음에 `<parameter=city>Seoul</parameter>`를 한 줄로 썼으나, 템플릿의 형식 예시와 다르다는 사용자 지적(2026-11-25)으로 값 `Seoul`을 여는 태그와 닫는 태그 사이의 따로 된 줄에 두었습니다(ai-wiki 요청 16으로 원문과 같음을 확인). 두 블록을 12쪽처럼 화살표로 나란히 두려고 글자를 15px에서 14px로 줄이고(code2에 글자 크기 값을 받게 함, 12, 27쪽은 18px 그대로), 설명 알약 셋은 아래 줄로 옮겼습니다.
- 23쪽(Agent 작업 수행)은 22쪽(Agent loop 구조)과 같은 루프 그림(loop)을 쓰고 노드 설명만 예시로 바꿉니다. 예시가 두 줄이라 루프 노드 높이를 고정 72px에서 최소 72px로 바꿨습니다. 한 줄 설명인 17, 22, 53쪽은 72px 그대로입니다(2026-11-25 확인).
- hub의 `rgroup`: 오른쪽 노드가 가운데 노드와 따로 이어지는 대상이 아니라 그 안의 단계일 때 씁니다. 단계를 회색 상자 하나로 묶고, 가운데에서 상자로 가는 화살표는 하나만 둡니다. 상자 안 단계 사이에는 짧은 아래 화살표로 순서를 표시하고, 가운데 노드 높이는 다른 hub 장과 같게 둡니다. 8쪽(RAG)과 10쪽(Prompt chaining)에 씁니다(2026-11-25 사용자 의견). hub 장 16개 중 오른쪽이 단계인 장은 이 둘뿐이고, 9쪽 CoT의 오른쪽은 특징과 효과라 그대로 둡니다.
- Script error: 주소 끝 `#번호`를 바꾸는 `history.replaceState`가 샌드박스 미리보기(origin이 null인 iframe, 예: 앱의 파일 미리보기)에서 SecurityError를 냅니다. 미리보기 쪽에서는 다른 출처의 오류라 내용 없이 "Script error"로만 보입니다. 2026-11-25에 이 호출을 try로 감싸 실패해도 넘어가게 했습니다. 샌드박스 iframe(srcdoc, allow-scripts만 허용)에 파일을 넣어 고치기 전에는 806번째 줄 오류가 나고 고친 뒤에는 오류가 없음을 확인했습니다. 샌드박스 안에서는 주소의 쪽 번호만 갱신되지 않고 넘기기와 목록은 그대로 됩니다.

## 구성안에서 바꾼 것

| 쪽 | 구성안 | 슬라이드 | 이유 |
|---|---|---|---|
| 1 | 부제 없음 | "LLM에서 범용 에이전트까지" | 시안 D의 부제 자리. 자리표시로 둔 제안 |
| 3 | 층 이름 없음(L1, L2) | L1 기본 구성, L2 확장 구성 | 층마다 이름을 붙임. L2는 처음에 "실사용 보강"이었으나 2026-11-25 사용자 의견으로 "확장 구성"으로 바꿈 |
| 7 | 지능 한계 | 추론 한계(다단계 추론), 원인 칸은 복잡한 작업 | "지능"은 범위가 넓어 CoT가 대응하는 한계로 좁힘. 기존 기준의 "다단계 추론"과 맞춤. 원인 칸은 처음에 "중간 단계 없는 생성"이었으나, 2026-11-25 사용자 의견으로 당시 10쪽 Prompt chaining의 왼쪽 노드와 같은 "복잡한 작업(여러 단계를 한 번에 처리)"으로 바꿈. 같은 날 8~10쪽에 "한계 극복 방안 1~3"을 단 뒤, 사용자 지적으로 10쪽 왼쪽 노드를 원인(복잡한 작업)이 아닌 한계(추론 한계, 칸 이름 "한계")로 고쳐 8~10쪽의 왼쪽이 모두 7쪽 오른쪽의 한계가 되게 함. 추론 한계 하나에 CoT(9쪽)와 Prompt chaining(10쪽) 두 방안이 대응하고, 24쪽 LLM 한계 극복 현황의 "CoT · Prompt chaining으로 일부 대응"과도 맞음 |
| 8–10 | "LLM 개선방향: 지식 보강(RAG)", "깊은 추론(CoT)", "작은 단위로 분해(prompt chaining)" | 제목 "한계 극복 1: RAG", "한계 극복 2: Chain-of-Thought", "한계 극복 3: Prompt chaining" | 2026-11-25 사용자 요청. 구성안의 "개선방향"을 7쪽 한계와 잇는 번호로 다시 살림. 처음 제목은 RAG 지식 보강, Chain-of-Thought 추론, Prompt chaining 분해였고, 제목 위 머리표를 거쳐 제목 자체로 바꿈 |
| 10과 11 사이 | 없음 | 새 11쪽 질의 기반 RAG(흐름): 질문 → Retriever(질문으로 한 번 검색, 포인트 색) → 상위 k개 문서(벡터 색인에서 질문과 가까운 문서) → LLM(질문 + 문서로 생성) → 답변 | 2026-11-25 사용자 제안. 처음에는 일반 RAG와 동적 검색 다섯 가지(생성 중 검색, 검색 판단 토큰, 추론과 번갈아 검색, 도구 호출 검색, Agentic search)를 비교한 표 "RAG 검색 방식"이었고 ai-wiki 요청 17로 확인까지 마쳤으나, 같은 날 사용자 요청으로 질의 기반 RAG만 간단히 남김. 동적 검색 사례와 근거는 presentation-fact-checks.md의 요청 17에 기록으로 둠. 설명 문장 "무엇을 언제 찾을지는 프로그램이 정함"은 모델이 검색 명령을 내는 다음 장 WebGPT와 대비하려는 것. 흐름은 Lewis 2020(입력 x로 상위 K개 문서, DPR 검색기)을 따름. table의 widths, compact 옵션은 그때 더한 채로 남김 |
| 22와 23 사이 | 없음 | 새 24쪽 LLM 한계 극복 현황: Hallucination과 지식 한계 → RAG · Tool call(실선, 대응, 두 줄에 걸친 노드 하나), 추론 한계 → 복잡한 작업 오작동(점선, 원인, 포인트 색) | 2026-11-25 사용자 요청: 두 한계가 RAG와 Tool call로 극복됐음을 보이고 복잡한 작업 오작동 장으로 매끄럽게 이음. "극복"은 제목에만 쓰고, 칸에는 8쪽 설명("환각을 줄이지만 없애지는 못함")과 맞춰 "줄임", "보충"으로 씀. 추론 한계는 CoT와 Prompt chaining으로 일부 대응했지만 에이전트의 긴 작업에서 다시 드러나는 것으로 적어, 뒤의 Prompt chaining 재검토와 CoT 장과 어긋나지 않게 함 |
| 17 | 자기 행동의 이력을 보며 동작을 수정 | ReAct 논문 Figure 1 (2b)의 ALFWorld 궤적(16쪽과 같은 과제를 Think로 풀어 성공) | 2026-11-25 사용자 요청: 16쪽 실패가 ReAct로 해결되는 것을 같은 과제로 보임. 처음에는 검색어를 바꿔 다시 찾는 지어낸 예였음 |
| 22 | 작업을 수행하는 에이전트의 탄생 | 21쪽과 같은 루프에 예시: 사용자 입력 "README에 설치 방법 추가해줘", ① read_file 요청 ② README.md 읽기 ③ 파일 내용 ④ edit_file 요청 ⑤ 설치 방법 절 추가 ⑥ 수정 완료 ⑦ 도구 호출 없이 답 | 2026-11-25 사용자 요청. 처음에는 사용자 입력 → Agent loop → 작업 결과 흐름이었음. 번호는 처음에 LLM 호출 차례(①, ②, ③)로 매겨 한 번호가 노드 세 곳에 나왔으나, 같은 날 사용자 요청으로 단계마다 ①~⑦을 하나씩 매김. 루프가 여러 번 도는 것을 보이려고 도구를 두 번 쓰는 작업을 골랐고, 도구를 한 번 쓰는 날씨 예시는 14쪽 Tool call 실행과 겹쳐 쓰지 않음 |
| 15와 16 사이 | 없음 | 새 16쪽 Tool call 반복 실패: ReAct 논문 Figure 1의 ALFWorld Act-only 궤적. 없는 물건을 집는 같은 행동이 두 번 "Nothing happens."로 실패. 옆에 Act-only 뜻, 같은 호출 반복, ALFWorld 성공률 | 2026-11-25 사용자 요청: ReAct 바로 앞에 도구 호출이 계속 실패하는 사례를 두고 ReAct로 가는 근거로 씀. 논문이 ReAct의 비교 대상(Act-only)으로 직접 보인 실패라 근거로 바로 이어짐. HotpotQA 예(검색 실패 뒤 틀린 답)보다 "같은 호출 반복"이 뚜렷해 ALFWorld 예를 고름. ai-wiki 요청 15로 흐름, 수치, 실패 이유를 확인(강)하고, 위키로 못 본 번호와 과제 문장 구두점은 사용자 승인으로 원문 그림(ar5iv)에서 확인해 "확인 중"을 지움 |
| 25 | Planning: CoT 프롬프트 예시 | Kojima 2022 Figure 1의 저글러 문제로 CoT 미적용과 적용을 비교: 같은 질문에 "A: The answer (arabic numerals) is" → 8 ✗, "A: Let's think step by step." → 풀이 뒤 4 ✓. 아래 줄에 수학 밖 과제의 Zero-shot → Zero-shot-CoT 정확도(Last Letter 0.2% → 57.6%, Coin Flip 12.8% → 91.4%, Date 49.3% → 67.5%) | 2026-11-25 사용자 요청(지금 28쪽). 처음 예시(책 15권 문제)는 지어낸 것이었음. ai-wiki 요청 19~21로 후보를 찾아 한때 Last Letter의 성공(ynln ✓)과 실패(tkaea ✗)를 실었으나, 둘 다 CoT를 적용한 출력이라 CoT 적용 · 미적용 비교가 안 된다는 사용자 지적으로 바꿈. 수학 밖 과제에서 미적용 출력과 적용 출력을 원문으로 나란히 보인 예시는 두 논문에 없어서, 출력 비교는 원문 그림이 있는 저글러 문제(수학)로 하고, 수학 밖 과제는 정확도 수치로 보탬. Last Letter 성공 · 실패 예시는 presentation-fact-checks.md 요청 21에 남김. 입력 하나에 출력 여럿과 아래 알약 줄을 그리는 codefan을 씀 |
| 30 | transformer 모델의 구조적인 한계(어느 부분인지 명시) | 두 한계로 정리: "Attention budget → 품질 저하"(Self-attention, 토큰이 늘수록 주의가 n²쌍에 얇게 퍼져 필요한 정보를 놓치고 중간 위치에서 특히 심함, 다음 장 Lost in the middle)와 "학습 길이 → Context window 상한"(Positional encoding(RoPE), 학습한 길이를 넘는 위치에서 attention이 무너지고 RoPE 조정 · YaRN과 추가 학습으로 늘림, 예 256K → 1M). KV cache와 prefill은 아래 "사용 단계 비용" 한 줄 | 2026-11-25 사용자 의견(지금 33쪽). 처음에는 O(n²), 학습 길이를 넘는 위치, KV cache, attention budget 네 칸이었음. ai-wiki 요청 18 조사와 이어진 질문에서 "창의 상한은 학습한 길이와 위치 표현이 정하고, KV cache와 prefill은 사용 단계 비용"으로 정리한 것에 맞춤. 학습 하드웨어는 큰 회사에 걸림돌이 아니라는 사용자 판단을 따름. 단 긴 문서 데이터가 드문 문제는 "학습 길이" 안에 들어감 |
| 32 | Anthropic Context Engineering 도표 | 오른쪽 후보에 Agent Skills를 더해 System instructions, Tools, MCP, Agent Skills, 외부 데이터, Message history 여섯 칸 | 2026-11-25 사용자 요청(지금 35쪽). Agent Skills도 필요할 때 context에 들어오는 정보라 선별 대상에 넣음. 원 글(2025-09)의 목록에는 없어 출처 칸에 "Agent Skills는 발표자가 더함"을 적음. 여섯 칸이 들어가도록 칸 높이를 44px에서 40px로 줄임 |
| 37 | SKILLS.md | SKILL.md | 실제 파일 이름 |
| 39, 50 | 컨택스트 | 컨텍스트, context | 표기 통일 |
| 13 | Qwen3 계열 템플릿 | Qwen3.5 기본 tool call 템플릿(요약), Qwen3·2.5의 JSON 형식은 아래에 표시 | 위키에서 원문이 확인된 것은 Qwen3.5 템플릿뿐. 호출 형식은 JSON이 아니라 `<function=…><parameter=…>` 중첩 |
| 41 | health check | ping | MCP에서 연결 확인에 쓰는 메시지 이름(위키에 없어 확인 못 함) |
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

사실 확인 결과(ai-wiki 요청 11, 15, 16과 analysis-docs의 MCP 스펙 확인)는 [presentation-fact-checks.md](presentation-fact-checks.md)에 있습니다. 2026-11-25에 이 문서가 300줄에 가까워져 주제별로 나눴습니다.

## 검토: Verification을 hook으로 합칠지 (2026-11-24, 해석)

사용자 질문: Verification은 Claude Code auto mode의 classifier와 비슷하니, hook으로 모두 합칠까. auto mode classifier의 사실관계는 ai-wiki로 확인했습니다(요청 12, 아래 "확인된 사실").

공통점: 모두 루프의 정해진 지점에서 판정자가 통과, 차단, 계속을 정합니다. Claude Code에서는 많은 판정이 hook 지점에 붙습니다. PreToolUse(규칙), PermissionRequest(사람), `/goal`(Stop hook에서 작은 모델이 판정, [hook-points.md](hook-points.md))이 그렇습니다.

다른 점:

- 판정 대상: auto mode classifier는 실행 전에 행동을 봅니다(이 명령을 실행해도 되나). Verification은 멈추기 전에 결과를 봅니다(작업이 제대로 끝났나). ai-wiki도 Codex의 Guardian auto_review를 "결과 검증이 아니라 승인 검토"로 구분했습니다.
- 판정자: 규칙(결정적), 모델(확률적), 사람으로 나뉩니다. 발전 흐름 그래프에서 정한 원칙("반드시 지켜야 할 규칙은 코드로 하는 검사에, 모델 검증은 줄일 뿐 보장하지 않음")이 이 구분에 기댑니다.
- hook은 판정을 끼우는 지점(메커니즘)이지 판정 자체가 아닙니다. hook은 context 넣기, 로그처럼 판정이 아닌 일에도 쓰이고, verification은 hook 없이도 일어납니다(루프 안의 테스트 실행, 도구로 부르는 verifier sub-agent, CI).

판단: 개념으로는 합치지 않는 편이 낫습니다. Verification(결과)과 Control(행동)은 3쪽 L2에 그대로 두고, 둘이 같은 hook 지점 위에서 구현된다는 점을 한 장으로 보여 줍니다.

| 판정 대상 | 규칙 | 모델 | 사람 |
|---|---|---|---|
| 행동 (실행 전, 실패하면 막음) | permission 규칙(deny → ask → allow), PreToolUse hook | auto mode classifier(Claude Code), Guardian auto_review(Codex), smart 승인(Hermes) | PermissionRequest (HITL) |
| 결과 (실행 뒤 · 턴이 끝난 뒤, 실패하면 더 시킴) | 테스트 · 린트, CI | verifier sub-agent, `/goal` 판정(Stop hook의 작은 모델) | 리뷰 · 승인 |

이 표를 Controls 섹션 첫머리에 두고, Controls와 Goal Loop를 "Controls · Verification" 한 부분으로 묶는 안입니다. 대안은 사용자 안대로 hook 섹션 하나에 모두 모으는 것인데, 결정적 검사와 모델 판정의 차이가 흐려지고 hook 없이 하는 검증이 빠집니다.

확인된 사실(ai-wiki 요청 12, 따로 적은 곳 말고는 강):

- Claude Code auto mode는 권한 모드의 하나이고, 별도 classifier 모델이 도구 호출을 실행 전에 판정합니다. 순서는 allow·ask·deny 규칙 → 읽기 전용과 작업 폴더 안 편집의 자동 허용 → classifier입니다. 판정은 허용과 차단 둘이고, 같은 행동이 3번 연속 또는 모두 20번 막히면 사람에게 다시 묻습니다. 기본 모델은 Sonnet 5이고, 조종을 막으려고 도구 결과는 빼고 봅니다.
- auto mode classifier는 사용자 hook이 아니라 내장 permission 단계입니다. PreToolUse hook의 결정은 permission 규칙을 건너뛰지 못합니다.
- `/goal`은 prompt-based Stop hook이고, 턴이 끝날 때 작은 모델이 Not yet met · Met · Impossible로 판정합니다. 공식 문서가 둘을 직접 대비합니다. auto mode는 도구마다 묻는 일을, `/goal`은 턴마다 묻는 일을 없애고 서로 보완합니다.
- Xu 2026과 Weng 2026도 권한과 결과 확인을 다른 항목으로 셉니다. 위키 verifier 개념 페이지는 output, action, trajectory를 판정하는 넓은 뜻의 judge로 묶습니다(중).
- 겹치는 곳: auto mode는 sub-agent가 끝난 뒤의 작업과 최종 보고도 검사합니다. 결과를 보는 판정이라 verification과 겹칩니다(해석).

정리: 공통점은 "일하는 모델과 분리된 판정자"이고, 차이는 판정 시점과 실패했을 때의 처리입니다. 슬라이드 표현 후보는 "판정자(judge) = 실행 전 gate(permission) + 실행 뒤 check(verification)"입니다.

### 추가 질문: 둘 다 hook으로 구현된 것 아닌가 (2026-11-24)

사용자 질문: auto mode classifier든 verifier든 특정 단계에서 검증 모델을 부르는 hook으로 구현된 것 아닌가.

- "루프의 정해진 지점에 끼운 판정"이라는 넓은 뜻의 hook이라면 맞습니다. classifier는 도구 실행 전 지점에서, `/goal` 판정은 턴이 끝난 지점에서 모델을 부릅니다.
- Claude Code 설정의 hook이라는 좁은 뜻이라면 일부만 맞습니다. `/goal`은 prompt-based Stop hook이 맞지만(강), auto mode classifier는 공식 문서상 permission 규칙 다음에 도는 내장 단계라 hook 설정으로 끄거나 바꾸지 못합니다(강). 사용자가 직접 붙이는 verifier는 prompt hook이나 agent hook으로 붙입니다(강, 아래 "판정 모델을 붙이는 방법").
- 발표에서는 넓은 뜻을 쓰면 됩니다: "hook 지점에서 판정 모델을 부르는 패턴". 다만 auto mode classifier가 내장 단계라는 점은 각주로 남깁니다. 이렇게 보면 Verification을 hook 섹션 안의 "결과 판정"으로 묶는 사용자 안과 앞의 판정자 표가 같은 그림이 됩니다.

### 판정 모델을 붙이는 방법 (ai-wiki 요청 13)

- Claude Code settings hook의 handler는 다섯 종류입니다: command, http, mcp_tool, prompt, agent(강). prompt는 모델에 한 번 물어 판정하고, agent는 Read, Grep, Glob 같은 도구를 쓰는 sub-agent가 조건을 확인합니다(agent는 문서상 experimental).
- 공식 문서의 예: Stop에 prompt hook으로 "모든 작업이 끝났는지" 판정, Stop에 agent hook으로 "단위 테스트가 모두 통과하는지" 실행해 확인(강). 입력만으로 판정할 수 있으면 prompt, 코드베이스의 실제 상태를 봐야 하면 agent를 쓰라고 합니다. 같은 prompt hook을 PreToolUse(승인)와 Stop(완료) 양쪽에 쓸 수 있습니다.
- auto mode classifier는 PreToolUse hook과 같은 시점(도구 실행 전)이지만 문서가 다른 pipeline으로 설명합니다. permission 판정 순서 안의 단계이고, hook은 permission을 넓히는 확장입니다(강).
- 다른 하니스: Codex Guardian, Hermes의 smart 승인과 /goal judge는 내장 단계이고, opencode의 /goal reviewer는 plugin hook입니다(강).

| 판정자 | 시점 | 붙이는 방법 |
|---|---|---|
| auto mode classifier(Claude Code), Guardian(Codex), smart 승인(Hermes) | 도구 실행 전 | 내장 단계 |
| `/goal`(Claude Code, opencode) | 턴이 끝날 때 | hook (prompt hook, plugin hook) |
| 사용자 verifier(Claude Code) | Stop 등 | prompt · agent hook |
| verifier sub-agent | 작업 뒤 | 주 에이전트가 sub-agent로 호출 |

결정(2026-11-24, 사용자): 넓은 뜻의 hook으로 묶습니다. Controls와 Goal Loop를 "Hook: Controls · Verification"(44~51쪽) 한 섹션으로 합치고, 첫 장(44쪽 Hook 판정 구조)에 판정 지점(실행 전, 멈추기 전) × 판정자(규칙, 모델, 사람) 표와 판정 모델을 붙이는 세 방법을 둡니다. Sandbox는 hook이 아닌 실행 환경의 제어라 섹션 안에서 "Controls · Sandbox"로 표시합니다. 3쪽의 L2(Verification, Control)는 개념으로 그대로 두고, 이 섹션이 둘을 구현하는 자리입니다. 29쪽의 대응 쪽 번호와 목차도 맞췄습니다.

슬라이드 문구 후보: "판정 모델을 붙이는 방법은 셋: 내장 단계, hook, sub-agent 호출". 이 표를 넣으면 사용자 안(hook 섹션에 묶기)으로 가더라도 auto mode classifier와 sub-agent 호출을 정확히 적을 수 있습니다.

근거 주의: Claude Code 내장 verification agent가 주 에이전트의 sub-agent로 불린다는 내용과 그 판정 형식은 유출된 소스를 분석한 원천(중)에만 있습니다. 발표에는 쓰지 않고, 50쪽 출처에서도 뺐습니다.

## 변경 이력

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
