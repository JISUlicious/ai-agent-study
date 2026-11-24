# 에이전트 평가 요소

개념 장의 Evaluation에 넣을 구현요소를 모은 문서입니다. 2026-11-24 사용자 요청으로 Anthropic의 에이전트 구축 가이드와 AI-Native SDLC 문서를 참고했습니다. 앞쪽은 ai-wiki 세션의 답, 뒤쪽은 ai-sdlc-skill 세션의 답입니다. 구성요소 매트릭스 전체는 [agent-components-implementation.md](agent-components-implementation.md)에 있습니다.

## 정의와 기준

- Verification: 과제 하나의 결과가 요구와 완료 기준을 채우는지 확인하는 것
- Evaluation: 만든 에이전트(모델과 하니스)가 잘 동작하는지 성능을 재는 것
- 두 답 모두 같은 검사라도 과제 하나에 쓰면 Verification, 여러 과제에 걸쳐 모으면 Evaluation이라고 정리합니다(해석).

## Anthropic 평가 글과 에이전트 구축 가이드 (ai-wiki)

출처 약칭: DE = Demystifying evals(2026), G25 = Building Effective AI Agents 기업용 가이드(2025), B24 = Building Effective Agents(2024). "밖"은 에이전트(모델과 하니스) 밖입니다. 근거 강도는 ai-wiki가 매긴 값이고, "함께 걸치는 칸"은 해석(중~약)입니다.

| 요소 | 한 줄 정의 | 위치 | 함께 걸치는 칸 |
|---|---|---|---|
| 평가 과제와 평가 세트 | 입력과 성공 기준이 있는 테스트와 그 묶음(DE, 강) | 밖 | Verification(성공 기준이 완료 기준) |
| trial과 지표 | 한 과제를 여러 번 시도해 집계, pass@k와 pass^k(DE, 강) | 밖 | 없음 |
| grader | 수행의 한 측면을 채점. 코드, 모델, 사람(DE, 강) | 밖 | Verification(과제 하나의 판정), 모델 grader는 LLM |
| transcript | trial의 전체 기록(DE, 강) | 에이전트가 만들고 밖에서 읽음 | Memory(세션 저장), Agent loop |
| outcome | 에이전트의 말이 아니라 환경의 최종 상태(DE, 강) | 환경 | Verification |
| evaluation harness | eval을 처음부터 끝까지 돌리는 인프라. agent harness와 따로 정의(DE, 강) | 밖 | 직접 없음. trial마다 환경을 격리해야 해서 Permission controls(sandbox)에 닿음 |
| capability와 regression 평가 | 무엇을 잘하는지와, 하던 일을 여전히 하는지. 통과율이 오른 capability 평가는 regression으로 옮김(DE, 강) | 밖 | 없음 |
| CI/CD 자동 평가 | 변경이나 모델 교체마다 돌리는 첫 방어선(DE, 강) | 밖 | 없음 |
| 운영 모니터링과 observability | 출시 뒤 분포 변화와 예상 못 한 실패를 잡음(DE). 프롬프트 체인, 결정, 검색 맥락, 토큰의 trace를 처음부터 넣음(G25, 강) | 신호는 안, 분석은 밖 | 없음 |
| A/B 테스트 | 실제 트래픽에서 변경을 비교(DE, 강) | 밖 | 없음 |
| 사용자 피드백 | 싫어요나 버그 신고 같은 명시적 신호(DE, 강) | 밖 | 없음 |
| 사람 검토 | transcript를 읽어 실패 유형을 찾고, 체계적 사람 평가로 모델 grader를 보정(DE, 강) | 밖 | 없음 |

