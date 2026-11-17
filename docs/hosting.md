# 정적 페이지 공개 방법

`site/index.html`을 claude.ai 밖에서 주소로 열기 위한 방법입니다.

## 지금 쓰는 방법: Cloudflare quick tunnel

1. `site` 폴더만 내보내는 로컬 서버를 띄웁니다. 다른 파일이 노출되지 않게 폴더를 한정합니다.

   ```bash
   python3 -m http.server 8767 --bind 127.0.0.1 --directory site
   ```

2. 터널을 엽니다. 출력에 나오는 `*.trycloudflare.com` 주소로 접속합니다.

   ```bash
   cloudflared tunnel --url http://127.0.0.1:8767 --no-autoupdate
   ```

- 주소를 아는 사람은 누구나 볼 수 있습니다. 로그인이나 비밀번호가 없습니다.
- Mac이 켜져 있고 서버와 터널이 돌아가는 동안만 열립니다.
- 터널을 다시 시작하면 주소가 바뀝니다.

## 검토한 대안

| 방법 | 장점 | 단점 |
|---|---|---|
| GitHub Pages | 고정 주소, Mac이 꺼져도 열림 | 무료 계정은 공개 저장소에서만 가능 |
| Tailscale Serve | 내 기기끼리만 공개, 가장 안전 | 앱 설치와 로그인 필요, 외부인은 못 봄 |
| Cloudflare quick tunnel | 설치 하나로 바로 공개 | 임시 주소, 안정성 보장 없음 |

잠깐 보여 주는 용도라 Cloudflare quick tunnel을 택했습니다.

## 변경 이력

- 2026-11-17: 문서 작성
