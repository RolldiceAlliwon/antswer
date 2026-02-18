---
date: 2026-02-16
tags:
  - Unreal
  - Material
---

> [!summary] 
> Unreal Engine의 Decal은 메시 표면에 텍스처를 투사하여 디테일을 추가하는 기법입니다. 
>물 웅덩이, 총알 자국, 마법진 등 다양한 시각적 효과를 효율적으로 구현할 수 있습니다. 
>
>이 글에서는 데칼 머티리얼 제작부터 최적화 방법까지 데칼 제작에 필요한 내용을 다룹니다.

## Master Material

데칼 마스터 머티리얼은 프로젝트의 요구사항에 따라 유연하게 설계할 수 있습니다.

![[Dacal master.png]]


#### 데칼의 주요 특징

- Material Domain이 Deferred Decal로 설정되며 기본적으로 반투명(Translucent) 속성을 가집니다
- Decal은 GBuffer의 일부 채널만 수정할 수 있기 때문에 Metallic이나 Specular와 같은 속성은 제한적으로 동작하거나 무시할 수 있습니다.

#### 활용 사례

- 젖은 표면 효과 (웅덩이, 비에 젖은 바닥)
- 마법진이나 홀로그램 같은 발광 효과
- 총알 자국, 긁힌 흔적 등의 데미지 표현
- 바닥 표지판이나 페인트 마킹

---

## Decal Material

데칼의 Blend Mode에 따라 표면과의 상호작용 방식이 달라집니다.

#### Decal Blend Mode 종류

![[Decal Blend mode compare.png]]

- **Translucent**: 가장 일반적인 모드로, 알파 블렌딩을 통해 기존 표면과 혼합됩니다
- **Stain**: Base Color만 영향을 주며, 표면의 색상만 변경합니다.
- **Normal**: Normal Map만 변경하고 다른 속성은 유지합니다
- **Emissive**: Emissive 채널만 사용하여 발광 효과를 만듭니다
- **DBuffer Translucent**: 조명 계산 전단계에서 GBuffer에 정보를 기록하여, 정적 라이팅 및 그림자와 자연스럽게 상호작용합니다.

각 모드의 선택은 표현하고자 하는 효과에 따라 결정됩니다.

## 효율적으로 데칼 결합하기

여러 데칼이 겹칠 때의 최적화 방법과 제어 방법에 대해 다룹니다.

#### 오브젝트별 데칼 영향 제어

특정 오브젝트가 데칼의 영향을 받지 않도록 설정할 수 있습니다.
- Static Mesh 또는 Actor의 Details 패널에서 Rendering 섹션을 찾습니다
- **Receive Decals** 옵션을 체크 해제하면 해당 오브젝트는 데칼을 받지 않습니다

#### 데칼 렌더링 순서 조절

같은 공간에서 여러 데칼이 겹쳐져 투사될 때 데칼 간의 우선순위를 지정할 수 있습니다.
- Decal Actor의 Details 패널에서 **Sort Order** 값을 조정합니다.
- 숫자가 클수록 나중에 렌더링되어 위에 표시됩니다
- 기본값은 0이며, 음수 값도 사용 가능합니다

---

## Trouble Shooting

데칼 작업 시 발생할 수 있는 문제와 해결 방법입니다.

#### 그림자에 의해 데칼이 사라지는 현상

그림자가 데칼을 가리는 문제는 렌더링 파이프라인 설정으로 해결할 수 있습니다.

**Project Settings 수정**
- Edit → Project Settings → Engine → Rendering 섹션으로 이동합니다
- **Early Z-pass**를 'Opaque And Masked Meshes'로 설정합니다
	- Early Z-pass는 깊이 정보를 먼저 처리하여 픽셀 오버드로우를 줄이는 기술입니다.
- **DBuffer Decals**를 Enable로 설정합니다
	- DBuffer Decal을 사용하려면 Early Z-pass가 활성화되어 있어야 하며, 이는 조명 계산 전에 적용되도록 하여 라이팅을 올바르게 적용되도록 합니다.

**Material 설정**
- Decal Material의 **Decal Blend Mode**를 Translucent로 설정합니다.
- ⚠️ 주의: 이 모드에서는 조명 계산 이후에 합성되므로, 데칼이 그림자의 영향을 받아 밝기가 어두워질 수 있습니다.
- ❗필요에 따라 Emissive를 추가하여 밝기를 보정할 수 있습니다.

---
**참고자료**
- [Decals in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/decals-in-unreal-engine?application_version=5.3)
- [UE5.0 Decal Tips in 1 minute](https://www.youtube.com/watch?v=f8lfuaSE9R0)