- DE는 이 층들을 함께 써야 전체가 보인다고 하며, 한 층이 놓친 실패를 다른 층이 잡는다는 뜻으로 Swiss Cheese Model을 듭니다(강).
- evaluator-optimizer(B24, G25)는 이름과 달리 실행 중에 생성과 평가를 2~4회 반복하는 루프라 Verification 쪽입니다(강).
- G25는 평가 요소로 observability와 지표 정도만 다룹니다(중).
- 이 표와 아래 AI-Native SDLC 표에는 처음에 Persistence를 "기록으로 남는 것"이라는 넓은 뜻으로 붙인 곳이 있었습니다(transcript, evaluation harness, 운영 모니터링, CI 결과 기록, 커밋 SHA 기록). 2026-11-24 사용자 결정으로 Persistence를 Memory에 합치면서 다시 매겼습니다([agent-components-concept.md](agent-components-concept.md)의 "Memory와 Persistence"). transcript와 세션 trace는 Memory(세션 저장)에 걸칩니다. evaluation harness의 환경 격리는 Permission controls(sandbox)에만 닿습니다. 운영 모니터링, CI 결과 기록, 커밋 SHA 기록은 기록으로 남는다는 넓은 뜻이었으므로 개념 칸 대응을 뺐습니다. AI-Native SDLC 표의 판단은 ai-sdlc-skill 세션의 것이라, 고친 칸에 원래 문구를 함께 적었습니다.

## AI-Native SDLC Playbook (ai-sdlc-skill)

출처: Anthropic, "The AI-Native SDLC Playbook"(2026-08-21). Stage 1~3과 Stage 4의 첫 절은 원문과 대조했고, 나머지는 페이지 요약과 로컬 위키 요약으로 읽었습니다([요약]). 판단은 모두 ai-sdlc-skill 세션의 해석입니다.

| 항목 | 위치 | 판단 |
|---|---|---|
| 피드백 루프: 테스트, 빌드, 스크린샷 비교로 자기 작업 확인 | Stage 4 | Verification |
| verifier 서브에이전트: 완료 보고 전 새 컨텍스트에서 확인하고 보고만 함 | Stage 3 | Verification. 보고만 하는 제한은 Permission |
| plan mode 계획 검토, 승인 전 편집 불가 | Stage 3 | Verification. 승인 전 편집 불가는 Permission, 계획은 Planning |
| 테스트 먼저 버그 수정, 수정 중 테스트 편집 차단 훅 [요약] | Stage 4 | Verification. 훅은 Permission |
| 완료 보고 전 테스트·빌드·린트 통과, 첫 시도 CI 통과율 [요약] | Stage 4 | 검사는 Verification, 통과율 집계는 Evaluation |
| CI의 지속적 eval: 최근 실제 과제 20~50개를 비대화형으로 돌리고, 설정(CLAUDE.md, 스킬, 훅)이 바뀔 때 다시 돌림. 통과율을 머지 검사로 강제하고 결과를 기록해 시간에 따라 비교 [요약] | Stage 4 | Evaluation의 중심. 평가 대상이 하니스 설정 전체라 사용자 정의와 맞음. 머지 차단은 Permission. 결과 기록은 Evaluation의 데이터(2026-11-24 고침, 원래 "기록은 Persistence") |
| 인시던트를 영구 eval로 [요약] | Stage 4·6 | Evaluation. 평가 세트를 늘리는 경로 |
| 스킬 발동 테스트 | Stage 3 | 하니스 구성요소 하나의 Evaluation |
| 플레이마다 붙은 leading·lagging 지표 | 모든 단계 | 운영 데이터로 하는 Evaluation. 사람과 프로세스의 성과가 섞임 |
| AI PR 리뷰 [요약] | Stage 5 | PR 하나의 Verification. 승인·차단 권한이 없는 것은 Permission |
| 리뷰 결과의 월간 평가 [요약] | Stage 5 | 판정자인 리뷰 에이전트를 사람 라벨로 평가하는 Evaluation |
| 사람 리뷰와 코드오너 승인 | Stage 2·3·5 | 사람이 하는 Verification. 브랜치 보호는 Permission |
| 훅을 승인 게이트로 [요약] | Stage 5 | 주로 Permission. 지표는 가드레일 자체의 Evaluation |
| 관리 범위 감시 [요약] | Stage 6 | 감시 대상이 에이전트가 아니라 서비스라 둘 다 아님. 인시던트를 거쳐 eval 세트를 늘리는 입력 |
| 정기 코드베이스 스캔 [요약] | Stage 6 | 발견 검증은 Verification, 취약점 유형마다 eval 추가는 Evaluation |
| 로그와 기록(세션 trace, 산출물의 커밋 SHA와 승인자, lessons 파일) | 여러 단계 | 세션 trace는 Memory(세션 저장). 커밋 SHA와 승인자 기록은 개념 칸 대응 없음(2026-11-24 고침, 원래 Persistence). 평가의 원자료. lessons 파일은 Memory |

