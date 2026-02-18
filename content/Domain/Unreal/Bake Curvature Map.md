---
date: 2025-05-16
tags:
  - Unreal
  - Texturing
---
> [!summary]
>이번 글은 Unreal Engine 5의 모델링 툴을 사용하여 3D 메시에서 Curvature Vertex Color Bake하는 방법을 다룹니다.
>
>Curvature Map은 메시 표면의 곡률 정보를 담고 있어, 텍스처링 작업 시 모서리나 홈 부분을 자동으로 감지하여 디테일을 추가하는 데 유용하게 활용됩니다.

## Curvature Map?

Curvature Map은 3D 모델 표면의 곡률(curvature) 정보를 저장한 텍스처입니다. 표면이 볼록한 부분(convex)과 오목한 부분(concave)을 구분하여 기록하며, 주로 다음과 같은 용도로 사용됩니다:

- 모서리 마모(Edge Wear) 효과 생성
- 먼지나 오염이 쌓이는 영역 표현
- 절차적 텍스처링(Procedural Texturing)의 마스크로 활용
- Substance Painter, Quixel Mixer 등 텍스처링 툴에서의 스마트 마스크 생성

---

## Unreal Engine 5에서 Curvature Map 베이크하기


#### 모델링 모드 진입

- **Edit > Plugins**에서 **Modeling Tools Editor Mode** 플러그인이 활성화되어 있는지 확인합니다
- 상단 툴바에서 **Selection Mode** 드롭다운을 클릭하고 **Modeling** 모드를 선택합니다

#### 메시 선택 및 베이크 도구 실행

- 뷰포트에서 Curvature Map을 생성할 Static Mesh를 선택합니다
- 모델링 모드 패널에서 **Baking - Bake Vertex Colors**  옵션을 선택합니다
- 출력 타입을 **Curvature**로 설정합니다.

![[Bake Curvature Map.png]]

>[!warning]
>Vertex Color 기반 Curvature는 메시의 버텍스 밀도에 따라 해상도가 결정되므로, 로우폴리 모델에서는 디테일이 부족할 수 있습니다.

>[!check] 
>자연스러운 Edge Wear 표현을 위해서는 모델링 단계에서 미세한 베벨을 추가하는 것이 효과적입니다.

#### 베이크 설정 조정

- **Curvature Type**: Gaussian, Mean 등 곡률 계산 방식을 선택할 수 있습니다
- **Color Range Multiplier**: 곡률 값의 대비를 조정합니다. 값이 클수록 작은 곡률 변화도 강조되지만, 과도하게 높이면 노이즈가 함께 증폭될 수 있습니다.

#### 베이크 실행 및 저장

- 설정 완료 후 **Accept** 버튼을 클릭합니다.
- 버텍스 컬러의 저장된 Curvature 정보는 머티리얼 에디터에서 Vertex Color 노드로 불러와 사용할 수 있습니다.


> [!tip] 
> 베이크된 Curvature Map은 머티리얼 에디터에서 다음과 같이 활용할 수 있습니다:
>
> - **Lerp** 노드의 Alpha 입력에 연결하여 모서리 부분에만 다른 색상이나 러프니스 값을 적용
> - **Multiply** 노드로 Ambient Occlusion과 결합하면, 오목한 영역(Concave)에 디테일을 강조할 수 있습니다.
> - **Power** 노드로 대비를 조절하여 효과의 강도 조정
