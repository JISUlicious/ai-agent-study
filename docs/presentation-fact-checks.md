# 발표 슬라이드 사실 확인 기록

[presentation-slides.md](presentation-slides.md)의 발표 슬라이드(`ai-agent-slides.html`)에 쓴 사실을 확인한 기록입니다. 근거 강도(강·중·약)는 확인해 준 세션(ai-wiki, analysis-docs)이 매긴 값입니다. 쪽 번호는 각 절을 적은 날의 기준입니다.

## 사실 확인 결과 (ai-wiki 요청 11, 2026-11-24)

근거 강도는 ai-wiki가 매긴 값입니다. 확인된 장은 "확인 중" 표시를 지웠습니다.

| 쪽 | 확인된 내용과 반영 |
|---|---|
| 11 | WebGPT 원문 Table 1의 명령(Search, Clicked on link, Find in page, Quote, Scroll, Top, Back, End: Answer). 환경이 Bing으로 검색하고 페이지를 텍스트로 바꿔 매 스텝 상태 요약을 줌. 명령 형식은 사람 시연으로 학습(강) |
| 13 | Qwen3.5 기본 템플릿의 문구와 `<function=…><parameter=…>` 형식(강, Li 2026 부록 인용). Qwen3과 Qwen2.5는 `<tool_call>` 안에 JSON(중) |
| 15 | awesome-mcp-servers 2,213개, 24개 카테고리(강, Gao 2026 부록). 슬라이드에는 카테고리 이름을 원문대로 씀 |
| 25, 27 | Kojima 2022 GSM8K 10.4% → 40.7%, Wei 2022(강). Claude Code plan mode와 Tasks(강) |
| 30 | Anthropic 글의 "attention budget"과 n² 관계, 학습 길이를 넘는 위치, KV cache의 메모리와 지연(강·중). "attention dilution"이라는 말은 위키에 없어 "Attention budget"으로 바꿈 |
| 31 | Liu 2023의 설정(다중 문서 QA, 문서 10~30개)과 결과(U자, 중간이 문서 없을 때보다 낮기도 함, 문서를 늘려도 1~1.5%만 오름)(강). Chroma context rot 보고서는 위키에 없어 쓰지 않음 |
| 32, 33 | 글 날짜 2025-09-29, 그림 대체 텍스트와 캡션(중), 대상(system instructions, tools, MCP, 외부 데이터, message history)과 핵심 문장(강). 그림 안의 상자 구성은 이미지라 확인되지 않아 글의 설명으로 다시 그림 |
| 36, 37 | Agent Skills spec: SKILL.md 필수, scripts·references·assets 선택, 3단계 progressive disclosure(약 100 토큰, 5,000 토큰 미만 권장, 필요할 때만)(강) |
| 40 | stdio와 Streamable HTTP(강), host는 한 문장에만 나옴(중) |
| 44 | Replit 운영 DB 삭제(약, 참고문헌 제목만), 이메일 200통 이상 삭제와 compaction이 지시를 누락한 원인(중, Raj 2026) |
| 45 | Claude Code(Seatbelt, bubblewrap), Codex(Seatbelt, bubblewrap과 seccomp, Landlock은 레거시), OpenHands(Docker 등), devcontainer 방화벽, deny → ask → allow 규칙(강) |
| 47 | Ralph(2025-07-14)부터 제품별 /goal(2026)까지의 계보, Claude Code /goal이 Stop hook을 감싼 것(강) |
| 48 | Claude Code 문서의 gather context, take action, verify results, Zhang 2026의 새 context critic(강). Claude Code 내장 verification agent의 세부(PASS·FAIL·PARTIAL 판정)는 유출된 소스를 분석한 원천에만 있어 2026-11-24에 슬라이드에서 뺌 |
| 49 | Building Effective AI Agents(2025)의 centralized(supervisor)와 decentralized(swarm)(강) |
| 50 | sub-agent가 1,000~2,000 토큰 요약만 돌려줌(강, Anthropic context engineering 글) |
| 52 | 개발(Claude Code, Codex CLI, Cursor), 디자인(Frontier Design Benchmark, 그래픽스 에이전트 서베이), 데이터 분석(AutoData 등), 연구(deep research)(강·중) |

위키에 근거가 없던 MCP 세부(41, 43쪽)는 MCP와 Skills를 스터디한 analysis-docs 세션이 MCP 스펙 원문으로 확인했습니다. 이로써 2026-11-24에는 "확인 중" 표시가 모두 없어졌습니다.

### ai-wiki 요청 15 (2026-11-25): 16쪽 Tool call 반복 실패

16쪽의 근거입니다. 초안의 궤적과 수치는 기억에 기대어 썼고, 아래 답으로 고쳤습니다. 위키 원문(ReAct PDF 추출본)의 Figure 1 글자는 폰트 인코딩이 깨져 있어, ai-wiki가 디코딩해 읽었습니다. 그 과정에서 띄어쓰기, 숫자, 구두점이 지워졌습니다.

확인된 것:

