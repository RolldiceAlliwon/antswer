---
date: 2024-08-10
tags:
  - Material
  - Texturing
---
Blender 사용자라면 익숙한 **ColorRamp 노드**는 0~1 입력값을 원하는 색상 그라디언트로 매핑할 수 있는 강력한 도구입니다. 수치 데이터를 직관적인 색으로 변환할 때 핵심적인 역할을 하죠.

그러나 언리얼 엔진의 기본 머티리얼 에디터에는 이와 동일한 직관적 그라디언트 노드가 없습니다. 
Lerp 체인을 구성하거나, 그라디언트 텍스처를 제작해 임포트하거나, 복잡한 수식을 작성해야 하죠.  무엇보다 수정과 재사용이 번거롭습니다.

**Curve Atlas**는 이 문제를 해결하는 언리얼의 숨은 기능입니다.  
ColorRamp처럼 커브 기반 인터페이스로 그라디언트를 설계하고, 머티리얼에서 간단히 참조할 수 있습니다. 즉 에디터 내부에서 커브를 조정하는 것만으로 색상 매핑을 유연하게 제어할 수 있습니다.

이 튜토리얼에서는 **Curve → Curve Atlas → Material**의 3단계 워크플로우로 Blender의 ColorRamp노드를 완벽히 재현하는 방법을 다룹니다.

## Color Gradient Map Curve Control Workflow

#### Step1. Curve Asset Setting

>Curve Asset를 생성합니다.
>- 📂 콘텐츠 브라우저 Add → 기타 (Miscellaneous) - Curve 선택 - Pick Curve Class: CurveLinearColor

<br>

>생성한 Curve Asset으로 들어가서 Color Ramp 키를 추가하고 편집합니다.
>
>![[Gradient map Curve.png]]


> [!tip]
> 키프레임 우클릭 → Set Key Interpolation: 보간 모드 변경

<br>

#### Step2. Curve Atlas 생성

>Curve Atlas를 생성합니다.
>- 📂 콘텐츠 브라우저 Add → 기타 (Miscellaneous) - Curve Atlas 선택

<br>

> **Texture Width**를 Power Of Two 사이즈 규격에 맞춰 설정합니다.
>그리고 **Gradient Curves**에 Curve Asset을 추가해줍니다.
>
>![[Gradient map Curve Atlas.png]]


<br>

#### Step3. Material Setting

>**기본 노드 구조**
>
>![[Gradient map Curve MA.png]]


>**상세 노드 설정**
>
>**ComponentMask** 노드는 벡터데이터 (UV도 포함)에서 원하는 채널만 추출할 수 있는 노드입니다. 
>채널을 R로 설정하면 가로, G로 설정하면 세로로 렌더링 됩니다.
>
>**CurveAtlasRowParameter** 노드는 Curve Atlas에서 색상을 샘플링하는 핵심 노드입니다.

---
