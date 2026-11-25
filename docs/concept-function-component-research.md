# 발표 조사: 에이전트의 개념 · 기능 · 구성요소

새 발표(3부 구성)를 위한 조사 문서입니다. 슬라이드를 만들기 전 단계입니다.

- 1부 개념, 2부 기능: 추상적이고 넓은 범주로 묶습니다.
- 3부 구성요소: 사용자 관점이 아니라, 구현하는 개발자가 만들어야 하는 모듈로 나눕니다.

## 조사 상태

| 부 | 요청한 곳 | 상태 |
|---|---|---|
| 1부 개념 · 2부 기능 | ai-wiki (2026-11-25 요청) | 답 대기 |
| 3부 구성요소 | analysis-docs (2026-11-25 요청) | 답 대기 |
| 기존 자료 | agent-evo-graph의 "AI Agent: 구성과 구현" 덱(약 60쪽, 발전 순서) | 확인함. 재사용 후보는 아래 표 |

## 작업 가설 (답을 받으면 고침)

아래는 출처 확인 전의 초안입니다. 각 줄은 답을 받은 뒤 출처를 붙이거나 고칩니다.

### 1부 개념 후보 축

| 축 | 질문 | 확인할 출처 |
|---|---|---|
| 목표 지향 | 무엇을 이루려 하나 | Wooldridge & Jennings 1995 (pro-activeness) |
| 환경과 상호작용 | 지각하고 행동하나 | Russell & Norvig (AIMA) |
| 자율성 | 제어 흐름을 누가 정하나 (workflow ↔ agent) | Anthropic, Building Effective Agents (2024) |
| 반복 | 결과를 보고 다음 행동을 정하나 | ReAct (Yao et al., 2022) |

### 2부 기능 후보 범주

이해 · 지각 / 추론 · 계획 / 행동(도구 · 환경 조작) / 기억 / 성찰 · 검증 / 협업(다른 에이전트 · 사람)

### 3부 구성요소 후보 묶음

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
