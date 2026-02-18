---
title: Virtual Shadow Map
date: 2024-02-18
tags:
  - Unreal
  - Lighting
---
Virtual Shadow Map(VSM)은 언리얼 엔진 5에서 도입된 새로운 그림자 렌더링 기술입니다.

기존의 전통적인 Cascaded Shadow Map 방식과 달리, 화면에 노출되는 영역만 고해상도로 계산하여 메모리 효율성을 극대화하고 높은 디테일의 그림자를 생성합니다. 
이 문서는 VSM의 특성과 실무에서 마주치는 문제들의 해결 방법을 정리한 내용입니다.

## Virtual Shadow Map의 작동 원리

Virtual Shadow Map은 초대형 런타임 버추얼 텍스처로 작동합니다. 
화면에서 각 영역이 차지하는 크기에 따라 동적으로 다른 해상도로 렌더링되기 때문에, **카메라에 가까운 영역은 높은 해상도로, 먼 영역은 낮은 해상도로 그림자를 생성**합니다.

이러한 방식은 메모리 사용을 최적화하면서도 필요한 곳에 높은 품질의 그림자를 제공할 수 있다는 장점이 있습니다. 특히 Nanite Geometry와 함께 사용할 때 최적의 성능을 발휘합니다.

## Soft Shadow 표현의 한계와 해결 방법

Virtual Shadow Map은 하드하거나 세미-하드한 조명 환경에는 적합하지만, 소프트한 조명 환경에서는 표현에 한계가 있습니다.
특히 Lumen과 함께 사용할 때 그림자의 반음영(penumbra) 표현이 제한적입니다.

![[VSM vs RTS.png]]

#### 소프트 섀도우 구현 방법

부드러운 그림자 효과가 필요한 경우, 다음과 같이 Ray-Traced Shadow를 활성화할 수 있습니다.
- Local Light의 디테일 패널에서 **Cast Raytraced Shadow**를 **Enable**로 설정합니다.
- **Raytracing Samples** 값을 1~4 사이로 설정하면 그림자 아티팩트가 제거되고 부드러운 그림자를 얻을 수 있습니다.

>[!warning] 
>Ray-Traced Shadow는 그림자의 다이나믹 레인지를 향상시키지만, 
>렌더링 성능이 크게 저하될 수 있습니다.

---

## Trouble Shooting

### Nanite Geometry 관련 Issue

#### 얼룩덜룩한 그림자 제거

이 옵션은 Nanite 메시의 레이 트레이싱 처리 방식을 변경합니다.

```
r.RayTracing.Nanite.Mode 1
```

Nanite 메시에서 Ray Tracing과 함께 사용할 경우 발생할 수 있는 얼룩덜룩한 그림자 렌더링 오류를 해결합니다.

#### Two-Sided Geometry 그림자 문제

양면 메시에서 그림자 아티팩트가 발생할 경우

```
r.Raytracing.Shadows.EnableTwoSidedGeometry 0
```

양면 그림자 계산을 비활성화하여 문제를 해결합니다.


### Foliage 관련 이슈

#### Non-Nanite 폴리지 그림자 품질 향상

```
r.Shadow.Virtual.NonNanite.IncludeInCoarsePages 0
```

Coarse Page 포함을 제거해 불필요한 해상도 낭비를 줄입니다.

#### 그림자 거리 확장

폴리지 그림자의 유지 거리를 확장합니다. 예를 들어 5로 설정하면 기본값에서 5배 더 먼 거리까지 그림자가 렌더링됩니다.
```
foliage.LODDistanceScale 5
```

단, Draw Call 증가 가능성이 있습니다.

#### 디버깅 방법

뷰포트 메뉴에서 **표시(Show) → Virtual Shadow Maps → Cached Pages**를 선택하면 VSM의 캐시 상태를 시각화할 수 있습니다.
- 🔴 빨강으로 표시되는 영역: **매 프레임마다 캐시가 무효화되는 영역**입니다. 
  월드 포지션 오프셋이 적용된 폴리지가 이에 해당합니다.
- 🟢 녹색으로 표시되는 영역: **캐시가 유효한 영역**입니다.


### Virtual Shadow Map 거리 및 품질 개선

#### Contact Shadow 길이 조정

엔진 버전에 따라 다른 콘솔 명령어를 사용합니다. 

**5.0~5.1 버전:**
```
r.Shadow.Virtual.ContactShadowLength 0.01
```
(기본값: 0.02)

**5.3 이상 버전:**
```
r.Shadow.RadiusThreshold 0.01
```
(기본값: 0.03)

값을 줄이면 작은 오브젝트의 그림자 유지 거리가 늘어납니다.

#### Shadow Culling 비활성화

엔진에서 자동으로 적용되는 Shadow Culling 최적화를 완전히 해제합니다. 
엔진에서 다루는 그림자 유지 최대 거리에 관한 제한이 해제되지만, 성능 저하가 발생할 수 있습니다.

```
r.RayTracing.Culling 0
```

#### Virtual Shadow Map Bug 수정

> [!tip] Fix Shadow Bugs
>
> ```
>r.Shadow.Virtual.MaxPhysicalPages=8192
>```
>```
>r.Shadow.Virtual.ResolutionLodBiasLocal -2
>```
>```
>r.Shadow.Virtual.OnePassProjection.MaxLightsPerPixel 32
>```
>---
>참고자료: [Fixing virtual shadow bugs in Unreal Engine 5 and Lumen](https://www.artstation.com/blogs/saschahenrichs/b38B/fixing-virtual-shadow-bugs-in-unreal-engine-5-and-lumen)


## 최종 렌더링 품질 향상

### Directional Light 그림자 품질

디렉셔널 라이트의 그림자 품질을 향상시킵니다. SMRT(Shadow Map Raytracing)의 레이 개수를 증가시켜 더 부드럽고 정확한 그림자를 생성합니다.

```
r.Shadow.Virtual.SMRT.RaycountDirectional 4
```

### 무비 렌더 큐에서의 노이즈 문제

Virtual Shadow Map 또는 Ray-Traced Shadow 사용 시 무비 렌더 큐에서 노이즈가 증폭되는 현상이 발생할 수 있습니다.

#### 해결 방법

무비 렌더 큐 설정에서 안티 앨리어싱 항목을 다음 중 하나로 설정합니다.
- **Temporal AA (TAA)**: 표준 시간적 안티 앨리어싱
- **Temporal Super-Resolution (TSR)**: 더 높은 품질의 업스케일링과 안티 앨리어싱을 제공하는 UE5의 새로운 기술

TSR은 TAA보다 더 선명한 결과물을 제공하므로, 최종 렌더링에서는 TSR 사용을 권장합니다.


---
**참고자료**
- [Virtual Shadow Maps](https://docs.unrealengine.com/5.0/en-US/virtual-shadow-maps-in-unreal-engine/)
- [Fixing Virtual Shadow Bugs in Unreal Engine 5 and Lumen - Sascha Henrichs](https://www.artstation.com/blogs/saschahenrichs/b38B/fixing-virtual-shadow-bugs-in-unreal-engine-5-and-lumen)

