---
title: Strata Shader Propertie
tags:
  - Unreal
  - Material
  - Shader
date: 2026-02-17
draft: false
---

> [!summary] 
> 언리얼 엔진 5.1에서 도입된 Strata는 기존 [[Physically Base Rendering|PBR]] (Material Shading Model)을 확장한 차세대 머티리얼 시스템입니다. 
>기존의 단일 레이어 셰이딩 모델과 달리, Substrate는 **물리적으로 일관된 레이어 구조**를 통해 실제 세계의 복잡한 재질을 더 정확하게 표현할 수 있도록 설계되었습니다.
>이 문서에서는 Strata의 핵심 개념과 주요 파라미터에 대해 다룹니다.

## Strata의 주요 특징

#### 1. 물리 기반 레이어링

여러 메테리얼 레이어를 실제 물리적 구조처럼 쌓아 올릴 수 있습니다.

예를 들면 
- 플라스틱 베이스 위에 광택 코팅을 추가
- 금속 표면 위에 먼지 레이어

각 레이어는 독립적인 물리적 속성^[BSDS: 빛 반응 함수] 을 가지며, 레이어 간 상호작용이 현실과 같이 계산됩니다.

#### 2. 에너지 보존

빛의 에너지가 물리 법칙에 따라 엄격히 보존됩니다
즉, 반사, 투과, 흡수되는 빛의 양이 입사광을 초과하지 않습니다.

이를 통해 어떤 조명 환경에서도 일관되고 믿을 수 있는 결과를 얻을 수 있습니다.
하이라이트가 과장되거나 비현실적으로 밝아지는 문제가 줄어듭니다,

#### 3. 통합된 셰이딩 모델

기존 언리얼 엔진의 다양한 셰이딩 모델(Default Lit, Subsurface, Clear Coat 등)을 **하나의 통합된 시스템으로 대체합니다**
더 이상 셰이딩 모델을 전환할 필요 없이 **BSDF를 조합하여 원하는 물리 구조를 설계합니다.** 
그래서 파라미터 조정만으로 다양한 재질을 표현할 수 있습니다.

---

## Substrate Slab BSDF 이해하기

Substrate의 기본 단위는 **Substrate Slab BSDF**입니다.

[BSDF(Bidirectional Scattering Distribution Function)](https://en.wikipedia.org/wiki/Bidirectional_scattering_distribution_function)는 표면에서 빛이 어떻게 반사되고 투과되는지를 수학적으로 정의하는 함수입니다.
**Slab**은 "두께가 있는 물질 레이어"를 의미합니다.
즉, Slab BSDF는 **단일 메테리얼 레이어를 정의하는 노드**라고 이해해 볼 수 있습니다.

## 주요 속성

#### Diffuse Albedo (확산 반사 색상)

비금속 재질 표면의 기본 색상입니다.
값 범위는 0~1이고 0에 가까울수록 흡수율이 높습니다.

> [!warning]
> 금속(Metallic=1)에서는 Diffuse Albedo가 거의 사용되지 않습니다.


#### F0 (Fresnel at 0 Degrees)

표면을 정면에서 볼 때의 반사율을 정의합니다.
이는 [[IOR]](Index of Refraction, 굴절률)과 직접적으로 연결됩니다.
<br>
일반적인 값
- 플라스틱/유리: 0.04 (4%)
- 물: 0.02 (2%)
- 다이아몬드: 0.17 (17%)
<br>
> [!note]
> 금속의 경우 F0 값이 색상을 결정하며, 높은값(0.5~1.0)을 가집니다

#### F90 (Edge Tint / Edge Specular Color)

표면을 비스듬한 각도에서 볼 때의 반사 색상을 정의합니다
[Fresnel](https://en.wikipedia.org/wiki/Fresnel_equations) 효과에 의해 각도가 벌어질수록 F90 값에 가까워집니다

대부분의 재질은 1.0(완전 반사)에 가까운 값을 사용하지만, 
패브릭 등 특수한 재질은 이 값을 조정하여 Edge 톤을 제어할 수 있습니다

#### Roughness (거칠기)

표면의 미세한 거칠기를 정의합니다.
0이라면 완벽하게 매끄러운 거울 같은 반사
1이라면 완전히 거친 확산 반사

실제 세계에서 완벽하게 매끄러운 표면(0)은 거의 존재하지 않습니다.
0.02 이하 값은 물리적으로 매우 매끄러운 상태입니다.

#### Metallic (금속성)

재질이 금속인지 비금속인지를 정의합니다

0이라면 비금속 (유전체, Dielectric)
1이라면 금속 (전도체, Conductor)

중간값은 물리적으로 정확하지 않으므로
값은 **0 또는 1** 사용을 권장합니다.

#### SSS MFP (Mean Free Path)

![[Strata MSF helpnode.png]]

빛이 물질 내부로 들어가 산란되기 전까지 이동하는 평균 거리를 정의합니다

기존 PBR 셰이더에서 Subsurface Color로 추상화했던 물리적 프로퍼티를 직접 제어할 수 있습니다

값이 클수록 빛이 더 깊이 침투하여 부드러운 외관을 만듭니다.
RGB 채널별로 다른 값을 설정할 수 있어 피부의 붉은 빛 투과 같은 현상을 표현할 수 있습니다
<br>
**예시**

| 재질   | 대략적 MFP |
| ---- | ------- |
| 피부   | 수 mm    |
| 우유   | 수 mm    |
| 얼음   | 수 cm    |
| 맑은 물 | 수 m     |


> [!note] **왜 Opacity가 없어졌나요?**
> - Strata에서는 Opacity가 별도의 입력으로 제공되지 않는 이유는 Opacity 자체가 본질적으로 MFP(Mean Free Path)이기 때문입니다.
> - 완전히 투명한 재질을 만들고 싶다면 해당 매질을 통과하는 빛의 MFP 값을 매우 높게 설정해야 합니다
> - 예시: 맑은 유리는 MFP가 수 미터에 달하지만, 반투명 플라스틱은 수 mm에 불과합니다

<br>

#### SSS Phase Anisotropy (이방성 위상 함수)

물질 내부에서 빛이 산란될 때의 방향성을 정의합니다
- -1이라면 후방 산란 (빛이 들어온 방향으로 되돌아감)
- 0이라면 균등 산란 (모든 방향으로 고르게 산란)
- 1이라면 전방 산란 (빛이 들어온 방향으로 계속 진행)

피부는 일반적으로 약간의 전방 산란 특성(0.3~0.7)을 보입니다.

---

**참고자료**
- [Substrate Materials in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/substrate-materials-in-unreal-engine?application_version=5.3)
- [양방향 산란 분포 함수 - 위키피디아](https://en.wikipedia.org/wiki/Bidirectional_scattering_distribution_function)
- [Scattering - Wikipedia](https://en.wikipedia.org/wiki/Scattering#Anisotropic_scattering)