| 항목 | 확인 내용 | 근거 강도 | 슬라이드 반영 |
|---|---|---|---|
| 궤적 흐름 | 행동 다섯과 관찰 다섯이 초안과 같은 순서(서랍으로 감 → 닫힘 → 엶 → sinkbasin으로 감 → peppershaker를 집으려다 "Nothing happens" 두 번) | 강 | 그대로 |
| 행동 대소문자 | 그림의 행동은 "Go to", "Open", "Take"처럼 대문자로 시작 | 중 | 대문자로 고침 |
| 과제 문장 | 디코딩 결과 "Your task is to Put some pepper shaker on a drawer". "Put"은 대문자, 콜론은 확인 못 함. 부록 프롬프트 형식은 "Your task is to: put …"(강). 원문 그림으로 "Your task is to: Put some pepper shaker on a drawer."임을 확인(아래) | 중 → 강 | "Your task is to: Put …"로 고침 |
| 번호 | 본문이 "sinkbasin 1", "peppershaker 1"을 씀. 붙여 쓴 "peppershaker"도 본문과 부록에서 확인 | 강 | 그대로 |
| 성공률(Table 3) | ALFWorld 전체: Act(best of 6) 45, ReAct(평균) 57, ReAct(best of 6) 71, ReAct-IM 48/53, BUTLER 37. 6번의 통제 실험 모두 ReAct가 앞서고 상대 향상은 33~90%(평균 62%) | 강 | "Act 45% · ReAct 71% (6번 시도 중 최고)" |
| WebShop(Table 4) | Score/SR: Act 62.3/30.1, ReAct 66.6/40.0, IL 59.9/29.1, IL+RL 62.4/28.7, 사람 전문가 82.1/59.6 | 강 | 쓰지 않음 |
| HotpotQA Act-only | Search[Apple Remote] → Search[Front Row](Could not find) → Search[Front Row (software)] → Finish[yes]. 본문: 궤적 위에서 복잡한 추론이 필요해 맞는 마지막 행동을 내지 못함 | 강 | 쓰지 않음 |
| 실패 이유 원문 | "without any thoughts at all, Act fails to correctly decompose goals into smaller subgoals, or loses track of the current state of the environment." 그리고 "fails to comprehend from the context that sinkbasin 1 does not contain peppershaker 1, thus keep producing hallucinating actions." | 강 | 설명 문장을 "환경의 현재 상태를 놓쳐"로, 옆 알약을 "Hallucinating action"으로 맞춤 |

위키로 확인하지 못한 것: 그림의 다른 번호(drawer 1, dishsponge 2·3, spoon 1·2, spatula 1)와 과제 문장의 콜론, 마침표, "pepper shaker" 띄어쓰기. ai-wiki는 원 PDF의 Figure 1로 최종 확인하라고 권했습니다.

원문 그림 확인(2026-11-25, 사용자 승인 "확인 진행"): 위키에 없는 내용이라 사용자에게 묻고 웹에서 원문을 봤습니다. arXiv 2210.03629의 HTML판(ar5iv)에 실린 Figure 1(SVG, 글자가 도형으로 되어 있어 텍스트로는 못 뽑음)을 크게 키워 눈으로 읽었습니다.

- 과제 문장은 "Your task is to: Put some pepper shaker on a drawer."입니다. 콜론과 마침표가 있고, "Put"은 대문자, "pepper shaker"는 띄어 씁니다.
- 궤적의 번호는 슬라이드와 모두 같습니다: drawer 1, dishsponge 2, spoon 1, sinkbasin 1, dishsponge 3, spatula 1, spoon 2, peppershaker 1. Obs 2 원문은 "You open the drawer 1. The drawer 1 is open. In it, you see a dishsponge 2, and a spoon 1."이고, 슬라이드는 가운데 문장을 "…"로 줄였습니다.
- 그림은 Obs 4와 Obs 5의 "Nothing happens."와 함께 되풀이한 Act 5 "Take peppershaker 1 from sinkbasin 1"도 빨갛게 칠합니다. 슬라이드도 Act 5를 같은 포인트 색으로 칠했습니다.
- 이로써 16쪽의 "확인 중" 표시를 지웠습니다. 지금 "확인 중"인 장은 없습니다.

주의(ai-wiki): "같은 행동을 반복한다"는 문장은 논문에서 Act의 설명이 아니라 ReAct 자체의 실패 유형으로 나옵니다. "the model repetitively generates the previous thoughts and actions … fails to … jump out of the loop", HotpotQA 오류 분석에서 "Reasoning error (including failing to recover from repetitive steps)"가 ReAct 실패의 47%, CoT 실패의 16%입니다. 그래서 슬라이드에 "ReAct가 반복 문제를 해결했다"고 쓰면 원문과 어긋납니다. 16쪽은 Act-only의 실패 원인(생각이 없어 상태를 놓침)과 성공률 차이만 말하고, ReAct가 반복을 없앤다고는 쓰지 않았습니다.

반복 호출에 대한 하니스 대응(ai-wiki 하니스 코드 조사, 따로 적은 곳 말고는 강):

- OpenHands `stuck_detector.py`: 같은 행동과 관찰 반복(4회), 같은 행동과 오류 반복(3회, 먼저 한 번 알림), monologue, 행동과 관찰의 번갈아 반복, context 창 오류 루프. 상태 머신에 STUCK 상태가 있음
- Cline: 같은 도구 호출 서명 3번이면 경고, 5번이면 단계를 높임. 연속 실수 제한은 코어 6번, CLI 3번
- Goose: RepetitionInspector가 같은 호출의 반복을 거부
- OpenClaw: repeat guard가 같은 호출 20번째에서 멈춤. before_tool_call 래퍼의 loop detection
- Claude Code: /goal에서 도구 사용 없이 여러 턴이 이어지면 멈추는 no-progress guard(공개 문서, 중)
- 없음: opencode("No repeated-call ("doom loop") detector was found", 예전 doom_loop 권한은 V2에서 사라짐), Codex CLI(stuck detection과 같은 호출 방지 없음, 턴 상한 없이 비용 예산만)
- 참고: [agent-components-implementation.md](agent-components-implementation.md)의 보급 표는 opencode와 Codex의 Loop guards를 ●로 둡니다. 그 칸은 MC의 "Loop guards and error recovery"라 재시도와 failover도 포함하므로 어긋나지는 않지만, 반복 호출 감지만 보면 두 하니스에는 없습니다.

ai-wiki의 구성 제안(해석): Act-only의 "Nothing happens" 반복 → ReAct(생각을 넣어 상태를 다시 읽음) → 그래도 남는 반복은 하니스가 stuck detector로 막음. 근거가 모두 위키에 있어 뒤 장(Agent loop나 Hook)에 이어 붙일 후보로 남깁니다.

### ai-wiki 요청 16 (2026-11-25): 13쪽 Qwen3.5 템플릿 원문

