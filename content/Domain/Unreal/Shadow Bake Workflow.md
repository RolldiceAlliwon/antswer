---
date: 2026-02-23
tags:
  - Optimization
  - Lighting
  - Unreal
  - Blender
  - Shadow
---
실시간 렌더링 환경에서 복잡한 조명 기구가 만드는 그림자를 미리 텍스처로 베이킹하여 사용하는 최적화 기법입니다. 
샹들리에나 장식 조명처럼 **기하학적으로 복잡한 조명 기구의 그림자를 실시간으로 계산하는 것은 퍼포먼스에 큰 부담**이 되는데, 쉐도우 텍스쳐를 활용하면 이러한 연산 비용을 크게 줄이면서도 자연스러운 라이팅 효과를 구현할 수 있습니다.

이 기법은 **오프라인 렌더러(Blender Cycles, Arnold 등)로 쉐도우 맵을 생성**한 뒤, 이를 Unreal Engine의 Light Function에 적용하는 방식으로 동작합니다. 특히 포인트 라이트 형태의 조명에서 효과적이며, 게임 환경뿐만 아니라 건축 시각화나 영상 제작에서도 널리 사용됩니다.

> [!Warning] 한계점
> 
> - 이 기법은 **정적인 조명에만 적합**합니다
> - 조명이 움직이거나 회전하면 그림자도 함께 업데이트되지 않습니다
> - 동적 오브젝트는 베이크된 그림자와 상호작용할 수 없습니다

## 기본 워크플로우

Unreal Engine에서 사용할 그림자 텍스처를 제작하는 전체 과정은 다음과 같습니다.

#### 1️⃣ 준비 단계

- Unreal Engine에서 조명 기구 오브젝트를 **FBX 형식으로 익스포트**합니다.
- 조명 기구의 스케일과 위치 정보를 기록해두면 나중에 정확한 매칭이 가능합니다.

#### 2️⃣ DCC 툴 세팅

- DCC 툴(Blender 또는 Maya)에서 익스포트한 FBX를 임포트합니다.
- 그림자를 받을 **평면 오브젝트(Shadow Catcher)를 배치**합니다.
- 이 평면은 그림자만 캡처하고 자체적으로는 렌더링되지 않도록 설정합니다.

#### 3️⃣ 조명 및 카메라 배치

- 조명 기구의 중심점에 **포인트 라이트**를 배치합니다.
- 같은 위치에 **카메라**를 배치합니다.
- 이 카메라는 360도 전방향 그림자를 캡처하기 위해 파노라마 타입으로 설정됩니다.

#### 4️⃣ 렌더링

- 오프라인 렌더러(Blender Cycles, Arnold 등)를 사용하여 **쉐도우 텍스쳐**를 렌더링합니다.
- 배경은 투명하게, 그림자만 렌더링되도록 설정합니다.

#### 5️⃣ 후처리 및 임포트

- 완성된 텍스처를 **PNG 또는 TGA 포맷**으로 저장합니다.
- Unreal Engine으로 임포트 후 텍스처 설정에서 **'Compress Without Alpha' 옵션을 비활성화**합니다.

#### 6️⃣ Unreal Engine 적용

- Material Domain을 **'Light Function'으로 설정**한 머티리얼을 생성합니다.
- 베이크된 Shadow Map 텍스처를 연결하고, 포인트 라이트의 Light Function에 할당합니다.

