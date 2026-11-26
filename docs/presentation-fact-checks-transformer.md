# 발표 슬라이드 사실 확인 기록: Context window와 Transformer 구조

[presentation-slides.md](presentation-slides.md)의 발표 슬라이드(`ai-agent-slides.html`) 가운데 context window, Transformer 구조, 위치 인코딩에 관한 사실 확인 기록입니다. 2026-11-25에 [presentation-fact-checks.md](presentation-fact-checks.md)가 300줄을 넘게 되어 이 주제의 요청(ai-wiki 요청 18, 22, 24, 25)을 옮겼습니다. 근거 강도(강·중·약)는 ai-wiki가 매긴 값이고, 쪽 번호는 각 절을 적은 날의 기준입니다.

## ai-wiki 확인 결과

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

### ai-wiki 요청 22 (2026-11-25): Context window를 채우는 것과 thinking · 출력

사용자 요청으로 33쪽 뒤(34쪽)에 대화 이력과 문서가 쌓여 context window를 넘는 막대 개념도를 넣고, thinking budget과 출력도 같은 창의 토큰을 쓴다는 점을 적었습니다. 초안 문구는 "입력(System prompt · Tools + 문서 + 대화 이력) + Thinking + Output ≤ Context window"입니다. 물은 것: 창에 들어가는 것의 목록과 원문 표현, 출력 토큰과 max_tokens의 관계, Claude thinking budget이 max_tokens 안에 들어가는지와 이전 턴 thinking 블록이 빠지는지(도구 사용 중 예외 포함), 다른 모델의 reasoning tokens, 창을 넘을 때 실제 동작(오류, 잘라내기, 자동 compaction)과 하니스 예, 긴 대화에서 무엇이 창을 가장 많이 차지하는지의 수치.

답(따로 적은 곳 말고는 강):

- 창에 들어가는 것: Claude Code 문서 "Claude Code's context window holds everything Claude knows about your session: your instructions, the files it reads, its own responses, and content that never appears in your terminal." 예시 세션 표에서 시작 전 시스템 프롬프트 4,200, 자동 메모리 680, 환경 정보 280, MCP 도구 이름 120, skill 설명 450, CLAUDE.md 둘 2,120 토큰. 작업 중 파일 읽기, 검색 결과, hook 출력, 테스트 출력, 자기 분석이 쌓이고 sub-agent는 따로 된 창에서 요약만 돌아옴. 합계는 compaction 전 22,225, 후 17,095 토큰
- 도구 정의만으로도 큼(Anthropic advanced tool use, 2025): MCP 서버 5개 도구 58개가 "approximately 55K tokens before the conversation even starts", 내부 사례 134K. Tool Search Tool로 85% 감소
- 출력: "입력 + 출력 ≤ 창"을 한 문장으로 말한 API 문서 원문은 위키에 없음. 창에 자기 응답이 들어간다(Claude Code 문서), Sonnet 5.5는 창 1M에 출력 최대 128K(Osmani 2026), 매 턴 전체 context를 다시 보낸다(Osmani)
- thinking: "Thinking counts toward `max_tokens`, so leave room."(Osmani 2026). 도구 사용 중에는 thinking 블록을 "pass these blocks back unchanged". 돌려주지 않는 thinking도 출력 토큰으로 과금. budget_tokens는 최근 모델에서 effort로 바뀜(중). 이전 턴 thinking이 다음 턴 context에서 빠지는지는 Claude에 대해 위키에 없음. MiniMax M2는 이전 추론을 남기고, 다른 방식은 빼는 등 모델마다 다름
- 넘으면: Claude Code는 한도 근처에서 자동 compaction(1M 창 모델은 약 967K), 끄면 200K 경계에서 "Prompt is too long" 오류. 하니스별 compaction 기준은 Codex 창의 90%, Goose 80%, Cline 90%에서 70%로, Hermes 50~85%, Pi와 OpenClaw는 창 − 16,384 등. 단순히 잘라내는 방식은 위키에 없음
- 무엇이 많이 차지하나: SkillGym(Ge 2026) 저장된 궤적 텍스트 기준 추론 35.9%, 도구 출력 34.0%, 도구 호출 19.6%(창 점유율과 같지는 않음). 도구 출력 중 나중에 실제로 쓰이는 것은 27%, 36%는 한 번도 안 쓰임(Park 2026)

슬라이드 반영: "확인 중"을 지우고 아래 알약 셋(Thinking은 max_tokens에 포함하고 출력은 다음 턴의 대화 이력, 도구 정의만 약 55K, 넘으면 compaction 또는 "Prompt is too long")을 더함. "입력 + Thinking + Output ≤ Context window" 식은 출력이 입력에 이어 같은 순서열로 생성된다는 4 · 6쪽 설명에서 나오는 개념식으로 두고, 막대는 개념도로 표시.

### ai-wiki 요청 24 (2026-11-25): RoPE가 들어가는 자리

