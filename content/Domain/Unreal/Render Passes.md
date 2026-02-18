---
aliases:
  - Custom Passes
  - Multi Passes
  - AOVs
date created: 2022-07-18
tags:
  - "#Composition"
  - Rendering
  - Cinematic
---

언리얼 엔진에서 렌더 패스(Render Passes)는 최종 이미지를 구성하는 개별 레이어를 분리하여 출력하는 기능입니다. 이 기능은 주로 후반 작업에서 컴포지팅(Compositing)과 컬러 그레이딩을 위해 사용되며, 각 요소를 독립적으로 조정할 수 있어 작업의 유연성을 크게 향상시킵니다.

렌더 패스를 활용하면 조명, 그림자, 반사, 깊이(Depth) 등의 정보를 별도로 추출하여 Adobe After Effects나 Nuke 같은 컴포지팅 소프트웨어에서 세밀하게 조정할 수 있습니다.

언리얼 엔진에서는 이 작업을 주로 **Movie Render Queue(MRQ)**를 통해 수행합니다.

> [!info] ⚙️**필수 PlugIn**
MRQ Additional Render Passes ✅
Movie Render Queue ✅

## 언리얼에서 추출 가능한 패스 종류

>Stancil
> Object ID (Cryptomatt)
> Z-depth
>Ambient Occulusion
>Unlit
>Shadow
>Detail Lighting
>Lighting
>Reflection
>Motion Vector
>World Normal
>World Position

## 커스텀 패스를 위한 Post Process Material 기본 설정

커스텀 패스를 만들기 위한 **메테리얼 공통 설정 방법**입니다.

- **메테리얼 도메인 설정**
	- 새 메테리얼을 생성하고 디테일 패널에서 Material Domain을 `Post Process`로 변경합니다

- **블렌더블 위치 설정**
	- Blendable Location을 `Before Tonemapping`으로 설정합니다.
		- 기본값인 After Tonemapping은 톤 매핑 이후 단계에서 처리되어 Post Process Volume에 적용 시 화면 떨림 현상이 발생할 수 있습니다.
		- Before Tonemapping은 톤 매핑 전 선형 색 공간에서 작업하므로 더 정확한 결과를 얻을 수 있습니다

- **Bloom 비활성화**
	- Bloom 값을 0으로 설정하여 불필요한 빛 번짐 효과를 제거합니다

## Step1. 렌더 패스 종류 및 설정

### Z-depth Pass

깊이 정보를 추출하는 커스텀 패스입니다. 

컴포지팅 단계에서 DOF(피사계 심도)나 안개/대기원근 효과를 추가하거나
노이즈 없는 깔끔한 모션 블러 효과를 구현할 수 있습니다.

![[M_Z-depth.png|800]]

> [!error] Procedural Lighting 시스템을 사용하는 경우, 하늘 영역이 반구 형태로 나눠져 렌더되어 깊이값이 올바르게 계산되지 않을 수 있습니다.

### 마스킹 및 오브젝트 분리 패스

오브젝트를 선택적으로 분리하거나 마스크를 생성하는 패스들입니다.

> [!info] **공통 필수 설정**
> Project Settings → Rendering → Custom Depth-Stencil Pass - Enabled with Stencil로 변경.

#### 옵션 1: Alpha Pass (단일 오브젝트)

한두 개 오브젝트만 빠르게 마스크로 뽑을 때 적합합니다. 

##### Material
![[M_alphapass.png.png|800]]

Scene Texture 노드는 현재 렌더링된 장면의 다양한 버퍼 정보(색상, 깊이, 노멀 등)에 접근할 수 있게 해주는 포스트 프로세스 전용 노드입니다.

##### Asset Setting

마스킹할 오브젝트를 선택하고 다음과 같이 설정합니다.

![[Alphapass.png|800]]
 
- **Render CustomDepth Pass** 활성화 ✅
- **Custom Depth Stencil Value** 설정 지정 - 0 or 1

> [!note] **폴리지 액터**는 Foliage Mode에서 선택한 폴리지 타입의 설정에서 Custom Depth 옵션을 활성화할 수 있습니다.

> [!warning] Nanite 메시의 Custom Depth 지원 여부는 엔진 버전에 따라 달라질 수 있습니다. 
> 문제가 생기면 “해당 오브젝트만 Nanite 비활성화” 또는 “Stencil Layers 방식으로 분리” 하는 대안이 있습니다.

#### 옵션 2: RGB Split Pass (3개 그룹으로 마스킹)

하나의 패스로 세 가지 마스크를 동시에 추출하는 효율적인 방법입니다. 
RGB 각 채널에 서로 다른 오브젝트 그룹을 할당하여 컴포지팅 단계에서 채널 별로 분리하여 활용할 수 있습니다.

![[M_RGBSplitpass.png|800]]

예를 들어, R 채널에는 캐릭터, G 채널에는 배경 오브젝트, B 채널에는 이펙트 요소를 할당하는 식으로 구성할 수 있습니다.

> [!tip] 합성 팁
> After Effects에서는 `Shift Channels` 또는 채널 분리 방식으로 R/G/B를 각각 마스크로 사용할 수 있습니다.

#### 옵션 3: Stencil Layers (레이어 기반)

