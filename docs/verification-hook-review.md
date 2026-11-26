# 검토: Verification을 hook으로 합칠지

발표 슬라이드 Hook · Verification 부분을 짤 때(2026-11-24) 한 검토입니다. presentation-slides.md가 300줄에 가까워져 2026-11-26에 이 문서로 옮겼습니다(내용은 그대로).

## 검토 (2026-11-24, 해석)

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

- 2026-11-26: presentation-slides.md에서 옮겨 문서 작성(내용은 바꾸지 않음)