사용자가 13쪽 출력 예시가 템플릿과 다르다고 지적했습니다. 요청 11에서는 문구와 `<function=…><parameter=…>` 형식만 확인했고, 형식 예시의 줄바꿈은 따로 보지 않았습니다. 출력을 값이 따로 줄에 오는 형태로 고친 뒤 원문을 물었습니다.

근거는 Li 2026(PARSER) 부록 E.1 "Lead Agent Prompt"입니다. 부록은 "We use the default tool call function template of Qwen3.5"라고 적습니다. 공식 Qwen chat_template 원문은 위키에 없습니다.

| 항목 | 확인 내용 | 근거 강도 | 슬라이드 |
|---|---|---|---|
| 형식 예시 | "If you choose to call a function ONLY reply in the following format with NO suffix:" 다음에 `<tool_call>`, `<function=example_function_name>`, `<parameter=example_parameter_1>`, `value_1`, `</parameter>` … `</function>`, `</tool_call>`이 줄마다 따로 옴. 값은 여는 태그 다음 줄, `</parameter>`도 따로 된 줄 | 강 | 출력을 같은 줄 구조로 고침 |
| 고친 출력 | 형식 예시와 줄 구조가 같음 | 강 | 그대로 |
| `<tools>` 표기 | `# Tools`, `You have access to the following functions:`, `<tools>` 다음에 `{"type": "function", "function": {"name": …, "description": …, "parameters": {…}}}` JSON. Qwen3-Coder식 XML이 아님. 실제 템플릿이 한 줄로 넣는지는 위키에 없음(부록은 보기 좋게 줄을 나눔, 중) | 강 | 그대로(JSON 한 줄) |
| Reminder | `<IMPORTANT> Reminder:` 다음에 네 줄(형식을 지킬 것, 필수 인자, 설명은 호출 앞에만, 호출할 함수가 없으면 평소처럼 답할 것), `</IMPORTANT>` | 강 | "`<IMPORTANT> Reminder: …`"로 줄임 |
| assistant 시작 뒤 | Qwen3.5가 기본으로 `<think>`를 붙이는지는 위키에 없음. 부록의 예시 궤적은 `<think> … </think>` 뒤에 호출이 오지만, 호출을 JSON으로 다시 써 템플릿의 출력 형식과 달라 쓰지 않음 | 중·없음 | 출력은 호출만 보임 |

이 답으로 13쪽의 "확인 중"을 지웠고, 출처 칸을 "Li 2026 부록 E.1 인용"으로 구체화했습니다. 처음에는 입력 블록을 "(요약)"으로 두고 형식 예시와 Reminder를 "…"로 줄였으나, 사용자 요청으로 입력 블록을 형식 지시 부분의 원문으로 바꿨습니다([presentation-slides.md](presentation-slides.md)의 "구현 방식"). 이어서 사용자가 실제 chat template의 문자열을 주어, 슬라이드는 이 표의 부록 인용이 아니라 그 원문을 따릅니다. 부록 인용은 줄바꿈(둘째 parameter 값을 두 줄로, "<IMPORTANT> Reminder:"를 한 줄로)과 항목 끝 마침표가 원문과 다릅니다. 위키 원문이 논문 부록이라 생긴 차이로 보입니다.

### ai-wiki 요청 17 (2026-11-25): 11쪽 RAG 검색 방식

사용자 제안으로 Tool Use 첫머리(11쪽)에 일반 RAG와 동적 검색을 비교하는 표를 넣었습니다. 이후 사용자 요청으로 11쪽은 질의 기반 RAG 흐름만 남겼고(2026-11-25), 아래 결과는 동적 검색 사례의 기록으로 둡니다. 표의 사례는 기억에 기대어 썼고, ai-wiki가 행별로 위키 원문과 대조했습니다. 여섯 행 모두 큰 틀은 맞았고, 아래처럼 고친 뒤 "확인 중"을 지웠습니다.

| 행 | 확인 내용 | 근거 강도 | 슬라이드 반영 |
|---|---|---|---|
| 질의 기반 RAG | Lewis 2020: retriever(DPR, Wikipedia 밀집 색인)가 입력 x로 상위 K개 문서를 찾고 생성기는 (x, z)를 조건으로 출력. RAG-Sequence와 RAG-Token | 강 | 그대로, 예는 "RAG (2020)" |
| 생성 중 검색 | FLARE(Jiang 외, EMNLP 2023)는 토큰 단위 생성 확신이 문턱 아래로 떨어지면 검색. 위키에 원문은 없고 다른 논문의 인용만 있음. "미리 만든 다음 문장을 검색어로"는 위키에 없음. DRAGIN(Su 2024)은 attention 신호로 검색 시점을 정함 | 중 | 칸을 "토큰 확률 · attention으로 검색 시점을 정함"으로 줄이고 예에 DRAGIN(2024)을 더함 |
| 검색 판단 토큰 | Self-RAG는 검색과 자기 비판을 조절하는 특수 토큰을 내도록 학습. 위키 페이지는 arXiv 2310.11511(2023-10), 다른 논문은 2024(학회 연도)로 인용. reflection token 이름은 위키 텍스트에 없음 | 중 | 예를 "Self-RAG (arXiv 2023)"로 |
| 추론과 번갈아 검색 | IRCoT(Trivedi 외, ACL 2023, arXiv 2022)는 CoT 각 단계로 다음 검색어를 이끎. 문장 단위, 일정 간격 검색 | 강(문장 단위는 중) | 그대로 |
| 도구 호출 검색 | WebGPT는 Search를 Bing API로 보냄, ReAct는 search[entity], lookup[string], finish[answer], Toolformer는 다음 토큰의 perplexity를 줄이는 API 호출만 남기는 자기지도 학습. Search-R1(Jin 2025)은 결과 보상만으로 RL 학습해 추론 중 검색을 여러 번 부름(7개 QA에서 RAG 대비 평균 +41%, 7B) | 강 | 예에 Search-R1(2025)을 더함 |
| Agentic search | 위키 개념 페이지: "the in-loop variant of retrieval-augmented generation", "Retrieval as a tool call, not a pipeline stage"(용어 출처 Sen 2026). Claude Code는 초기 RAG와 벡터 색인 대신 agentic search가 낫고 단순하다는 Boris Cherny 발언(2025-02 HN, 2025 Latent Space, 2026-02 X). 색인을 안 쓰는 이유는 코드 변경과 어긋남, 보안 위험. deep research는 중 | 강 | 행 이름을 확립된 용어 "Agentic search"로 |