선택한 레이어 그룹만 분리해서 렌더링하는 방법입니다.

##### 설정 방법

1️⃣ **레이어 생성**
Outliner에서 오브젝트를 선택하고 우클릭 → Layer → Add Selected Actors to New Layer

2️⃣ **Movie Render Queue 설정**
- Deferred Rendering 탭
	- **Accumulator Includes Alpha** 활성화 ✅ 
	- Actor Layer 최소 2개 이상 엘리먼트 추가 
	  (Index 1번으로 등록한 레이어가 최종적으로 출력됨)
- OpenColorIO 설정
	- OCIO를 사용하지 않으면 **Tone Curve를 비활성화**하는 편이 안전합니다.
	- Tone Curve가 켜진 상태에서 알파 경계가 변형되어 엣지에 할로(halo)가 생기는 경우가 있습니다.

![[Isolate object pass.png]]

#### 옵션 4: Cryptomatte (Object ID)

각각의 오브젝트를 고유 ID Type으로 분리하여 컴포지팅 단계에서 씬에 배치된 오브젝트를 정밀하게 선택할 수 있습니다.

##### Movie Render Queue Setting

**Deferred Rendering**
Disable Multisample Effects 활성화✅ (안티앨리어싱으로 인한 ID 경계 흐림 방지)

**Output Format**
파일 형식: EXR
압축: PIZ 이상

![[Object ID Setting.png|500]]

> [!warning] VDB의 ID할당은 5.5 이상 버전에서 지원합니다.

---

### 조명 및 셰이딩 패스

다양한 조명 및 렌더링 요소를 개별 패스로 분리합니다.

#### Lighting

전체 조명 정보가 포함된 패스로 무비랜더큐에서 지원합니다.

#### Detail Lighting

세밀한 조명 디테일만 분리된 패스로 무비랜더큐에서 지원합니다.

#### Reflection

반사 정보만 추출한 패스로 무비랜더큐에서 지원합니다.

#### Unlit

조명이 적용되지 않은 Base Color 패스로 무비랜더큐에서 지원합니다.


#### World Normal

표면 법선 방향을 RGB 컬러로 표현한 패스로 언리얼 엔진에서 커스텀패스 메테리얼을 지원합니다.

### 그림자 패스

#### Shadow Catcher
실사 배경에 CG 오브젝트를 합성할 때 그림자만 추출하는 패스입니다. VFX 작업에서 매우 유용합니다.

참고 영상: [Unreal Engine Shadow Catcher](https://youtu.be/4m5lN1I9gtc?si=u2wGX0Kx9XKUF5k6)

##### 오브젝트 설정 방법
Shadow Catcher로 사용할 오브젝트를 선택하고

**방법 1**:
- Rendering > Visible 옵션 비활성화
- Rendering > Hidden Shadow 옵션 활성화

**방법 2**:
- Movie Render Queue의 Deferred Rendering 설정에서 해당 오브젝트만 별도 레이어로 분리

---

## Movie Render Queue 최종 아웃풋 설정

### 멀티 패스 출력

복잡한 시뮬레이션(Niagara, Chaos 등)이 포함된 씬에서는 여러 번 렌더링하면 최종 출력 이미지의 프레임 간 미세한 차이가 발생할 수 있습니다. 이를 방지하기 위해 모든 패스를 한 번에 출력하는 방법을 다룹니다.

#### 설정 방법

Movie Render Queue → Deferred Rendering 섹션에서 
Additional Post Process Material 슬롯을 추가해서 필요한 모든 포스트 프로세스 머티리얼을 차례대로 설정합니다.

![[Multipass_output.png|700]]

이렇게 설정하면 세가지 이점을 얻을 수 있습니다.
- 모든 패스가 동일한 프레임 상태에서 렌더링됩니다.
- 시뮬레이션 캐시가 일관되게 유지됩니다.
- 렌더링 시간이 효율적으로 관리됩니다.

## After Effects에서 패스 활용하기

### Z-depth Pass 활용

![[After effect depth pass setting.png]]

1️⃣ 레이어 패널에서 렌더링된 깊이 패스를 선택합니다.
2️⃣ Black Point와 White Point 값을 조정하여 깊이감의 범위를 설정합니다.

> [!tip] 
> Camera Lens Blur 또는 CC DOF 이펙트를 적용하여 피사계 심도 효과를 만듭니다

**DOF**

![[After effect DOF.png]]

### Cryptomatte (Object ID) 활용

1. Effect → Keying → Cryptomatte 적용
2. Shift + 좌클릭으로 오브젝트 ID 선택
3. 선택된 오브젝트의 매트(matte)가 자동 생성됩니다.

### 매트 정리 (Matte Cleanup)

깔끔하게 마스크의 엣지를 다듬는 키 클리너 방법은 두가지가 있습니다.

방법1. After effect → effect → Refine Soft matte에서 Additional Edge Radius 값 조정

방법2. After effect → effect → Roughen Edges → Edge Sharpness 값 조정


---
**참고자료**
- [Cryptomattes & Render Passes with Unreal Engine 4.26 - YouTube](https://www.youtube.com/watch?v=RHemgKcIYMM&list=WL&index=79)