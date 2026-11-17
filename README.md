# ai-agent-study

LLM에서 AI 에이전트까지의 발전 과정을 정리한 발표용 학습 자료입니다.
에이전트를 처음 접하는 개발자와 준개발자를 대상으로 합니다.

## 들어 있는 것

| 파일 | 내용 |
|---|---|
| `llm-to-agent-evo.html` | LLM에서 에이전트까지의 발전 흐름. 노드를 누르면 앞뒤 노드가 강조되고, 오른쪽에 설명 카드가 쌓입니다. |
| `site/index.html` | 위 페이지의 독립 실행판. 정적 파일로 바로 열 수 있습니다. |
| `agent-components-slides.html` | 에이전트 구성요소(LLM, Tool, Memory, Agent Loop)를 섹션별로 보는 인터랙티브 슬라이드 |
| `index.html`, `app.js`, `board.js`, `data.js`, `style.css` | AI 에이전트 영향 그래프. 시간축 위의 계보와 근거 패널 |
| `tools/sync_board.py` | 화이트보드의 배치를 `llm-to-agent-evo.html`로 옮기는 스크립트 |

## 보는 법

브라우저로 HTML 파일을 바로 열면 됩니다. 영향 그래프는 `index.html`을 엽니다.

```bash
python3 -m http.server 8767 --directory site
```

## 문서

작업 기록은 [`logs.md`](logs.md), 문서 목록은 [`index.md`](index.md)에 있습니다.