위키에 없는 것: RAG 서베이(Gao 2023)의 iterative · recursive · adaptive 3분류. 가까운 것은 Guo 2026이 IRCoT, FLARE, Self-RAG를 "Iterative retrieval methods"로 묶은 것과 Wei 2026의 "adaptive and iterative mechanisms"입니다. 그래서 표의 여섯 갈래는 "분류는 발표자 정리"로 둡니다.

위키에 있는 다른 사례(쓰지 않음): Adaptive-RAG(질의 난이도로 검색 전략을 고름), Iter-RetGen(직전 출력을 다음 검색 context로), Probing-RAG(hidden state로 검색 여부 판단), CRAG, HippoRAG2, GraphRAG(검색 시점보다 품질과 구조 쪽).

동적 검색의 이점과 한계(발표에서 말로 보탤 수 있는 근거):

- 이점: Search-R1 평균 상대 향상 +41%(Qwen2.5-7B), +20%(3B)(강). Guo 2026 ReaLM-Retrieve는 MuSiQue F1 71.2%(평균 검색 1.8회)로 IRCoT 65.4%(3.4회)보다 높고, "fewer, better-timed retrievals"가 잦은 검색보다 낫다고 씀. 고정 간격 대비 검색 호출 47% 감소(강)
- 한계: 고정 간격 검색(IRCoT)은 긴 추론에서 비용이 매우 큼(검색 한 번 2~5초). FLARE와 DRAGIN은 토큰 확률이나 attention이 필요해 o1 같은 완성형 모델에는 못 씀(Guo 2026, 강). ReAct 실패의 23%는 검색 결과가 비거나 쓸모없어 추론이 흔들린 경우(강). 같은 모델과 검색기라도 하니스에 따라 약 20점 차이(Sen 2026, 강)
- 반대 근거: 대화 기억 과제에서 단순 RAG가 복잡한 agentic memory를 이김. 차이는 검색 범위에서 났고 찾은 정보의 활용률은 비슷했음(Bao 2026, 강)

### ai-wiki 요청 18 (2026-11-25): context window 크기를 정하는 구조적 요인

사용자 질문: 33쪽 Transformer 구조 한계에서, 128K, 512K, 1M처럼 모델의 토큰 한계 자체를 정하는 구조적 특징이 있지 않나. 지금 33쪽은 O(n²) attention, 학습 길이를 넘는 위치, KV cache, attention budget 넷을 적습니다(요청 11 확인). 물은 것:

1. 위치 표현이 만드는 상한: 학습된 절대 위치 임베딩(표 크기가 상한), RoPE가 학습 길이를 넘으면 무너지는 이유, 길이 확장 기법(Position Interpolation, NTK-aware, YaRN, LongRoPE, RoPE base 조정, ALiBi)
2. 계산과 메모리: O(n²) 계산과 FlashAttention의 범위, KV cache 크기 공식과 128K · 1M에서의 크기, GQA · MQA · MLA
3. 학습: 짧게 사전학습한 뒤 길게 이어서 학습하는 사례와 비용
4. 광고된 창과 실제로 쓰는 길이의 차이(RULER, NoLiMa 등)
5. 상한을 넘으려는 구조 대안(sliding window, sparse, ring attention, linear attention, SSM)과 대가
6. 모델별 context 창 수치

슬라이드 반영은 답을 받고 사용자와 정합니다.

#### 답 1/2: 항목 1~3 (2026-11-25)

"서베이"는 Teng 2026의 차세대 LLM 아키텍처 서베이(2차 문헌)입니다. ai-wiki의 결론(해석, 약): 창 크기는 한 요인이 아니라 위치 표현(학습한 길이), 메모리(KV cache가 GPU에 들어가는가), 연산(prefill의 n²), 학습 데이터와 비용이 겹쳐 정합니다. 광고된 창은 대개 "짧게 사전학습 → RoPE 조정과 긴 길이 추가 학습 → 필요하면 YaRN 배율"의 결과입니다.

1. 위치 표현
   - 학습형 절대 위치 임베딩은 설정한 최대 위치까지만 벡터가 있어 확장 장치 없이는 그 너머를 못 다룸(강, 서베이, 예: BERT, GPT-2, GPT-3). GPT-2는 "512에서 1024로 늘렸다"까지만 있고 1024를 표 크기 상한과 잇는 문장은 없음. BERT는 attention 비용 때문에 학습의 90%를 길이 128로, 10%를 512로 하며 512 단계는 위치 임베딩을 배우기 위한 것(강)
   - RoPE는 표 상한이 없지만 학습 길이를 넘으면 빠르게 도는 차원이 못 본 각도 조합에 들어가 attention이 "sharply" 나빠짐(중). 길이 일반화는 "fundamental challenge"(강, 서베이)
   - 확장 기법(대부분 강): Position Interpolation(긴 위치를 학습 범위로 선형 축소, 가까운 위치 해상도도 뭉개짐), NTK-aware · ABF(RoPE base를 키움, 예: Qwen3.8의 rope_theta 10,000,000), YaRN(파장별 보간과 온도 보정, Qwen3.8은 262,144 × 4.0 = 1,048,576, DeepSeek-V2는 4K → 128K, 정적 YaRN은 짧은 입력 품질도 떨어뜨림), LongRoPE(파인튜닝 없이 8배, 256K 파인튜닝 뒤 2048K), LongLoRA(7B를 머신 한 대로 100K), DCA(Qwen2가 YaRN과 함께 128K), ALiBi(거리 비례 페널티, 짧게 학습하고 길게 테스트, 몇 배까지인지는 위키에 없음)
   - 확장의 한계: "Scaling makes long positions *representable*. It does not make them *usable*"(중). 확장 뒤 사소한 아키텍처 선택이 겹치면 성능이 상대 최대 47% 떨어지고 loss에는 드러나지 않음(R²=0.06, Bertsch 2026, 강)
