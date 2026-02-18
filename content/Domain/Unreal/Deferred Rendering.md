---
date: 2022-02-06
tags:
  - Rendering
  - Direct3D
  - ComputerGrapics
---
## Deferred Rendering이란?

Deferred Rendering(지연 렌더링)은 3D 그래픽스에서 조명 계산을 지오메트리 렌더링 이후로 “지연(defer)”시키는 렌더링 방식입니다.
전통적인 Forward Rendering과 달리, 오브젝트를 그리는 과정(Geometry)과 빛을 계산하는 과정(Lighting)을 분리하여 처리하는 것이 핵심입니다. 
이 방식은 특히 **복잡한 조명이 많은 씬에서 효율적으로 성능을 발휘**합니다

![[개괄적 Deferred Renderings.png]]

#### 기본 원리

- Deferred Rendering은 화면 해상도와 동일한 여러 개의 Render Target을 생성합니다. 이 묶음을 **G-Buffer(Geometry Buffer)**라고 부릅니다.
- 화면의 각 픽셀단위로 화면 공간에 저장되는 G-Buffer는 일반으로 아래 정보를 저장합니다.
    - BaseColor=Albedo (표면의 색상 정보)
    - Roughness (표면의 거칠기)
    - Surface Normal (표면의 방향 벡터)
    - Metalic
    - Specular
    - Depth (Z-buffer는 별도 저장)
-  Deferred Rendering은 **Rasterization 기반**이며, Ray Tracing과는 별개의 파이프라인입니다.

> [!tip]
> **Deferred**의 최대 약점은 유리, 물 같은 **반투명(Transparency)** 물체 처리입니다. 
> **Deferred**에서 투명 오브젝트는 사실상 **Forward 패스로 처리됩니다.**

---

## Deferred Rendering의 장점

#### 효율적인 구조

Forward Rendering에서는
> 오브젝트 수 × 라이트 수 만큼 셰이딩 연산이 발생

Deferred Rendering에서는
> 픽셀 수 × 라이트 수

- 오브젝트 복잡도와 Lighting 계산이 분리되어(Decoupling) 각각 독립적으로 처리됩니다.
- 코드가 단순하고 유지보수가 용이하며, 씬에서 더 나은 성능과 유연성을 제공합니다.

#### 다중 조명 처리에 유리

- 여러 개의 라이트가 있는 씬에서도 각 라이트마다 오브젝트를 다시 그릴 필요가 없습니다.
- G-Buffer에 저장된 정보를 재사용하므로 라이트 개수에 비례하는 성능 저하가 적습니다.

#### 선택적 데이터 활용

- 일부 렌더링 기법은 G-Buffer의 일부 채널만 필요로 합니다.
- 예를 들어 Shadow나 Fog 계산의 경우 Depth Buffer(Z-Buffer)에만 접근하면 충분합니다.

## Deferred Rendering의 단점

#### 높은 메모리 사용량

- G-Buffer는 여러 개의 고해상도 텍스처입니다. 그래서 GBuffer를 생성하고 읽고 쓰는 과정에서 상당한 메모리가 필요합니다.
- 해상도가 높을수록 메모리 사용량과 대역폭 요구량이 급격히 증가합니다
- 모바일이나 VR처럼 메모리 대역폭이 제한적인 플랫폼에서는 성능에 큰 영향을 미칩니다

| 항목            | Deferred Rendering이 적합한 경우 | Forward Rendering이 적합한 경우 |
| ------------- | -------------------------- | ------------------------- |
| 🎮 프로젝트 규모    | AAA급 대형 프로젝트               | 소형 프로젝트, 최적화 중심           |
| 💡 동적 라이트 수   | 수십~수백 개 확장가능               | 라이트 수가 매우 제한적             |
| 🎨 머티리얼 다양성   | 다양한 PBR 머티리얼 사용            | 머티리얼 종류 많을수록 성능 저하        |
| 🌍 글로벌 일루미네이션 | Lumen 사용                   | 스태틱 라이트맵 또는 제한적 사용        |
| 📱 플랫폼        | PC / 콘솔 (PS5, Xbox)        | 모바일                       |
| 🥽 VR 지원      | 일반 모니터 기반                  | VR (가장 깔끔한 외곽선)           |
| 🔍 안티앨리어싱     | TAA / TSR 사용               | MSAA 필수                   |
| 🧠 메모리 대역폭    | G-Buffer 사용으로 **사용량 높음**   | 상대적으로 **사용량 낮음**          |

#### Anti-Aliasing 문제

![[Problem is AA.png|500]]

- MSAA(Multi-Sample Anti-Aliasing)를 G-Buffer에 적용하면 각 샘플마다 G-Buffer 데이터를 저장해야 해서, 메모리 요구량이 크게 증가합니다 $$G-Buffer 크기 × MSAA 샘플 수$$
- 이 때문에 Unreal Engine의 기본 Deferred Renderer는 MSAA를 지원하지 않고, 대신 **Temporal AA(TAA)** 또는 **TSR**을 사용합니다.

---

# Classic Deferred Shading의 렌더링 패스

전통적인 Deferred Shading은 크게 두 가지 패스로 구성됩니다:

#### 1. Geometry Pass (G-Buffer 생성)

- 씬의 모든 오브젝트를 렌더링하여 Material과 Geometry 속성을 Pixel Shader를 통해 계산합니다.
- 계산된 결과를 G-buffer의 각 채널에 저장합니다
- 이 단계에서는 조명 계산 없이 표면의 물리적 속성만 기록합니다

#### 2. Lighting Pass (최종 셰이딩)

- G-Buffer에 저장된 정보 + 씬의 조명 정보를 결합하여 최종 색상을 계산합니다
- 각 라이트는 화면 공간에서 영향을 미치는 픽셀들에 대해서만 계산을 수행합니다
- 라이트의 복잡도가 Material의 복잡도와 분리되어 있어, 복잡한 Material과 많은 수의 라이트를 동시에 사용해도 효율적으로 처리할 수 있습니다

이러한 구조 덕분에 Deferred Rendering은 AAA급 게임과 같이 높은 비주얼 퀄리티가 요구되는 프로젝트에서 널리 사용되고 있습니다.


> [!tip] UE5 Deferred Rendering Pass
> UE5의 Deferred Renderer는 전통적인 2-pass 구조보다 더 복잡합니다.
> - Depth Pre-pass
> - Base Pass (G-buffer 생성)
> - Shadow Pass
> - Lighting Pass
> - Post-processing


---
**참고 자료**
- [Unreal Engine Documentation - Rendering](https://docs.unrealengine.com/en-US/RenderingAndGraphics/)
- [Learn OpenGL - Deferred Shading](https://learnopengl.com/Advanced-Lighting/Deferred-Shading)