사용자 요청: 33쪽(Transformer 구조 한계 1: Attention budget)과 35쪽(Transformer 구조 한계 2: Context window 상한)의 그림에 RoPE가 실제로 들어가는 자리를 반영. 전 그림은 원래 Transformer처럼 맨 아래 "Embedding + Positional encoding" 블록에 위치 정보를 두었지만 설명은 RoPE를 말함. 바꾼 그림(아래에서 위로): 입력 토큰 → Embedding → [× N층: Self-attention(안에 "Positional encoding (RoPE)") → Feed-forward] → 다음 토큰 확률. 물은 것: RoPE가 층마다 attention 안에서 query · key를 위치에 따라 회전하고 value는 회전하지 않는지, RoPE를 쓰는 모델(Llama, Qwen 계열)에 입력 쪽 절대 위치 embedding이 없는지, query · key 내적이 상대 위치에 따라 달라지는지, YaRN과 위치 보간이 RoPE의 회전 주파수를 조정하는 방식인지. 답을 기다리는 동안 두 장에 "확인 중"을 붙임.

답(근거: Teng 2026 차세대 LLM 아키텍처 서베이, 위키에 원문이 있는 2차 문헌. RoFormer 원문은 위키에 없음):

- Q · K 회전(강): "RoPE encodes position by applying position-dependent rotations to the query and key vectors." 원래 Transformer의 사인파 인코딩은 "added to the input embeddings"라 자리가 다름. 위키 positional-encoding 페이지도 "applied to Q/K via rotation in 2D pair subspaces"(중)
- value는 회전하지 않음(중): 출처가 모두 query와 key만 말하고, value를 명시한 문장은 없음
- 층마다 적용(중): RoPE는 query · key 투영 다음, 곧 attention 계산 안에 들어감. "모든 층"을 명시한 문장은 없고 예외가 있음(강). LLaMA 4 iRoPE는 RoPE 층과 NoPE 층을 섞고, Qwen3.8-Flash-Next는 `partial_rotary_factor: 0.25`로 head당 256차원 중 64차원만 회전
- 입력 쪽 절대 위치 embedding 없음(중): 서베이의 모델별 표에서 LLaMA-2~3.1, Qwen~Qwen3.5/3.6의 위치 방식이 모두 RoPE 하나. 직접 쓴 문장은 없음. 학습형 절대 위치 embedding의 예는 BERT, GPT-2, GPT-3(강)
- 내적은 상대 위치에 따라 달라짐(강): (q_i R_iᵀ)(k_j R_jᵀ)ᵀ = q_i R_{j−i} k_jᵀ, "their interaction depends on the relative displacement j − i"
- 길이 늘리기는 모두 회전 각도를 바꿈(강, 중): Position Interpolation은 위치를 배율로 나누고 짧게 fine-tuning, NTK-aware · ABF는 RoPE base를 키움, YaRN은 차원의 파장마다 다르게 조정하고 attention 온도를 보정하며 원 방법은 긴 순서열로 짧게 fine-tuning
- 256K → 1M 예(중, 강): Qwen3.8-Flash-Next는 추가 학습 없이 서빙 설정(`rope_type: yarn`, `factor: 4.0`)으로 늘린 경우. "Extension is a serving-time decision encoded in config.json, not a property of the weights". 덧붙일 한계(중): "Scaling makes long positions representable. It does not make them usable"

슬라이드 반영: 33, 35쪽 "확인 중"을 지움. 35쪽 첫 줄은 "층마다"를 빼고 "attention 안에서 Q · K를 위치에 따라 회전"으로 씀(모든 층을 명시한 근거가 없고 예외가 있음). 셋째 줄은 "RoPE 조정(YaRN 등)으로 늘림: 방법에 따라 짧은 추가 학습"과 "예: Qwen3.8-Flash-Next는 256K로 학습, YaRN ×4 설정으로 1M"으로 고침(이 예는 추가 학습이 아니라 설정으로 늘림). 출처 칸에 Teng 2026 서베이와 "모델에 따라 일부 층(LLaMA 4)이나 일부 차원(Qwen3.8)에만 RoPE"를 더함. value 회전 여부와 위의 한계 문장은 슬라이드에 넣지 않음. 같은 때 사용자 의견으로 그림의 알약 표기를 "Positional encoding (RoPE)"에서 "Positional encoding"으로 줄임(RoPE는 35쪽 설명에 남김). 이후 사용자 요청으로 Positional encoding을 Self-attention 옆 노드로 떼어 선으로만 잇고, 35쪽에서 RoPE · Q · K 언급과 예외 각주를 뺌(세부 계산은 발표에서 다루지 않음). 입력 embedding이 아니라 attention 쪽에 두는 그림의 자리는 이 확인을 근거로 둠.

### ai-wiki 요청 25 (2026-11-25): 최신 LLM의 위치 인코딩 현황

