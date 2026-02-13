---
title: Virtual Shadow Map
date: 2024-02-18
tags:
  - Unreal
  - Lighting
---

## Soft shadow - Hardtracing Raytracing vs Virtual Shadow Map

- Lumen 과 Virtual Shadow Map 메소드를 사용할 때 그림자 반음부 (그림자의 부드러운 바깥쪽 가장자리) 의 표현이 제한됩니다.

- Virtual shadow map은 Hard/Semi-hard 조명에는 적합하지만 soft lighting에는 적합하지 않음

- Soft한 그림자로 바꿔주려면
	- Local Light properties- Cast Raytracing Shadow 'Enable'로 바꿔주고 Raytracing sample 값을 1~4 사이로 입력해주면 그림자의 Artifect가 사라지고 부드러운 그림자 효과를 낼 수 있습니다.

![](https://velog.velcdn.com/images/coolguykeepgoing/post/d59dee9c-d361-408f-89dd-e91e2b2078c3/image.png)


> [!tip] Console Command
> 폴리지 그림자 품질 유지 및 퍼포먼스 향상  
>```
>r.Shadow.Virtual.NonNanite.IncludeInCoarsePages 0
>```
>---
>**디버깅**: 뷰포트 - 표시 - 버츄얼 쉐도우 맵 - Cashed page  
>월드 오프셋이 들어있는 폴리지는 매 프레임마다 캐시가 무효화되어 빨간색으로 나타난다.
