---
date: 2022-03-07
tags:
  - Texture
  - File
description: 3D 작업에서 자주 마주치는 파일 확장자 한눈에 정리
---
## Image File Format

> [!info] JPG
> 
> - 압축 용량이 가장 좋음
> - 퀄리티가 낮아짐
> - 최대 8bit/channel
> - 웹용으로 주로 사용

> [!info] PNG
> 
> - Alpha
> - 압축률과 퀄리티가 좋음
> - 최대 16bit/channel, 웹에서도 사용
> - 다소 용량 큼
> - 아웃풋 이미지로 최고

> [!info] GIF
> 
> - Alpha
> - 애니메이션 가능
> - 퀼리티가 매우 낮음
> - 비효율적 확장자
> - 웹용 움짤
> - 최대 256컬러

> [!info] EXR
> 
> - 최대 32bit/channel
> - Multi-Layer지원
> - Alpha
> - Linear workflow (감마값 1)

> [!info] PSD
> 
> - 최대 32bit/channel
> - Multi-Layer지원
> - Alpha
> - Linear workflow (감마값 1)

> [!info] TIF
> 
> - 최대 32bit/channel
> - Alpha
> - Linear workflow(감마값 1)
> - Multi-Layer지원
>     - TGA와는 다르게 레이어보존이 가능한 무손실압축파일

> [!info] TGA
> 
> - 무손실압축파일
> - 포토샵에서 RGBA채널을 가진 텍스쳐를 완성하고 저장하면 tga option을 선택창이 나타나는데 **Resolution> 32bit에서만 알파값을 지원함**
> - tga는 레이어 보존이 불가능하기 때문에 최종수정본은 BackGroundLayer 하나로 Merge했을 때 추출이 가능하다!
>     - TIF는 레이어 보존이 가능하지만..용량이 커짐

> [!info] HDR
> 
> - 8/16비트의 HDR이미지의 경우 Gamma값 2.2로 셋팅
> - 32비트의 HDR이미지의 경우 Gamma값 1로 세팅

> [!tip] 추가자료
> 
> - [PNG vs TGA](https://bit.ly/3oRhAZs)


---

## Video File Format

> [!info] WMV
> 
> - 마이크로 소프트 개발
> - Mpeg-4 Part2
> - 스트리밍 용
> - 가변프레임레이트

> [!info] AVI
> 
> - 마이크로 소프트 개발
> - 영상 / 소리
> - 코덱종류 많음
> - 호환성 문제 있음

> [!info] MKV
> 
> - 비디오 오디오 그림 자막
> - 흔히 영화/드라마 압축용
> - 멀티미디어 콘텐츠
> - 다중 트랙 포맷
> - 다국어 음원

> [!info] MP4 (확인용 포멧)
> 
> - Mpeg-4 Part 14규격
> - 저작권 기술등 표준 규격
> - H. 264
> - H. 265

> [!info] MOV (최종아웃풋용 포맷)
> 
> - 애플 개발
> - 대부분 영상 기기
> - ProRes 압축방식

---

## 3D File Format

> [!info] OBJ
> 
> - 모델링 파일 컨버팅용
> - 폴리곤/ 텍스처

> [!info] FBX
> 
> - PSR/PLA 애니메이션
> - 다른 Tool에서도 **수정 가능**
> - 라이트/리깅/텍스처
> - 스플라인
> - Vertex Map, Vertex Color
> - 주로 PSR애니메이션 호환용
> - 게임 엔진 호환용

> [!info] ABC
> 
> - PSR / PLA 애니메이션
> - 추가 메시 애니메이션
> - **Baked** 상태라 **수정 불가능**
> - 스플라인, 파티클 가능
> - UV Vertex Map, Vertex Color
> - 후디니, 리얼플로우 컨버팅용

> [!info] ORBX
> 
> - OTOY 개발
> - Abc 기반 확장자
> - 씬 전체 옥테인 베이크용

> [!info] FGA
> - Vector Field 확장자