사용자 질문: 실제로 2026년 최신 Transformer 기반 모델들도 RoPE를 쓰는가. 물은 것: 2025~2026년 주요 모델(Qwen3.x · 3.8, LLaMA 4, DeepSeek V3 이후, Gemma 3 이후, GPT-OSS, Mistral, Kimi, GLM, MiniMax)의 위치 인코딩이 RoPE, 변형(partial RoPE, NoPE 층 섞기, MLA의 decoupled RoPE), RoPE 없음 중 무엇인지. hybrid 모델의 linear attention · state space 층도 위치 인코딩을 쓰는지, RoPE를 쓰지 않는 최신 주요 모델과 대안(NoPE, ALiBi), 비공개 모델(GPT, Claude, Gemini)의 공개 여부, "대부분 RoPE나 그 변형"이라는 근거 문장.

답(근거: 주로 Teng 2026 서베이의 모델별 구성 표, 2026-08 모델까지 수록, 2차 문헌. 따로 적은 곳 말고는 강):

- RoPE(표): Qwen3(2025-04), Qwen3-Next(2025-09), Qwen3.5/3.6(2026-02), Qwen3.8 27B · Max(2026-08), Gemma 3(2025-03) · 4(2026-03), DeepSeek-R1(2025-01) · V3.2(2025-09) · V4(2026-06), MiniMax-01/M1 · M2.x · M3(2026-06), Kimi K2.x(2025-07), GLM-4.x · 4.7-Flash · 5.x(2026-02), Mistral Large 3(2025-12), openPangu, MiniCPM4(LongRoPE)
- 변형: LLaMA 4는 iRoPE("interleaves RoPE-equipped local-attention layers with NoPE global-attention layers"). Partial RoPE는 GLM-4.5("with partial RoPE and QK-Norm")와 Qwen3.8-Flash-Next(`partial_rotary_factor: 0.25`, 중). MLA를 쓰는 모델(DeepSeek-V2/V3 계열, Kimi K2, Mistral Large 3, GLM-4.7-Flash, GLM-5)은 decoupled RoPE: RoPE를 그대로 쓰면 MLA의 가중치 흡수가 깨져, head들이 공유하는 작은 rotary 성분이 위치를 맡음(표에는 그냥 "RoPE")
- RoPE 없음(NoPE): Kimi Linear(2025-10, KDA:MLA 3:1), Kimi K3(2026-07), Nemotron-H(2025-04) · Nemotron 3(2026-03, Mamba-2 hybrid). 예전 예로 Jamba, Falcon Mamba. GPT-OSS(2025-08)는 표에 위치 인코딩 칸이 비어 있음
- hybrid의 linear · SSM 층: Kimi Linear는 "NoPE is applied to all full-attention (MLA) layers"이고 KDA 층이 위치를 맡음(RoPE를 넣은 버전은 긴 context에서 나쁨, RULER 78.8 vs 84.3). Kimi K3는 "extrapolates to 1M tokens with no RoPE rescaling". Qwen3-Next · 3.5(DeltaNet:attn 3:1)와 MiniMax-01(Lightning:softmax 7:1)은 표에 모델 단위로 "RoPE"만 있어 linear 층에도 쓰는지는 위키에 없음. 원리: 위치 신호가 없는 self-attention은 "permutation-equivariant"이고, 순환 구조는 순서를 스스로 담음
- 그 밖: ALiBi를 쓰는 2025~2026 주요 모델은 위키에 없음(예전 MPT만). 비공개 모델(GPT, Claude, Gemini)의 위치 인코딩은 위키에 없음("Architectural details are not officially disclosed")
- 근거 문장: "Rotary Position Embedding (RoPE) … has been widely adopted in modern LLMs, including the LLaMA family", "Pre-RMSNorm, SwiGLU, and RoPE became common ways to specify normalization, feature gating, and positional interaction". 새 흐름으로 "Hybrid Positional Architectures"
- 정리(해석): 위 목록의 2025~2026 공개 모델 중 NoPE는 Kimi Linear · K3와 Nemotron 계열뿐이고, 나머지는 RoPE나 그 변형

슬라이드 반영: 없음(사용자 질문에 대한 답). 33, 35쪽 그림이 RoPE를 쓰는 대부분의 공개 모델에 맞는다는 근거로 둠.

## 변경 이력

- 2026-11-25: 요청 24의 슬라이드 반영에 이후 바뀐 표기(옆 노드로 분리, RoPE · Q · K와 예외 각주 뺌)를 덧붙임
- 2026-11-25: ai-wiki 요청 25 답(2025~2026 공개 모델 대부분 RoPE나 그 변형, NoPE는 Kimi Linear · K3와 Nemotron 계열, 비공개 모델은 위키에 없음)을 적음
- 2026-11-25: presentation-fact-checks.md에서 요청 18, 22, 24, 25를 옮겨 문서 작성. 내용은 바꾸지 않음