2. 연산과 메모리
   - self-attention O(n²·d)(원조 Transformer, 강). prefill attention O(T²dL), 디코딩은 단계마다 선형이지만 KV cache가 커짐(서베이). Llama-3-8B, A100 한 장에서 300K 토큰 prompt 6분, 1M 30분, attention이 prefill 지연의 90% 이상(MInference, 강)
   - FlashAttention은 FLOPs가 아니라 메모리 이동을 줄임: GPT-2 medium 길이 1024에서 표준 66.6 GFLOPs · HBM 40.3 GB · 41.7 ms, FlashAttention 75.2 GFLOPs · 4.4 GB · 7.3 ms("The win is IO, not FLOPs", 강). attention 메모리는 제곱에서 선형으로(중)
   - KV cache: 토큰당 = Σ층(2 × KV head 수 × head 차원), 전체 = 토큰당 × 길이 × 배치 × 바이트(중). FP16 토큰당 Llama-2-7B 512 KiB, Llama-3-8B 128 KiB, Llama-3-70B 320 KiB. KV cache가 가중치보다 커지는 길이는 Llama-2-7B 약 25.7K, Llama-3-8B 약 122K. LLaMA-7B 128K는 fp16 64 GB(3비트 12.0 GB), 10M 토큰은 fp16 4,882.8 GB(KVQuant, 강). Llama-3-8B의 128K · 1M 값은 위키에 없고 공식으로 약 16 GiB · 128 GiB(약, 추론)
   - MQA는 KV cache를 head 수만큼 줄이고 디코딩 약 12배(Shazeer 2019, 강). GQA는 H/G배(T5-XXL GQA-8 품질 47.1 · 추론 0.28, MHA 47.2 · 1.51), 길이 확장 뒤 HELMET −3.4점(Bertsch). MLA는 압축 latent(512차원)와 RoPE key(64차원)만 캐시(DeepSeek-V2, 강)
3. 학습
   - 대부분의 dense 모델은 사전학습 뒤 RoPE base를 바꿔 이어서 학습해 길이를 늘림(Bertsch 2026, 강). 예: 140B 토큰 사전학습 뒤 10B 토큰으로 64K
   - 사례(강): DeepSeek-V2 4K → 128K(YaRN), NSA 32K 추가 학습 + YaRN, Kimi K3는 NoPE로 8K → 64K → 256K → 1M 단계별. Llama 3.1은 8K 사전학습과 128K 지원만 있고 단계 레시피는 위키에 없음(중). Qwen2.5-1M은 위키에 없음
   - 깨끗한 긴 문서는 드물고 비싼 학습 자원(강). 긴 길이 추가 학습의 비용 수치는 위키에 없음

#### 답 2/2: 항목 4~6 (2026-11-25)

4. 광고된 창과 실제로 쓸 수 있는 길이
   - "실제 길이 = 광고된 길이의 X%" 같은 수치는 위키에 없음(RULER 모델별 표, NoLiMa 본문, Fiction.LiveBench, Chroma context rot 보고서 없음)
   - Gemini 1.5 보고서(강): needle 하나 재현율 530K까지 100%, 1M 99.7%, 10M 99.2%. needle 100개를 한 번에 찾으면 128K까지 약 70%, 1M까지 60% 이상. GPT-4 Turbo는 자기 한도 128K에서 평균 약 50%, Claude 2.1은 200K에서 98%
   - Lost in the Middle(강): "Extended-context models often score the same as their shorter-context versions". Gollapudi 2026(강): 문서를 500개에서 10k개로 늘리면 정답 문서로 가는 attention 비중이 0.91에서 0.01로, 1M 토큰에서 MS MARCO Recall@1 0.2%, NIAH를 거의 만점 받은 모델도 실제 검색에서 급락. BABILong(강): 사실 하나는 128K · 256K에서 100%지만 사실 셋을 엮는 과제는 16K부터 0에 가까움
   - NIAH 통과는 약한 근거(중). RULER는 검색과 QA는 버티지만 집계 과제에서 무너짐(중). Anthropic: "A window that accepts N tokens does not use all N equally well", 절벽이 아니라 기울기(중)
5. 구조 대안과 대가
   - Sliding window(중): Mistral은 창 4096이 층을 거쳐 약 131K까지 닿음. 학습 때 안 쓴 모델에 추론 때만 씌우면 무너짐(Llama-2-7B perplexity 9.59 → 3,359.95). SWA + GQA는 −9점(Bertsch, 강)
   - 학습 없이 쓰는 sparse attention(중): 줄일 수 있는 것은 attention 몫뿐(10K에서 약 ¼, 128K에서 70~80%). MInference는 1M에서 10배 빠르지만 짧은 길이에서는 느리고, KV 검색 과제가 무너진 사례. 학습형(중): NSA 64K에서 커널 9배, MoBA 1M에서 6.5배, DSA(DeepSeek-V3.2)는 query마다 상위 2,048 토큰만 보고 약 1T 토큰 추가 사전학습 필요. Ring attention은 위키에 없음
   - Linear attention과 SSM(강·중): 계산 O(N), 상태 메모리 고정이라 정확한 재현과 복사가 약함("a fixed-size state has finite capacity, so it must overwrite"). Gated DeltaNet 실제 검색 30.6 대 Transformer 37.0 등 1차 출처가 같은 약점을 보고. 하이브리드는 attention 층 약 10%가 최적이라는 보고, 너무 적으면(15:1) 순수 attention보다 나쁨. Jamba 256K KV 4 GB 대 Mixtral 32 GB
   - StreamingLLM(강): 4M 토큰까지 perplexity 안정이지만 "does not extend the models' context window", 밀려난 토큰은 사라짐. Titans(중)는 테스트 시점에 갱신하는 메모리로 2M 토큰 넘어서도 포화 안 됨