> [!tip] Light Function Material 설정
>
>Unreal Engine에서 [Light Fuction](https://docs.unrealengine.com/en-US/BuildingWorlds/LightingAndShadows/LightFunctions/index.html)으로 사용하려면
> 1. 새 Material을 생성합니다
> 2. **Material Domain을 'Light Function'으로 설정**합니다
> 3. Shadow Map 텍스처를 Texture Sample 노드로 불러옵니다
> 4. **Spherical UV 맵핑을 위해 'LightVector' 노드를 사용**하여 UV를 생성합니다
> 5. 결과를 Emissive Color에 연결합니다


---

## Blender에서 작업하기

Blender의 Cycles 렌더러는 무료 오픈소스이면서도 Arnold와 유사한 품질의 그림자 맵을 제작할 수 있어, 파이프라인 구축이 용이합니다. 다음은 Blender를 활용한 워크플로우입니다.

#### 1단계: 프로젝트 세팅

- **New Scene을 생성**하고 기본 오브젝트들을 삭제합니다.
- Render Properties에서 **Render Engine을 'Cycles'로 설정**합니다.
    - Cycles는 물리 기반 렌더러로, 사실적인 그림자 표현에 적합합니다.
- Output Properties에서 **Resolution을 2:1 비율로 설정**합니다.
    - 이 비율은 Equirectangular 투영에 필요한 표준 비율입니다.

![[ShadowBake_01.png|200]]![[ShadowBake_02.png|175]]

#### 2단계: 카메라, 라이트 기본 세팅

테스트를 위한 기본 씬 파일을 다운로드할 수 있습니다:
[ShadowBaker.fbx - Google Drive](https://drive.google.com/file/d/1WKjMIp9BXqAytdGimwPYoMPol4IALBoC/view)

다운로드한 FBX를 임포트하고 다음 오브젝트들을 배치합니다.
- **Camera**: 그림자를 360도로 캡처할 카메라
- **Light**: 조명 기구의 광원 역할
- **BGSphere**: Shadow Catcher 역할을 하는 구체
- **Light Mesh**: 실제 조명 기구 메쉬

![[ShadowBake_03.png]]

✅ 그림자가 왜곡되지 않게 **카메라는 수평으로 설치돼있어야 합니다.** 
(🌏World Positon RX:90 / RY:0 / RZ:0 으로 맞춰주세요.)

![[ShadowBake_04.png]]

> **Light 설정**
> - Power: **1000W 이상**
>	- 실제 조명의 밝기에 맞춰 조정하세요.
>	- 너무 낮으면 그림자가 흐릿하게 나옵니다.
> - Radius: **0.01m 이상**
>	- Radius가 작을수록 **Sharp Shadow(Hard Shadow)**가 생성됩니다.
> - Max Bounces: **1-4** 정도로 설정
>	- ⚠️ 높을수록 렌더 시간이 길어지지만, 그림자만 렌더링하므로 낮은 값도 충분합니다.

>**Camera 설정**
> - Camera Type: **Panoramic**
> - Panorama Type: **Equirectangular**
>	- 이 설정은 360도 전방향 투영을 가능하게 합니다.

#### 3단계: 그림자 캡처 설정

이 단계에서는 **조명 메쉬는 보이지 않지만 그림자는 생성되도록 설정**합니다.


>**Light Mesh 설정**
> Light Mesh를 선택하고 Shader Editor를 엽니다 (⌨️단축키: Shift + F3)
> 아래 이미지처럼 **Light Path 노드의 'Is Camera Ray' 출력을 Mix Shader의 Factor에 연결**합니다:

![[ShadowBake_05.png]]

![[ShadowBake_06.png]]
이 노드 구성의 의미:
- **Is Camera Ray**가 True(1)일 때: Transparent BSDF 사용 → 카메라에는 안 보임
- **Is Camera Ray**가 False(0)일 때: Principled BSDF 사용 → 그림자 생성

결과적으로 **Rendered View에서만 메쉬가 사라지고**, Shading, Material Preview, Wireframe 모드에서는 정상적으로 보입니다.
![[ShadowBake_07.png]]

---

>**BGSphere 설정**
>
> BGSphere 오브젝트를 선택합니다
> Object Properties → Visibility → Ray Visibility에서 **Shadow Catcher를 활성화**합니다

![[ShadowBake_08.png]]

Shadow Catcher는 **그림자만 받고 자체적으로는 렌더링되지 않는** Blender의 특수 기능입니다. 이를 통해 배경 없이 순수한 그림자만 추출할 수 있습니다.

---

>**Render 설정**
>
> 1. Render Properties > Film에서 **Transparent를 체크**합니다
>	- 배경이 투명하게 렌더링되어 알파 채널이 생성됩니다
> 2. F12를 눌러 렌더링을 실행합니다.

![[ShadowBake_09.png]]


렌더링 결과는 다음과 같습니다.

![[Shadow Bake Finish.png]]

>**후처리**  
>
>렌더링된 이미지를 **PNG 포맷으로 저장**한 뒤, 포토샵이나 GIMP 같은 이미지 편집 툴에서:
> 1. 새 레이어에 **흰색 배경을 추가**합니다
> 2. 그림자 레이어를 위에 배치합니다
> 3. 최종 이미지를 저장합니다

![[Shadow Bake Final.png]]

여기까지 하면 **Unreal Engine의 Light Function에 사용할 수 있는 Shadow Map 텍스처**가 완성되었습니다.

> [!tip] 💡팁. 그림자 농도 조절
> 렌더했을때 그림자가 너무 연하게 나오면 BGSphere 오브젝트의 컬러를 블랙에 가까운 색으로 사용해보세요. 또는 Light의 Power를 높이세요
>  
>![[ShadowMap Bake Blender Tip.png]]

> [!tip] HDR 포맷 활용
>
>**HDR 포맷(EXR)으로 익스포트**하면 더 넓은 명암 범위를 표현할 수 있습니다. Blender에서 File Format을 'OpenEXR'로 설정하고, Unreal Engine에서는 **압축 설정을 'HDR Compressed'로** 변경해야 합니다. 단, 파일 크기가 커지므로 꼭 필요한 경우에만 사용하세요.

---

## 문제 해결

### 뒷면 빛이 새는 현상

베이크된 Shadow Map을 Unreal Engine의 Light Function에 적용했을 때, **조명 반대편에 가느다란 선이 새어나오는 현상**이 발생할 수 있습니다.

#### 원인

이 현상은 두 가지 이유로 발생되는 걸로 추측됩니다.
1. **Mipmap 생성 과정에서 경계 픽셀이 블렌딩**되는 문제
    - Mipmap은 텍스처 최적화를 위해 여러 해상도 버전을 자동 생성하는데, 이 과정에서 0도와 360도 경계의 픽셀이 혼합됩니다
2. **UV 좌표 샘플링 시 Wrapping 문제**
    - 텍스처 좌표가 0-1 범위를 약간 벗어날 때 반대편 픽셀을 샘플링하게 됩니다

#### 해결 방법

Unreal Engine에서 Shadow Map 텍스처의 설정을 다음과 같이 변경하세요.

**방법 1: Mipmap 비활성화**
- Texture Editor를 엽니다.
- **Mip Gen Settings를 'NoMipmaps'로 변경**합니다
- 텍스처를 저장하고 다시 컴파일합니다

**방법 2: Tiling 방식 변경**
- Texture Editor에서 Advanced 섹션을 확장합니다
- **Address X, Address Y를 'Clamp'로 설정**합니다
- Clamp 모드는 UV 범위를 벗어나면 가장자리 픽셀을 반복합니다

일반적으로 **방법 1이 더 확실한 해결책**이며, Shadow Map은 원거리에서 사용되지 않으므로 Mipmap이 없어도 퍼포먼스에 큰 영향을 주지 않습니다.

---
### 최적화

#### 텍스처 해상도

- **조명 기구의 복잡도와 사용 거리**를 고려하여 결정합니다
- 과도한 해상도는 메모리를 낭비하므로 **실제 화면에서 보이는 디테일에 맞춰 조정**하세요

#### 퍼포먼스 최적화

- Shadow Bake를 사용하면 **동적 섀도우 연산을 완전히 제거**할 수 있습니다
- 포인트 라이트의 'Cast Shadows' 옵션을 비활성화하세요
- 대신 **Light Function으로 베이크된 그림자를 표현**하여 [[Drawcall]]을 줄입니다
- 특히 모바일 플랫폼에서 효과적입니다

---
**참고자료**
- [Unreal Engine Light Functions](https://docs.unrealengine.com/en-US/BuildingWorlds/LightingAndShadows/LightFunctions/index.html)
- [Equirectangular Projection - Wikipedia](https://en.wikipedia.org/wiki/Equirectangular_projection)
- [블렌더에서 라이트 쿠키 베이크하기 - Share Page](https://slashpage.com/share-page/91kwev26njzpr2y46jpg)
