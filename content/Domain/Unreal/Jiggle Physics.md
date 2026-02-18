---
date: 2024-04-08
tags:
  - Unreal
  - Animation
---

> [!summary] 
> Jiggle Physics는 캐릭터의 머리카락, 옷, 액세서리 등이 움직임에 따라 자연스럽게 흔들리는 효과를 구현하는 세컨더리 애니메이션 기법입니다.
> 
> 언리얼 엔진에서는  **Spring Controller**를 통해 물리 기반의 흔들림 효과를 간편하게 적용할 수 있습니다.

## 구현 방법: Animation Blueprint 설정

언리얼 엔진에서 Jiggle Physics를 구현하기 위해서는 Animation Blueprint(애님 블루프린트)에서 State Machine과 Spring Component를 활용합니다.

#### 1. State Machine 추가

- Anim Graph에서 우클릭하여 'State Machine'을 선택합니다

> [!info] 
> State Machine은 캐릭터의 다양한 애니메이션 상태를 관리하는 구조입니다

#### 2. State 생성 및 애니메이션 등록

- State Machine 내부로 들어가서 'Add State'를 통해 새로운 상태를 추가합니다.
- 생성된 State를 더블클릭하여 내부로 진입한 후, 애니메이션을 그래프로 불러와 Output Animation Pose 연결합니다.

![[State Machine.png]]


#### 3. Spring Component 설정

- Anim Graph로 돌아와서 Output Pose 이전에 'Spring Controller' 노드를 추가합니다.
- Spring Component의 Details 패널에서 다음 항목들을 설정합니다.
	- **Bone to Modify**: 물리 효과를 적용할 본(Bone)을 지정합니다
	- **Spring Stiffness**: 스프링의 강성을 조절합니다 (값이 낮을수록 더 천천히 복원됩니다.)
		- Stiffness = 원래 위치로 돌아가려는 힘
	- **Spring Damping**: 속도 감쇠 정도를 설정합니다.
		- 값이 낮을수록 오래 흔들립니다.

![[Spring Component.png]]

> [!tip] 활용 팁
> - 머리카락이나 천 같은 부드러운 오브젝트는 Stiffness 값을 낮게 설정하세요
> - 금속 장신구처럼 무거운 오브젝트는 Damping 값을 높여 빠르게 안정화되도록 합니다
> - 여러 본에 각각 다른 물리 속성을 적용하면 더욱 자연스러운 결과를 얻을 수 있습니다

---
**참고자료**
- [Mastering Jiggle Physics](https://www.youtube.com/watch?v=BFE5e-XUcwo)