6. 위키에 있는 모델별 창: GPT-4 8K → 32K, GPT-4 Turbo · GPT-4o 128K, GPT-5.4-mini 400K. Claude-1.3 100K, Claude 3.x 200K, 4.x부터 1M 변형, Sonnet 5.5 1M(출력 최대 128K). Gemini 1.0 32K, 1.5 기본 128K에서 1M · 2M, 연구용 10M. Llama 3.1 128K. Qwen3.8-Flash-Next 학습 창 256K, 1M은 YaRN ×4를 켜야 함, Qwen2.5-32B 128K, Qwen3-4B 40,960. DeepSeek-V2 128K, V3.2 128K 학습. Kimi K3 · GLM-5.2 1M, Solar Mini 4 512K, Jamba 공개 256K(학습 1M), Mistral 7B 8K, Gemma 3 128K 이상. 위키에 없음: GPT-4.1 1M, Llama 4 Scout 10M, MiniMax-01 4M, Gemini 2.5 · 3, Qwen2.5-1M

사용자 질문과 답(2026-11-25, 해석): "KV cache, prefill 연산, 긴 문서 학습은 기능적으로 창을 제한하지 않고, 사실상 학습 단계의 positional encoding이 창을 정하나?" 기능적 상한에 대해서는 대체로 맞습니다. 다만 세 가지를 보탭니다. (1) 정확히는 위치 표현 자체보다 "학습 때 본 길이"가 상한입니다. 학습형 절대 위치는 표 크기가 딱딱한 상한이고, RoPE는 계산은 되지만 학습 길이를 넘으면 무너지는 부드러운 상한이며, 위치 인코딩이 없는 NoPE 모델(Kimi K3)도 8K → 1M 단계별 학습으로 창이 정해집니다. (2) 긴 문서 학습은 따로 떼어진 요인이 아니라 그 길이를 만드는 과정입니다. RoPE 조정이나 YaRN도 대부분 긴 길이 추가 학습과 함께 씁니다. (3) KV cache와 prefill 연산은 모델이 못 하게 막지는 않지만, 학습 길이를 얼마나 늘릴 수 있는지(학습에도 n² 연산과 메모리가 듦)와 서비스가 받아 주는 창을 정합니다. 예로 Gemini 1.5는 연구에서 10M까지 needle 99.2%였지만 제품 창은 128K에서 1M · 2M이었습니다(차이의 이유는 위키에 없음, 비용과 지연은 추정). 그래서 창은 "학습한 길이(기능적 상한) ⊇ 제품이 받아 주는 창(비용) ⊇ 잘 쓰는 길이" 세 겹으로 설명하는 편이 정확합니다.

이어진 질문(2026-11-25): "KV cache와 prefill은 사용 단계의 문제이니, 학습한 길이 + positional encoding을 hard cap으로 봐도 되나?" 발표에서는 "모델의 상한 = 학습한 길이 + 위치 표현(확장 포함)", "사용 단계의 제약 = KV cache 메모리와 prefill 시간"으로 나눠도 됩니다(해석). 단서 셋: 말 그대로 딱딱한 상한(그 너머는 계산 불가)은 학습형 절대 위치뿐이고, RoPE 계열은 계산은 되지만 성능이 무너지는 상한입니다. 사용자가 실제로 부딪히는 딱딱한 한도는 서비스가 정한 최대 입력 길이입니다. 상한은 사전학습 뒤에도 위치 배율과 짧은 추가 학습으로 옮길 수 있습니다(YaRN, LongRoPE는 파인튜닝 없이 8배). 연산과 메모리는 학습 때도 들어 학습 길이를 얼마나 늘릴지에 간접적으로 영향을 줍니다.

슬라이드 반영(2026-11-25, 사용자 의견): 33쪽을 "Attention budget → 품질 저하"와 "학습 길이 → Context window 상한" 두 칸으로 다시 쓰고, KV cache와 prefill은 "사용 단계 비용" 한 줄로 둠. 예시 "256K → 1M"은 Qwen3.8(YaRN ×4, 강).

ai-wiki의 슬라이드 제안(해석): 33쪽에 "창 크기는 어떻게 정해지나"(짧게 사전학습 → RoPE base 조정 + 긴 길이 추가 학습 → YaRN 배율, 예: Qwen3.8 256K → 1M)와 "광고된 창 ≠ 실제로 쓰는 창"(Gemini 1.5 needle 1개 99.7% 대 100개 약 60%, Lost in the Middle)을 보탬. 위키에 수치가 없는 모델은 외부 확인 전에는 쓰지 않음.

### ai-wiki 요청 19 (2026-11-25): 28쪽 CoT 프롬프트 예시 후보

사용자 요청: 28쪽 CoT 프롬프트의 지어낸 예시(책 15권 문제) 말고 다른 예시를 찾아 달라. 물은 것: Wei 2022 Figure 1(구내식당 사과 문제, 표준 프롬프트 오답과 CoT 정답), Kojima 2022 Figure 1(저글러 문제, "Let's think step by step"), Planning으로 이어지는 변형(Plan-and-Solve, Least-to-Most, Self-consistency, Tree of Thoughts)의 문구와 예시, 수학 밖 영역의 예시, 결과 수치.

답(원문 문구는 위키에서 그대로 확인):

