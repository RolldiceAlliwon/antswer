---
published:
date: 2024-08-08
tags:
  - Texturing
  - Material
  - Unreal
---

UE5에서는 기존 DX11 Tessellation 기반 Displacement 기능이 제거됐습니다.  
따라서 Height 기반 지형 표현은 **World Position Offset(WPO)** 또는 **Nanite Displacement** 방식으로 구성해야 합니다.

이 워크플로우는 Material Layer 시스템을 활용하여 여러 재질을 Height 기반으로 블렌딩하고,  
그 결과를 Render Target를 활용해 텍스처로 베이크하여 Displacement용 Height Map으로 사용하는 방식입니다.

## Layered Height Texture Blend Workflow

### Step1. Material Layer 구성

> 📂 콘텐츠 브라우저 Add → Material → Layers - Material Layer 생성합니다.
>
>![[Layered Height Texture Blend ML.png]]

> [!info]
Height 정보는 재질의 높낮이 블렌딩 기준값으로 사용.

---

### Step2. Material Layer Blend 구성

>📂 콘텐츠 브라우저 Add → Material → Layers - Material Layer Blend 생성합니다.
>
>![[Layered Height Texture Blend MLB.png]]

> [!info] **매개변수 의미**
>
> Height High → 상위 재질이 우선 적용되는 영역
> Height Low → 하위 재질이 유지되는 영역
>
>값 차이가 클수록 표면의 경계가 더 뚜렷해짐.

---

### Step3. Mater Material 구성

> 📂 콘텐츠 브라우저 Add → Material 생성합니다.
>
>![[Layered Height Texture Blend MM.png]]

이 단계의 목적은 Layered Height Blend에서 계산된 Height 값을 **World Position Offset(WPO)**에서 사용할 수 있도록 구조를 설계하는 것입니다.

Material Layer에서 계산된 Height 값은 기본적으로 **Pixel Shader 단계**에서 처리됩니다.  
그러나 Displacement를 구현하는 WPO는 **Vertex Shader 단계**에서 실행됩니다.

즉,
- Height 계산은 Pixel 단계에서 수행되고
- WPO는 Vertex 단계에서 실행되기 때문에
- Height 값을 직접 사용할 수 없는 구조적 문제가 존재합니다.

이 문제를 해결하기 위해 **Customized UV**를 사용합니다.


#### Customized UV의 역할

Customized UV는 특정 계산을 Pixel Shader가 아닌 **Vertex Shader 단계에서 수행하도록 이동시키는 기능**입니다.

작동 원리는 다음과 같습니다.
1️⃣ Height 계산 결과를 Customized UV 채널에 연결합니다.
2️⃣ 해당 연산은 Vertex Shader 단계에서 수행됩니다.
3️⃣ 계산된 값은 보간되어 Pixel Shader로 전달됩니다.
4️⃣ Vertex 단계에서 해당 값을 WPO에 사용할 수 있게 됩니다.

이 워크플로우에서는 Height 값을 **Customized UV7**에 저장하여 Vertex 단계에서 재사용 가능하도록 구성합니다.

---

### Step4. Material Layer Height Blending 미세조정

> 마스터 메테리얼의 인스턴스를 생성합니다.
> 레이어 파라미터 창에서 1,2단계에서 만든 Material Layer를 연결해줍니다.
> 
>![[Material Layer height Blending Layer BG.png]]

<br>

>Enable Height Blend 활성화하고 Height High, Height Low값을 조정해서 자연스러운 재질 경계 표현을 완성하기 위해 수치를 미세조정합니다. (다른 레이어에도 이 방법으로 반복적으로 작업합니다.)
>
>![[Material Layer height Blending Layer 01.png]]


---

### Step5. Height Bake 세팅

>📂 콘텐츠 브라우저 Add → Blueprint Class - Actor를 생성합니다.
>
> 1. Components Add → Plane를 생성합니다.
> 2. Construction Script를 구성합니다.
> 3. Bake 노드를 구성할 함수를 추가합니다.
>
>![[BP_HeightBake.png]]

<br>

> 📂 콘텐츠 브라우저 Add → Texture - Render Target를 생성합니다.
>
> 정밀도를 확보하기 위해 텍스처 해상도를 4K로 설정합니다.
>
>![[BakeHeight Render Target.png]]

---

### Step6. Height Map Bake

>✅ 렌더 타겟을 베이크 하기 전에 인스턴스로 돌아가 Height Bake 토글을 활성화했는지 체크합니다. 
>
>![[Material Layer Height bake Setting.png]]

>렌더 타깃은 아직 텍스처가 아닌 상태이기 때문에 Static Texture로 텍스처로 변환합니다.
>📂 Render Target 우클릭 - RenderTarget Action - Static Texture 생성을 선택합니다.
>
>![[Height map Bake.png]]

>생성한 HeightMap Texture의 압축세팅은 Vector Displacement로 바꿔준다.
>이렇게 하면 Height 데이터의 정밀도 손실을 줄여 벤딩과 계단현상을 방지합니다.
>
> ![[HeightMap TextureCompress.png]]

---

### Step7. 베이크한 Height Map을 Nanite Mesh에 적용하는 법

> UE5.2에서 Nanite 기반 Displacement를 사용하려면
>- Mesh에서 Nanite 활성화
>- Material에서 Displacement 출력 연결
>- Nanite Displacement 옵션 활성화
>
>Nanite는 전통적인 WPO 기반 Displacement와 다르게 내부적으로 메시 세분화를 관리합니다.
>
>![[BakeHeightMap Final Setting.png]]

---

## Trouble Shooting

> [!error] 그림자가 울그락불그락하게 렌더링되는 경우
>> [!check] Project Settings → Ray Tracing Shadow ✅

---

**참고자료**
- [Layered Height Texture Blend Tutorial](https://www.youtube.com/watch?v=gmN_oMbl2ZE) 
- [Bake Layered Height Texture to Nanite Displacement Tutorial | Unreal Engine 5.2](https://www.youtube.com/watch?v=-BXklGMIaFE)
- [Customized UVs in Unreal Engine Materials | Unreal Engine 5.2 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/customized-uvs-in-unreal-engine-materials?application_version=5.2)

