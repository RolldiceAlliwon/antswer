---
aliases:
  - Quad Overdraw
date: 2024-07-08
tags:
  - Profiling
  - Optimization
  - GPU
  - Unreal
description: GPU 병목 분석
---
## GPU는 “같은 계산”은 좋아하지만, “같은 픽셀을 여러 번 그리는 것”은 싫어한다

GPU는 병렬 연산에 최적화되어 있다.
동일한 셰이더 연산을 수천 개 병렬로 수행하는 것은 효율적입니다.

그러나 **동일한 픽셀 위치에서 Pixel Shader가 반복 실행되는 상황**은
불필요한 연산을 발생시키며 성능 저하의 원인이 됩니다.

 이러한 GPU 렌더링 파이프라인에서 발생하는  **Pixel Shadering 비효율성 문제**를 **Quad Overdraw**라고 합니다.

---

## Quad Overdraw (Over Shading)

**Quad Overdraw**는 화면에 최종적으로 보이지 않는(가려진) Pixel이 여전히 Shader 연산에 포함되어 계산되는 현상입니다. 

이 현상은 특히 **화면 상에서 아주 작게 렌더링되는 삼각형들**로 인해 발생합니다.


>**예시**
> - Fog Card 3장이 서로 겹쳐 있음
> - 동일 픽셀에서 픽셀 셰이더가 3번 실행
>```java
>Layer × Pixel = 3
>```
>즉, 같은 위치를 3번 그림.

<br>

### GPU의 처리 방식

GPU는 2x2 픽셀 단위(Quad)로 삼각형을 셰이딩한다. 어떤 폴리곤이 래스터라이징을 거쳐 화면의 픽셀로 셰이딩 처리를 해야 할 때, **1픽셀이 아닌 2x2 픽셀 그룹 단위로 처리**된다는 말입니다다.

![](https://micromang.github.io/assets/img/blog/quad-overshading/a2.png)


> **문제 상황 예시**
> 
> ```
> 삼각형 크기: 0.5픽셀 (화면에 거의 안 보임)
> ↓
> GPU는 2×2 = 4픽셀 쿼드 전체를 처리해야 함
> ↓
> 실제 기여도: 0.5픽셀
> 실제 처리량: 4픽셀
> → 8배 비효율!
> ```

---

### Quad Qverdraw의 문제점

Quad Overdraw는 **Pixel Shader 단계의 비용 증가**이죠.

특히 다음 조건에서 심각해집니다.
>Translucent 머테리얼
>화면을 넓게 덮는 카드형 메시 - ex) Fog Card
>디테일한 하이폴리곤 메시

**Translucent**는 Early-Z (Depth Pass)가 제대로 작동하지 않기 때문에 
뒤에 가려질 픽셀도 모두 계산되죠. 그 결과 **보이지 않는 픽셀까지 셰이더가 실행됩니다다.**

### Quad Overdraw 해결 전략

| 방법                                     | 효과                                      |
| -------------------------------------- | --------------------------------------- |
| **[[Level Of Detail]]를 활용한 지오메트리 최적화** | 거리가 증가할수록 폴리곤 밀도 감소 <br>(가장 직접적인 해결책🔥) |
| **Translucent → Masked**               | Early-Z 활용 가능                           |
| **Depth 정렬 개선**                        | 불필요한 렌더링 감소                             |
| **Volume 기반 Fog**                      | 카드 대체                                   |

> [!info] Early-Z 가 최적화에 끼치는 영향
>
**Masked**로 설정하면, Opacity Mask값에 따라 픽셀이 '100% 불투명' 혹은 '완전 투명(제거)' 둘 중 하나로 처리됩니다. 
그래서 불투명 객체처럼 실제 복잡한 픽셀 쉐이더(색상, 조명 계산)를 실행하기 전, 깊이(Depth)만 먼저 계산하는 **Depth Pass** 단계에서 그려집니다.
>
>결국 이미 다른 불투명 객체에 의해 가려진 픽셀은 조명 계산을 하지 않고 스킵(Early Z-culling)할 수 있어 성능이 크게 향상됩니니다.

---

## Foliage 최적화 사례

### ❌ 비효율적인 Translucent 기반 Foliage

```
문제점:
- 투명 영역 전체가 Translucent 처리
- 빈 공간까지 Pixel Shader 실행
- Quad Overdraw 심화
```

### ✅ Binary Mask 사용으로 최적화

```
개선 방법:
- Masked 머티리얼 사용
- Alpha Test 기반 컷아웃
- 불필요한 투명 영역 제거
```

> [!info] Masked의 장점 
> **Early-Z 활용 가능**하여 Translucent 대비 Overdraw 대폭 감소합니다.
>
>**성능 차이**
>```
>Translucent Plane 100개: 15ms
>Masked Geometry 100개: 8ms
>→ 약 2배 성능 향상
>```

---

### 프로파일링 도구

```cpp
View Mode → Shader Complexity // Pixel Shader 비용 시각화
View Mode → Quad Overdraw     // Overdraw 시각화 (빨강 = 심각)
// 언리얼 엔진 콘솔 명령어
Stat GPU                      // GPU 프로파일링
```

---
**참고 자료**
- [GPU Gems - Chapter 28. Graphics Pipeline Performance](https://developer.nvidia.com/gpugems/gpugems/part-v-performance-and-practicalities/chapter-28-graphics-pipeline-performance)
- [Unreal Engine Documentation - Performance Guidelines](https://docs.unrealengine.com/5.0/en-US/performance-guidelines-for-artists-and-designers-in-unreal-engine/)
- [쿼드 오버셰이딩, The Silent Performance Killer | 흑기사 방랑일지](https://micromang.github.io/blog/optimization/2023-09-02-quad-overshading/)