| 후보 | 내용 | 대비 | 수치 | 근거 |
|---|---|---|---|---|
| A. Wei 2022 Figure 1 | few-shot 예시(Roger의 테니스공 5 + 2캔 × 3 = 11) 뒤 구내식당 사과 문제(23개, 20개 사용, 6개 삼). 표준 프롬프트 출력 "The answer is 27."(오답), CoT 출력 "… 23 - 20 = 3 … 3 + 6 = 9. The answer is 9."(정답) | 있음 | PaLM 540B GSM8K 17.9 → 56.9. SVAMP 69.4 → 79.0, MAWPS 79.2 → 93.3 등 | 강 |
| B. Kojima 2022 Figure 1 | 저글러 공 16개, 반이 골프공, 그 반이 파란색. Zero-shot "A: The answer (arabic numerals) is" → 8(오답), Zero-shot-CoT "A: Let's think step by step." → "… 8 golf balls … 4 blue golf balls"(정답). 같은 그림에 Few-shot(8, 오답)과 Few-shot-CoT(4, 정답)까지 2×2 | 있음 | InstructGPT MultiArith 17.7% → 78.7%, GSM8K 10.4% → 40.7%(지금 출처 칸과 같은 논문). 그림의 모델은 GPT-3 | 강 |
| C. Wei 2022 Figure 3 SayCan | "How would you bring me something that isn't a fruit?" → Explanation(에너지바는 과일이 아님) → "Plan: 1. find(energy bar) 2. pick(energy bar) 3. find(user) 4. put(energy bar) 5. done()." CoT 뒤에 도구 호출 순서가 나와 Planning으로 잇는 다리 | 없음 | 없음 | 강 |

- 수학 밖 예시(Wei Figure 3, 강): 날짜 이해(06/01/1943 공연이 하루 밀림, 10일 전은 05/23/1943), StrategyQA(배는 밀도 0.6이라 물에 뜸), Last Letter Concatenation("Lady Gaga" → ya), Coin Flip. 직접 답의 오답과 나란히 보이는 대비는 없음
- Planning 계열: Plan-and-Solve 프롬프트 문구는 위키에 없고, 1.5B 모델 GSM8K에서 CoT 72.0% 대 Plan-and-Solve 70.0%라는 재현값만 있음(Mirzaei 2026). Least-to-Most 예시 문구는 위키에 없음. Self-consistency는 여러 추론 경로의 다수결(GSM8K +17.9%, StrategyQA +6.4%). Tree of Thoughts는 Game of 24에서 GPT-4 CoT 4% → 74%
- ai-wiki 추천(해석): 대비를 보이려면 A나 B, Planning으로 이으려면 C. B로 바꾸면 그림, 문구, 수치가 모두 Kojima 한 출처에서 나옴

### ai-wiki 요청 20 (2026-11-25): 수학이 아닌 CoT 예시

사용자 질문: 수학 문제가 아닌 예시는 없나, CoT 논문의 예시는 대부분 수학인가. 요청 19의 수학 밖 예시(Wei Figure 3)는 오답과 정답의 대비가 없어 다시 물었습니다.

답(근거는 모두 강, Wei 2022와 Kojima 2022 원문):

- 수학이 아닌 과제에서 "직접 답 오답 / CoT 정답"을 한 그림에 나란히 보인 예시는 두 논문에 없음. Kojima의 대비 표(Table 20)도 GSM8K 수학. 대신 원문 CoT 출력 예시(정답 표시 있음)와 정확도 수치를 함께 쓰면 대비가 됨
- Kojima Table 12의 Zero-shot-CoT 출력 예시(✓): Last Letters("Vinny Landon Miguel Caitlyn" → "ynln"), Tracking Shuffled Objects(Alice · Bob · Claire가 공을 세 번 바꿈 → Bob은 보라색 공), Date Understanding(오늘이 1973년 3/5일 때 한 달 전 → 02/05/1973). 같은 표에 CoT가 틀린 예도 있음(날짜 계산, 스퀘어 댄스, StrategyQA)
- Kojima Table 3(CommonsenseQA): 장난감 자동차 문제에서 Zero-shot은 맞고(A) Zero-shot-CoT는 추론은 그럴듯하지만 E로 틀림
- 정확도(Kojima Table 1, text-davinci-002, Zero-shot → Zero-shot-CoT, 과제별 답 추출 프롬프트 기준): CommonsenseQA 68.8 → 64.6(하락), StrategyQA 12.7 → 54.8, Date Understanding 49.3 → 67.5, Shuffled Objects 31.3 → 52.4, Last Letter(4단어) 0.2 → 57.6, Coin Flip(4번) 12.8 → 91.4. 참고로 MultiArith 17.7 → 78.7, GSM8K 10.4 → 40.7
- 정확도(Wei, PaLM 540B, 표준 → CoT): CSQA 78.1 → 79.9, StrategyQA 68.6 → 77.8, Date 49.0 → 65.3, Sports 80.5 → 95.4, SayCan 80.8 → 91.7. Last Letter(2단어) 7.6 → 99.4, 학습 분포 밖 4단어 0.0 → 63.0. Coin Flip(2번) 98.1 → 100.0(표준으로도 이미 풂)
- 평가 범위: Kojima는 산술 6(SingleEq, AddSub, MultiArith, GSM8K, AQUA-RAT, SVAMP), 상식 2(CommonsenseQA, StrategyQA), 기호 2(Last Letter, Coin Flip), 기타 논리 2(Date Understanding, Tracking Shuffled Objects). Wei는 산술 5, 상식 5(CSQA, StrategyQA, Date, Sports, SayCan), 기호 2. Date Understanding은 Wei가 상식, Kojima가 논리 추론으로 분류
- 효과가 없거나 나빠진 경우: Kojima "In commonsense reasoning tasks, Zero-shot-CoT does not provide performance gains." 단계가 하나뿐인 SingleEq · AddSub는 비슷함. Wei는 CoT를 모델 규모에서 나타나는 능력으로 보고, 작은 모델에서는 떨어짐(GPT 350M StrategyQA 20.6 → 0.9, LaMDA 420M 46.4 → 24.9). 큰 모델에서도 CSQA가 떨어진 경우(GPT-3 175B 79.5 → 73.5)
- 예시가 수학에 몰린 이유를 직접 말한 문장은 위키에 없음. 산술 데이터셋이 가장 많고(Kojima 6, Wei 5), 대표 그림이 수학이며, 상식 과제는 효과가 작거나 없었다는 사실만 있음(이유는 추론)

### ai-wiki 요청 21 (2026-11-25): Last Letter 실패 예시

사용자 질문: Last Letter도 실패 예시가 있나. 요청 20의 CoT 오답 예시(Date, Shuffled, StrategyQA)에는 Last Letter가 없었습니다.

