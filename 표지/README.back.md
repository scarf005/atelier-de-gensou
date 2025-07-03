# 뒷표지 생성법

## ASCII 생성법

`deno run -A to-ascii.ts image.png -B 1.5 -W 120`
`deno run -A to-ascii.ts tape.png -B 1.5 -W 120`

## 표지 생성법

1. odf 문서를 loseless compression, 300dpi pdf로 내보낸다 (미국식 단위계 죽어!!!)
2. `magick -density 300 back.pdf back-raw.png` 로 변환
3. krita에 붙여넣고 잘라서 사용