- 문서에 없는 것: LLM-as-judge, eval 주도 개발 같은 용어, 판정 방식, 평가 데이터셋 스키마, 수치 목표.
- 참고(문서 내용이 아니라 ai-sdlc-skill 세션의 플러그인 평가 구현): 케이스는 프롬프트와 grader로 이뤄지고, 플러그인 적용과 미적용의 점수 차를 봅니다. grader 자체에도 결함이 있었고(커밋 명령이 실제로 커밋됐는지가 아니라 호출됐는지만 봄), LLM 판정 모델을 바꿔야 했습니다. 판정자도 평가해야 한다는 사례입니다.

## 매트릭스에 넣은 평가 요소 (2026-11-24)

두 답을 묶어 구현요소 넷을 Evaluation 행으로 더했고, 이어서 capability 평가를 더해 다섯이 됐습니다(해석, capability 평가는 2026-11-24 사용자 승인). 매트릭스와 다이어그램은 화이트보드에 있습니다(https://claude.ai/artifact/KMbmL7iE4x2GoX3W2M5YEG).

| 구현요소 | 묶은 것 | 위치 | 걸침 |
|---|---|---|---|
| eval 세트·grader | 평가 과제와 세트, 실제 과제로 만든 세트와 인시던트로 늘리는 경로, 코드·모델·사람 grader, 사람 검토, 판정자 평가 | 밖 | Verification(과제 하나의 판정) |
| capability 평가 | 새 기능을 재고, 통과율이 오르는지로 개선 여부를 봄. 처음에는 통과율이 낮은 과제로 시작하고, 통과율이 충분히 오르면 regression 세트로 옮김(DE) | 밖 | 없음 |
| CI 회귀 평가 | evaluation harness, trial과 지표, regression 평가, 설정 변경 때 다시 돌리기, 통과율 게이트 | 밖 | 없음. 머지 차단을 Permission으로 볼 수도 있음 |
| telemetry | OTel trace(span)와 지표, 실행 기록의 시간 비교. 처음에는 "trace·실행 기록 (transcript, OTel)"이었고 2026-11-24에 transcript를 세션 저장 쪽으로 옮김 | 에이전트가 내보내고 밖에서 분석 | 없음 |
| 운영 지표·모니터링 | 운영 모니터링, A/B 테스트, 사용자 피드백, leading·lagging 지표 | 밖 | 없음 |

- eval 세트·grader와 CI 회귀 평가는 같이 갑니다. CI 회귀 평가는 eval 세트와 grader를 CI에서 돌리는 방식이고, 앞은 무엇으로 잴지, 뒤는 언제 돌리고 무엇을 막을지에 해당합니다. 그래도 두 행은 따로 둡니다(2026-11-24 사용자 결정). eval 세트와 grader는 CI 말고도 capability 평가, 모델과 설정 비교, 운영 기록 채점에 쓰이기 때문입니다.
- capability 평가: 사용자가 eval 세트·grader 아래에 새 기능 평가와 개선 여부 평가를 맡는 항목을 원해, Anthropic 평가 글의 capability 평가로 이름 붙였습니다(2026-11-24 사용자 승인). CI 회귀 평가(regression)와 짝을 이룹니다. 다른 후보였던 "비교 평가 (A/B, 변경 전후)"는 바꾼 설정이 원래보다 나은지 같은 세트로 비교하는 쪽에 초점이 있어 고르지 않았습니다. "개선 여부"를 통과율이 오르는지로 읽은 것은 해석입니다.
- capability 평가 → CI 회귀 평가 화살표("통과율이 오르면 회귀 세트로")를 한 턴 흐름과 겹친 버전에 넣었습니다(2026-11-24 사용자 요청). DE의 graduate 설명을 그린 것입니다.
- trajectory, transcript, OTel의 구분(2026-11-24 사용자 질문, 해석): transcript는 Anthropic 평가 글에서 trial의 전체 기록이고 trace, trajectory와 같은 뜻으로 쓰입니다. 그래서 agent trajectory를 저장한 것과 같은 쪽입니다. OTel은 span, 시간, 토큰, 비용, 오류 같은 운영 신호를 외부 관측 시스템으로 내보내는 것이라 다릅니다. Claude Code에서도 transcript(세션 JSONL 경로)와 OTel export는 따로 있는 기능입니다. 지금 "trace·실행 기록 (transcript, OTel)" 블록은 둘을 섞었으므로, transcript를 세션 저장 쪽으로 옮기고 나머지를 "telemetry (OTel)"로 나누는 안을 냈고, 2026-11-24 사용자 결정으로 반영했습니다(아래 "trajectory, transcript, trace" 절의 보드 적용).
- 사용자 지적(2026-11-24): transcript와 agent trajectory는 내용도 다르다. ai-wiki로 확인한 결과와 앞서 한 설명의 정정은 아래 "trajectory, transcript, trace" 절에 있습니다.
- 평가 자체는 에이전트 밖에서 하므로, 밖에 있는 넷은 매트릭스에서 이름 칸을, 다이어그램에서 블록을 회색으로 표시했습니다. telemetry는 에이전트가 내보내는 것이라 노란 블록으로 두었습니다.
- evaluator-optimizer, verifier 서브에이전트, PR 리뷰는 과제 하나를 보는 Verification이라 넣지 않았습니다.
- 다이어그램에서는 Evaluation 상자 왼쪽에 Verification을 두어 eval 세트·grader를 경계에 놓았습니다. 세션 저장(transcript)은 처음에 Persistence와 Evaluation의 경계에 있었고, Persistence를 Memory에 합친 뒤(2026-11-24)에는 아랫줄 높이까지 늘린 Memory 상자와 Evaluation의 경계에 놓았습니다. telemetry는 Evaluation 안에 있습니다.

## trajectory, transcript, trace (ai-wiki, 2026-11-24)

사용자 질문(transcript는 어떤 뜻인가, agent trajectory와 내용이 다르지 않나)을 ai-wiki로 확인했습니다. 근거 강도는 ai-wiki가 매긴 값입니다.

용어:

- 셋을 나란히 놓고 구분해 정의한 출처는 위키에 없습니다(강). Demystifying evals는 오히려 "A transcript (also called a trace or trajectory) is the complete record of a trial"이라고 같은 뜻으로 씁니다(강). 이 글이 나누는 것은 transcript와 outcome(환경의 최종 상태)입니다.
- 쓰이는 맥락은 갈립니다.
  - trajectory: 연구와 학습 쪽 말입니다. 한 에피소드의 생각, 행동, 관찰 순서입니다. ReAct는 추론과 행동이 섞인 하나의 LLM trajectory라고 쓰고, SWE-Gym은 성공한 trajectory로 학습합니다(중).
  - transcript: 평가와 제품 쪽 말입니다. Claude Code는 세션 JSONL 파일을 transcript라고 부릅니다(hook의 `transcript_path`)(강).
  - trace: observability 쪽 말입니다. LangSmith의 run, MLflow의 trace, Claude Code OTel의 span이 이 뜻입니다(중).
- 해석(약): 같은 실행 기록을 누가 무엇에 쓰느냐에 따라 이름이 갈립니다. 모델 학습과 평가용 단계 순서는 trajectory, 사람이 읽거나 재개하는 대화 기록은 transcript, 운영 모니터링용 구조화 계측(span, metric)은 trace입니다. 원문이 이렇게 나누지는 않으므로 슬라이드에는 해석으로 표시합니다.

코딩 에이전트의 transcript와 재개(강, opencode와 Hermes는 중):

| 제품 | 저장 | 재개와 context |
|---|---|---|
| Claude Code | 메시지, 도구 사용, 결과를 평문 JSONL로 기록. rewind, resume, fork의 바탕. compaction은 `compact_boundary` 레코드로 남고, rewind의 요약을 써도 원본 메시지는 지워지지 않음. sub-agent 기록은 별도 파일(`agent-{id}.jsonl`) | resume은 같은 세션에 이어 쓰고 fork는 새 ID로 복사. compaction 뒤 context는 요약과 디스크에서 다시 넣는 것(CLAUDE.md, auto memory, skill 설명, plan, git status) |
| Codex | 대화 항목을 JSONL rollout으로 기록. sub-agent도 자기 rollout | resume과 fork 때 rollout을 다시 재생해 대화를 복원. 지난 rollout은 장기 memory의 재료 |
| Pi | JSONL 트리(message, compaction, branch_summary, context_edit, usage 등) | 활성 가지만 메시지 배열로 만듦. compaction 항목이 오래된 메시지를 요약으로 바꾸고, context_edit가 실패한 시도를 숨김. 원본은 그대로 두고 context는 투영으로 다시 만듦 |
| opencode | SQLite 이벤트 로그를 테이블로 투영 | 크래시 뒤 미완료 항목 정리 |
| Hermes | SQLite(FTS5 검색) | compression이 일어나면 session_id가 바뀜 |

OTel(Claude Code):

- 사용자별 token과 cost, 도구 활동 같은 metric을 거의 실시간으로 내보냅니다(강).
- event와 span 예: user_prompt, api_request, hook_execution_complete, `claude_code.llm_request` span, `tool.output` span event(강).
- 프롬프트 텍스트는 event에 실릴 수 있고 drop이나 mask로 가립니다. 도구 내용은 `OTEL_LOG_TOOL_CONTENT=1`일 때만 실립니다. 기본값과 전체 목록은 위키에 없습니다(중).
- transcript와 OTel은 다른 저장소이고, `prompt_id`와 `prompt.id` 같은 ID로 서로 이어집니다(중).

학습용 trajectory(Hermes, 중):

- `batch_runner.py`가 데이터셋의 프롬프트마다 같은 에이전트 루프를 병렬로 돌려 저장합니다. 한 레코드는 프롬프트, 도구 호출 순서, 응답, reasoning 묶음이고, HuggingFace datasets로 읽히도록 스키마를 맞추고 도구 통계를 붙입니다.
- transcript와 비교(약, ai-wiki 정리): trajectory는 여러 실행을 모은 학습 코퍼스이고 스키마가 고정돼 있습니다. transcript는 한 사용자 세션을 이어 쓰는 기록이고 재개, rewind, compaction 경계 같은 운영 메타를 담습니다.

앞서 한 설명의 정정:

- "transcript에 sub-agent 기록까지 담긴다": Claude Code와 Codex 모두 sub-agent 기록은 별도 파일입니다.
- "transcript 줄마다 시간과 토큰 메타데이터가 있다": 위키에 없습니다. SDK 결과 메시지에 usage, num_turns, total_cost_usd가 있다는 것만 확인됐습니다.
- "OTel은 프롬프트 내용을 넣지 않거나 가리는 경우가 많다": Claude Code는 프롬프트 텍스트를 event에 실을 수 있고, 가리는 설정이 따로 있습니다.
- 맞았던 것: compaction 뒤에도 원본이 남는 것, 재개할 때 기록에서 context를 다시 만드는 것(Codex 재생, Pi 투영).

보드 적용(2026-11-24 사용자 결정으로 반영, 안 자체는 해석):

- 연결: 세션 저장(transcript) → eval 세트·grader("채점"), 루프 → telemetry("내보냄"), telemetry → 운영 지표("분석"). 세션 저장 → context 조립("context에 넣음", 재개)은 그대로 둡니다. 한 턴 흐름에서는 telemetry와 운영 지표를 goal 루프 상자 오른쪽에 두고, eval 세트·grader를 세션 저장 바로 아래로 올렸습니다.
- 매트릭스: 세션 저장 행을 "세션 저장 (transcript: resume, fork)"로 하고 Evaluation ○를 더했습니다. 사용자 지적(transcript도 Memory 쪽에 포함돼야 하지 않나)으로 Memory ○도 더했습니다. 재개할 때 transcript에서 context를 다시 만들고(Codex 재생, Pi 투영), 지난 기록이 장기 memory의 재료가 되기 때문입니다(Codex rollout, Hermes session_search). 다이어그램에서는 한 블록이 이웃한 두 상자에만 걸칠 수 있어 Memory 쪽 표현 방식이 남았는데, Persistence를 Memory에 합친 결정(2026-11-24)으로 세션 저장은 Memory ●, Evaluation ○가 되고 다이어그램에서 Memory와 Evaluation의 경계에 걸칩니다. trace 행은 "telemetry (OTel trace·지표)"로 바꾸고 Persistence ○를 뺐습니다. 범례에 세 말에 대한 각주를 넣었습니다.
- 두 다이어그램: 세션 저장(transcript)을 Persistence와 Evaluation의 경계에 걸쳐 놓고(Persistence를 Memory에 합친 뒤에는 Memory와 Evaluation의 경계), telemetry를 Evaluation 안으로 옮겼습니다. 겹친 버전의 점선도 루프 → 세션 저장(기록), 루프 → telemetry(내보냄), 세션 저장 → eval 세트·grader(채점), telemetry → 운영 지표(분석)로 바꿨습니다.

처음 낸 안:

- "세션 저장 (agent trajectory)" 블록은 "세션 저장 (transcript)"로 바꿉니다. 이 블록에서 context 조립으로 가는 점선이 재개, 곧 transcript에서 context를 다시 만드는 것입니다.
- agent trajectory는 발전 흐름 그래프처럼 context 안의 작업 기록(Memory 쪽)으로 둡니다. ReAct의 용례와 맞습니다.
- "trace·실행 기록 (transcript, OTel)" 블록은 "telemetry (OTel trace·지표)"로 바꿔 OTel만 남깁니다.
- 각주: Demystifying evals는 세 말을 같은 뜻으로 쓰고, 이 발표는 용도에 따라 나눠 씁니다.
- ai-wiki는 trajectory를 학습 데이터 블록으로 따로 두는 안도 냈습니다. 학습 데이터는 지금 구성요소 범위 밖이라 이번 안에는 넣지 않았습니다.

## 변경 이력

- 2026-11-24: Persistence를 Memory에 합친 결정으로 평가 요소 표의 대응을 다시 매김(transcript와 세션 trace는 Memory, 넓은 뜻의 기록은 대응 없음)과 다이어그램 설명을 고침
- 2026-11-24: 평가 요소 표에서 Persistence를 넓은 뜻(기록 전부)으로 붙인 곳을 표시하고, 개념 장에서 뜻을 정한 뒤 다시 매기기로 함
- 2026-11-24: 세션 저장(transcript) 행에 Memory ○를 더한 이유와 다이어그램 표현이 결정 전임을 적음
- 2026-11-24: transcript와 telemetry를 나눈 결정을 보드에 반영한 내용과 평가 요소 표의 telemetry 행을 적음
- 2026-11-24: trajectory, transcript, trace 절을 더함(ai-wiki 확인, 제품별 transcript와 재개, Claude Code OTel, 학습용 trajectory, 앞 설명의 정정, 보드 적용 안)
- 2026-11-24: capability 평가 → CI 회귀 평가 화살표 추가를 적고, trajectory·transcript·OTel 구분과 블록을 나누는 안을 적음
- 2026-11-24: capability 평가를 다섯째 평가 요소로 더함(사용자 승인, 고른 이유와 다른 후보)
- 2026-11-24: eval 세트·grader와 CI 회귀 평가의 관계, 두 행을 따로 두기로 한 결정을 적음
- 2026-11-24: 문서 작성. ai-wiki와 ai-sdlc-skill 답을 정리하고, 매트릭스에 더한 평가 요소 넷과 묶은 기준을 적음
