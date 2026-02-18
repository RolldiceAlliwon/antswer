---
date: 2024-12-18
tags:
  - Character
  - Unreal
  - Animation
---

리타겟팅(Retargeting)은 한 캐릭터의 애니메이션을 다른 캐릭터의 스켈레탈 구조에 맞게 다시 계산해 적용하는 기술입니다.
서로 다른 신체 비율이나 본 구조를 가진 캐릭터 간에 애니메이션을 공유할 수 있어, 반복적인 애니메이션 작업을 크게 줄일 수 있습니다. 
이 문서는 언리얼 5에서의 리타겟팅 워크플로우를 다룹니다.

## 특징

리타겟팅은 기존 스켈레탈 메시의 계층구조 정보를 기준으로 새로운 스켈레탈 메시의 본 구조를 매칭하는 방식으로 작동합니다.

#### 장점

동작이 반복되는 NPC나 몬스터 제작 시 애니메이션 재사용이 가능하여 개발 효율이 향상됩니다

모션 캡처 데이터나 외부 애셋을 프로젝트의 캐릭터에 빠르게 적용할 수 있습니다

#### 단점

개성이 강한 주인공 캐릭터에는 적합하지 않을 수 있습니다

리타겟팅된 애니메이션은 독립된 애셋으로 복제되어 **원본 데이터와 분리**됩니다. (UE4 기준 )

애니메이션 수정 시 원본과 리타겟 버전을 각각 수정해야 하므로 유지보수 비용이 증가할 수 있습니다


#### 본 트랜슬레이션

리타겟팅 시 본의 위치 정보를 어떻게 처리할지 선택할 수 있습니다.

> [!info] Animation 본 트랜슬레이션 
> 본의 위치 정보를 원본 애니메이션 데이터에서 그대로 가져옵니다.

> [!info] Skeleton 본 트랜슬레이션 
>본의 위치 정보를 타겟 스켈레톤의 바인드 포즈(기본 자세)에서 가져옵니다

> [!info] Animation Scaled 본 트랜슬레이션
> 원본 애니메이션의 위치 정보를 타겟 스켈레톤의 비율에 맞게 스케일 조정하여 적용합니다.

> [!info]
> Translation 모드는 본의 위치 데이터에만 영향을 주며, 회전 정보는 항상 원본 애니메이션 데이터를 따릅니다.

---
## UE5 Workflow

언리얼 엔진 5부터는 IK Rig와 IK Retargeter 시스템이 도입되어 더욱 정교한 리타겟팅이 가능해졌습니다.

### 자주 발생하는 문제와 해결책

#### IK Retargeting 작업창에서 Edit Pose가 작동하지 않는 경우  

>[!check] Pelvis(골반) 본에 '리타겟 루트 설정'을 지정했는지 확인
>IK Rig 에디터에서 Pelvis 본을 선택 → `Set Retarget Root` 설정
>
>![[IK retargeting edit pose solution.png]]

---

#### 소스와 타겟의 신체 비율을 일치시키는 방법

완벽한 자동화 솔루션은 없으며, 가장 정확한 방법은 수동으로 포즈를 조정하는 것입니다.

##### 옵션 1. **IK 솔버를 이용한 Auto Adjustment**

>[!check] 1단계. IK Rig 에디터에서 솔버 추가
 >
 >![[IK setup.png]]
>- **Limb IK Solver**
>	- 새 IK 목표: Hand
>	- 루트 본 설정: UpperArm
>- **Full Body IK Solver**
>	- 새 IK 목표: Foot
>	- 루트 본 설정: Root(또는 Hip)

>[!check] 2단계. K Retargeter에서 각 체인의 목표 설정
>![[IK_UI.png]]
>
>이를 통해 손과 발의 위치가 자동으로 조정됩니다

##### 옵션2. **더 정밀한 리타겟팅 설정**

> [!check] 1단계. Skeletal Mesh 설정
>![[Retargeting Setup- Retargetting options.png]]
> 
> 리타겟팅 옵션에서 본마다 트랜슬레이션 모드를 지정할 수 있습니다.

> [!check] 2단계. IK Rig 설정
> - Full Body IK Solver 구성
>	- 새 IK 목표: Hand, Ball(발끝)
>	- 루트 본: Pelvis
>	- 추가 설정할 본: Spine, Clavicle, LowerArm, Thigh, Calf
>
>이 단계에선 상체와 하체의 주요 관절들이 올바르게 조정되도록 합니다

> [!check] IK Retargeter 설정
> ![[Globally scaled.png]]
> 
> `Globally Scaled` 옵션을 활성화하면 소스와 타겟 스켈레톤의 전체 스케일 비율을 고려해 루트 이동값을 조정합니다. 특히 키가 다른 캐릭터에서 **Foot Slip을 감소**시켜주고 **이동 거리 보정**하는데 중요합니다.

---
**참고자료**
- [IK Target_YT](https://bit.ly/3DEt7mq)
- [IK Rig Retargeting_Document](https://bit.ly/3SIuwg8)