답(근거는 모두 강, 실패 지점 풀이는 출력에서 읽은 해석):

- Kojima Table 12, "ynln" ✓ 바로 다음 예시: "Lamont Frederick Lance Esperanza"에서 Zero-shot-CoT가 끝 글자 t, k, e, a를 모두 맞게 찾고도 "tkaea"로 이어 붙여 틀림(✗, GT: tkea). 성공과 실패가 원문 표에서 위아래로 붙어 있음
- Wei 부록 Table 13(LaMDA 137B, "Examples of correct and incorrect chains of thought"): "Waldo Schmidt" → "ot" ✓, "Daniel Friedman" → "Friedman"의 끝 글자를 "m"으로 잘못 찾아 "lm" ✗(정답 ln)
- 직접 답(Zero-shot, 표준 프롬프트)의 오답 출력 예시는 두 논문 모두 위키에 없음. 수치만 있음
- 실패 유형을 정리한 원문 문장은 없음. 위 두 예는 이어 붙이다 글자가 늘어난 경우와 한 단어의 끝 글자를 잘못 찾은 경우
- 단어 수가 늘면 무너짐(Wei Table 5, 예시는 2단어 이름만 보여 주고 3 · 4단어로 평가): PaLM 540B 표준 → CoT 2단어 7.6 → 99.4, 3단어 0.2 → 94.8, 4단어 0.0 → 63.0. LaMDA 137B 2단어 5.8 → 77.5, 4단어 0.0 → 13.5. PaLM 8B 2단어 2.6 → 18.8. 원문은 풀이 구조가 예시에 그대로 있는 "toy tasks"인데도 "small models still fail"
- Kojima의 Last Letter Few-shot · Few-shot-CoT 수치는 위키에 없음(Few-shot 비교 표는 수학 과제만). Wei의 Few-shot-CoT 예시는 2단어 이름 넷("Elon Musk" → nk 등)

## MCP 스펙 확인 결과 (analysis-docs, 2026-11-24)

근거: MCP 스펙 저장소(modelcontextprotocol/modelcontextprotocol, main b0be8f0, 2026-11-23)의 2025-11-25판과 2026-07-28판, agentskills.io specification. 쪽 번호는 지금 기준입니다.

| 쪽 | 확인된 내용 | 슬라이드 반영 |
|---|---|---|
| 41 | Tool 정의의 필수 필드는 name과 inputSchema(type: object). description, title, outputSchema, annotations 등은 선택. 예시 JSON은 유효 | 라벨에 "필수는 name · inputSchema". Resources와 Prompts 설명을 스펙 정의에 맞춤 |
| 42 | host가 client 여럿을 만들고 client와 server는 1:1. 표준 전송은 stdio와 Streamable HTTP. Streamable HTTP는 로컬에도 쓸 수 있음 | "로컬", "원격"을 예시로 표시 |
| 43 | 2025-11-25판 순서는 initialize → result → notifications/initialized → tools/list → tools/call. ping은 순서의 한 단계가 아니라 양쪽 어디서나 아무 때나 보내는 연결 확인 | ping을 순서에서 빼 옆 상자로 옮기고 "2025-11-25 기준"을 적음 |
| 43 | 최신 2026-07-28판은 stateless로 바뀌어 initialize 핸드셰이크와 ping이 없음. 요청마다 `_meta`에 버전과 기능을 넣고, 서버는 server/discover를 구현. 이 판에서 Roots와 Sampling은 Deprecated | 옆 상자에 요약 |
| 36, 37 | 36쪽은 원문과 일치. 원문 폴더 구조에 assets/(선택)가 있음. "역할: Instruction, Tool, Context engineering"은 스펙에 없는 분류이고, scripts/는 새 도구를 정의하지 않음 | 37쪽에 assets/를 넣고, 역할 열을 "발표자 해석"으로 표시. Tool 설명에 "새 도구 정의는 아님" |

결정(2026-11-24, 사용자): MCP는 최신 스펙(2026-07-28)을 따릅니다. 43쪽을 server/discover(선택) → tools/list → tools/call 흐름으로 바꾸고, 요청마다 `_meta`에 버전과 기능을 싣는 점, 모든 결과에 resultType이 붙는 점을 적었습니다. 2025-11-25판과의 차이(initialize 핸드셰이크와 ping 없음, input_required면 입력을 실어 다시 요청)는 옆 상자에 둡니다. 41쪽 출처도 2026-07-28판으로 바꿨습니다. Claude Code 같은 호스트가 지금 어느 판으로 통신하는지는 analysis-docs도 확인하지 못했습니다.

## 변경 이력

- 2026-11-25: 요청 18의 33쪽 반영 내용을 적음
- 2026-11-25: ai-wiki 요청 18 답 2/2(실제 쓸 수 있는 길이, 구조 대안과 대가, 모델별 창 수치, 슬라이드 제안)를 적어 요청 18 기록을 마침
- 2026-11-25: ai-wiki 요청 18 답 1/2(위치 표현, 연산과 메모리, 학습)를 적음. 2/2(실제 쓸 수 있는 길이, 구조 대안, 모델별 수치)를 기다리는 중
- 2026-11-25: ai-wiki 요청 18(context window 크기를 정하는 구조적 요인) 절을 더함. 답을 기다리는 중
- 2026-11-25: 11쪽이 질의 기반 RAG만 남게 되어, 요청 17 결과를 동적 검색 사례 기록으로 둔다고 적음
- 2026-11-25: ai-wiki 요청 17 답을 적음(행별 확인, 위키에 없는 3분류, 다른 사례, 동적 검색의 이점과 한계). 11쪽 "확인 중"을 지움
- 2026-11-25: ai-wiki 요청 17(11쪽 RAG 검색 방식) 절을 더함. 답을 기다리는 중
- 2026-11-25: presentation-slides.md가 300줄에 가까워져, 사실 확인 기록(ai-wiki 요청 11, 15, 16과 analysis-docs의 MCP 스펙 확인)을 이 문서로 옮김. 내용은 바꾸지 않음
