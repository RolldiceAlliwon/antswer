---
date: 2025-08-10
tags:
  - Unreal
  - Animation
---
Physics Constraint Actor는 언리얼 엔진의 물리 시스템을 활용하여 체인 형태의 세컨더리 애니메이션을 구현하는 방법입니다. 
랜턴, 샹들리에, 체인, 로프 등 매달린 오브젝트의 자연스러운 흔들림을 물리 시뮬레이션으로 표현할 수 있어, 수동 애니메이션 작업 없이도 사실적인 움직임을 만들 수 있습니다.

> [!info] 세컨더리 애니메이션이란
>세컨더리 애니메이션(Secondary Animation)은 캐릭터나 오브젝트의 주요 동작에 따라 자동으로 발생하는 부가적인 움직임을 의미합니다. 예를 들어
>
> - 캐릭터가 달릴 때 흔들리는 머리카락이나 옷
> - 바람에 흔들리는 깃발이나 커튼
> - 매달린 랜턴이나 체인의 흔들림
>
>이러한 움직임을 수동으로 애니메이션하는 것은 시간이 많이 소요되므로, 물리 시뮬레이션을 활용하면 효율적이고 자연스러운 결과를 얻을 수 있습니다.

## 체인 세컨더리 애니메이션 구조

![[Chain Secondary Animation.png]]

체인 형태의 세컨더리 애니메이션은 다음과 같은 구조로 구성됩니다:

- **Anchor**: 천장이나 벽에 고정되는 **시작점**으로, 물리 시뮬레이션이 비활성화됩니다.
- **Chain Links**: 연결된 각 고리로, 물리 시뮬레이션이 활성화됩니다
- **Physics Constraint**: 각 링크를 연결하는 물리 제약조건으로, 움직임의 범위와 특성을 정의합니다

## Static Mesh 설정

![[Physics Constraint용 Static mesh setting.png]]

체인 애니메이션을 구현하기 전에 사용할 스태틱 메시의 물리 설정을 올바르게 구성해야 합니다:

#### 체인 링크용 메시

- **Simulate Physics**: 활성화 ✅
    - 물리 엔진이 이 메시의 움직임을 계산하도록 합니다
- **Collision Preset**: PhysicsActor 또는 적절한 프리셋 선택
    - 다른 오브젝트와의 충돌 반응을 정의합니다
- **Mass**: 실제 오브젝트의 무게를 고려하여 설정
    - 무거울수록 느리고 힘 있게 움직입니다.
    - ※ 물리 안정성은 절대 질량보다 **링크 간 질량 비율**에 더 민감합니다.

#### Anchor(피봇)용 메시

- **Simulate Physics**: 비활성화 ❌
    - **Anchor는 Simulate Physics를 비활성화하거나, Mobility를 Static으로 설정**하여 고정된 상태로 둡니다.
    - 이 메시는 **체인의 시작점 역할을 하며 움직이지 않아야** 합니다.
- **Collision**: 필요에 따라 설정 (일반적으로 NoCollision)

## Physics Constraint Actor 설정

![[Physics Constaint Component.png]]

Physics Constraint Actor^[두 개의 Rigid Body 사이의 상대적인 이동(Translation)과 회전(Rotation)을 제한하는 물리적 제약 조건]는 두 개의 오브젝트를 연결하는 관절 역할을 합니다. 올바른 설정을 통해 자연스러운 체인 움직임을 구현할 수 있습니다.


### 기본 설정 단계

#### **레벨에 Physics Constraint Actor 배치**

- 모드 패널에서 "Physics Constraint Actor"를 검색하여 레벨에 드래그합니다
- 체인의 각 연결 지점마다 하나씩 배치합니다.

#### **컴포넌트 연결**
    
- `Component Name 1`: 첫 번째 스태틱 메시 컴포넌트 지정 (상위 링크)
- `Component Name 2`: 두 번째 스태틱 메시 컴포넌트 지정 (하위 링크)
- Constraint Actor의 위치는 두 메시의 연결점에 정확히 배치해야 합니다

#### **제약 조건 설정**  

Physics Constraint의 주요 속성들

**Linear Limits (이동 제한)**

- XYZ 축 각각에 대해 이동 범위를 제한합니다
- `Locked`: 해당 축으로 이동 불가
- `Limited`: 지정한 범위 내에서만 이동 가능
- `Free`: 자유롭게 이동 가능

**Angular Limits (회전 제한)**

- 회전 범위를 제한하여 자연스러운 움직임을 만듭니다
- `Swing 1/2 Motion`: 좌우, 전후 흔들림 범위 설정
- `Twist Motion`: 비틀림 범위 설정

**Linear/Angular Damping (감쇠)**

- Linear Damping → 이동 속도 감쇠
- Angular Damping → 회전 속도 감쇠
<br>
- 값이 클수록 빠르게 정지하고, 작을수록 오래 흔들립니다
- 현실감을 위해 적절한 감쇠값을 찾는 것이 중요합니다.

> [!tip]
> 체인의 경우 일반적으로 **Linear**는 **Locked**로 설정하여 길이를 유지하고, 
> **Angular Swing**을 **Limited (±45도)** 로 설정해 흔들림 범위를 제어합니다. 
> **Twist**는 과도한 회전을 방지하기 위해 **Limited**로 설정하는 경우도 많습니다.

<br>

#### 안정성 향상을 위한 추가 설정

**Enable Projection**
Physics Constraint의 보조속성으로

- Constraint가 벌어지거나 어긋나는 현상을 방지합니다.
- 체인 흔들림이 과도하거나 분리될 때 활성화하면 보완이 됩니다.
<br>

**Physics Substepping**
⚙️ Project Settings → Physics → Substepping 활성화

- 빠른 움직임에서 안정성 향상
 <br>

**Solver Iteration Count 증가**
⚙️ Project Settings → Physics → Solver Iteration Count 증가

- 값이 낮으면 Constraint가 불안정합니다. 
- 체인이 길거나 무거울 경우 카운트를 증가합니다.

#### 작업 팁

- **Preview**: 에디터에서 `Simulate` 모드로 전환하면 물리 시뮬레이션을 미리 확인할 수 있습니다.
- **디버그 시각화**: `Show → Physics → Constraints`를 활성화하면 제약 조건을 시각적으로 확인할 수 있습니다.
- **성능 고려**: 체인 링크가 많을수록 연산 비용이 증가하므로, 필요한 만큼만 사용하는 것이 좋습니다.

## 실전 예제: 매달린 랜턴 만들기

#### **메시 준비**    

- 천장 고정용 메시 (Simulate Physics: OFF)
- 체인 링크 메시 3-5개 (Simulate Physics: ON)
- 랜턴 메시 (Simulate Physics: ON)

#### **레벨 배치**

- 천장 고정 메시를 원하는 위치에 배치합니다
- 체인 링크들을 수직으로 일정 간격으로 배치합니다
- 맨 아래에 랜턴 메시를 배치합니다

#### **Constraint 연결**
    
- 천장과 첫 번째 체인 링크 사이
- 각 체인 링크 사이
- 마지막 체인 링크와 랜턴 사이
- 총 링크 수 + 1개의 Physics Constraint Actor가 필요합니다

#### **테스트 및 조정**

- Simulate 모드에서 흔들림을 확인합니다
- Angular Limits와 Damping 값을 조정하여 원하는 느낌을 만듭니다
- 필요시 Mass 값을 조정하여 무게감을 표현합니다

---
**참고 자료**
- [언리얼 엔진 공식 문서: Physics Constraints](https://docs.unrealengine.com/5.3/en-US/physics-constraint-component-user-guide-in-unreal-engine/)


