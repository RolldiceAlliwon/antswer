---
date: 2024-03-23
tags:
  - Animation
  - Unreal
---
Pose Driver Connect는 Maya에서 제작한 RBF(Radial Basis Function) 기반의 2차 포즈 공간 보간 시스템을 언리얼 엔진으로 전송할 수 있게 해주는 플러그인입니다. 
이 도구를 사용하면 캐릭터의 관절 회전에 따라 자동으로 변형되는 근육과 피부의 움직임을 효율적으로 구현할 수 있습니다. 
이 글에서는 설치부터 실제 적용까지의 전체 워크플로우를 단계별로 안내합니다.

## 1. Installation And Setup

#### Pose Driver Connect UE 설치

- 언리얼 엔진 마켓플레이스에서 "Pose Driver Connect"를 검색하여 설치합니다.
- 설치 경로: `드라이브/UE_5.x/Engine/Plugins/Marketplace/PoseDriverConnect`
- 언리얼 엔진을 재시작한 후 플러그인 메뉴에서 활성화 상태를 확인합니다.

<br>

#### Pose Driver Connect Maya 설치

- 언리얼 엔진 설치 경로에서 `PoseDriverConnect.zip` 파일을 찾습니다.
    - 경로: `드라이브/UE_5.x/Engine/Plugins/Marketplace/PoseDriverConnect/Content`
- 해당 zip 파일을 `문서/Maya/modules` 폴더에 복제하고 압축을 해제합니다.
- Maya를 재시작한 후, Script Editor에서 다음 Python 코드를 실행하여 Pose Wrangler를 실행합니다.
```python
from epic_pose_wrangler import main
pose_wrangler_instance = main.PoseWrangler()
```


---

## 2. Create Secondary Animation in Maya 

#### RBF 솔버 기본 개념

RBF(Radial Basis Function) 솔버는 하나의 관절(Driver)의 회전 값을 기반으로 여러 관절(Driven)을 자동으로 변형시키는 시스템입니다. 
예를 들어, 팔을 올릴 때 자연스럽게 쇄골, 견갑골, 근육들이 함께 움직이는 것을 자동화할 수 있습니다.

#### RBF 솔버 설정하기

- Pose Wrangler UI를 열고 새로운 RBF 솔버를 생성합니다.
- 신체 부위별로 솔버를 생성하여 관리합니다 (예: Upper_Arm_R, Lower_Arm_R, Clavicle_R 등).
- 각 솔버에서 다음을 설정합니다.
    - **Solver**: 주축이 되는 관절(예: 쇄골)
    - **Driven Transforms**: 함께 움직여야 하는 관절들(예: 승모근, 견갑골, 흉근, 광배근)


#### 포즈 생성 및 조정

- Driver가 사용하는 회전 축의 범위를 충분히 커버할 수 있도록 포즈를 배치해야 합니다.
	- 주요 방향 별로 최소 4가지 바인드포즈를 생성하는 것을 권장합니다 
	  (Up, Down, Forward, Back).
- 각 포즈 생성 절차.
    1. Driver 관절을 원하는 각도로 회전시킵니다.
    2. Driven 관절들을 수동으로 조정하여 가장 자연스러운 형태를 만듭니다.
    3. "Add Pose" 버튼을 클릭하여 해당 포즈를 저장합니다.
- 중간 포즈는 RBF 시스템이 자동으로 보간하여 생성합니다.
- 주축 트랜스폼을 바른 각도로 변경후 종속된 프랜스폼을 이동하여 보기에 가장 자연스러운 포즈를 만듬


#### Solver Setting

>**Fuction Type**
>
>보간 방식을 결정하는 옵션입니다.
> 
 >![[Screen_Recording_20240213_215924_You Tube.mp4]]

>**Automatic Radius Value**
> 
> - 모든 포즈 간의 절대 거리 평균값을 자동으로 계산합니다.
> - 이 값이 RBF의 영향 범위를 결정합니다.
> - 수동 조정도 가능하지만, 자동 계산 값을 먼저 사용해보는 것을 권장합니다.
>
>![[Automatic Radius Calculation.png|500]]


>**Normalize Method**
>
>**OnlyNormalizeAboveOne**
>Weight가 1이 초과할 경우에만 1로 정규화합니다.
>
>**AlwaysNormalize**
>항상 weight 합을 1로 맞춥니다. 대부분의 경우 더 안정적인 결과를 제공합니다.

>**Distance Method**
>
>- **Eculidean**: 표준 N차원 거리 측정 방식입니다.
>- **Quaternion**: 입력을 쿼터니언으로 취급하여 회전거리를 더 정확하게 계산합니다.
>- **SwingAngle**: Twist Axis를 제외한 나머지 축만 사용하여 거리를 계산합니다. 방향 변화만 감지Epic Games의 메타휴먼에서 주로 사용됩니다.
>- **TwistAngle**: Twist Axis에서 지정된 축의 회전만 감지합니다.

<br>

#### Pose Exporter

- **Up Axis**: Z Axis를 선택합니다(언리얼 엔진의 기본 좌표계와 일치).
- **Export as Delta**: 활성화✅를 권장합니다. 이 옵션을 사용하면 동일한 스켈레톤 구조를 가진 캐릭터에도 RBF 데이터를 재사용할 수 있어 작업 효율이 높아집니다.
<br>
- 익스포트를 실행하면 두 가지 파일이 생성됩니다:
    - **JSON 파일**: RBF 설정 정보(솔버 타입, 포즈 데이터, Weight 등)
    - **FBX 파일**: 각 포즈의 실제 변형 데이터

---

## 3. Import Secondary Animation in UE

#### 언리얼 엔진 설정

- ⚙️Plugins → Pose Driver Connect Enable ✅ 

#### 임포트 설정

- 상단 메뉴에서 `Tools → Pose Driver Connect`를 선택합니다.
	- RBF Json File- Json파일 지정
	- FBX Source Directory: FBX파일이 포함된 파일 경로지정
	- FBX Import Directory: Unreal project> contect에서 임포트할 폴더 경로지정

#### Animation Blueprint에서 설정

- 캐릭터의 Animation Blueprint를 엽니다.
- AnimGraph에 다음 노드들을 추가하고 연결합니다:
	1. **RBF Solve** 노드: Maya에서 생성한 RBF 로직을 실행합니다.
	2. **Pose Asset** 노드: 임포트한 포즈 데이터를 참조합니다.
		- 임포트된 Pose Asset의 Additive Type을 “**Local Space Additive**”로 설정하고, Reference Pose를 지정해야 합니다.
	3. **Apply Additive** 노드: 기존 애니메이션에 RBF 결과를 추가로 적용합니다.

![[Pose Dirver conect UE import.png]]

![[PoseDriverConnect nodes.png]]

#### 테스트 및 미세조정

- 캐릭터를 실제로 움직여보면서 자연스러운 변형이 일어나는지 확인합니다.
- 필요한 경우 Maya로 돌아가 포즈를 수정하고 다시 익스포트할 수 있습니다.
- Radius 값이나 Normalize Method를 조정하여 원하는 결과를 얻을 수 있습니다.

---
**참고자료**
- [포즈 드라이버 커넥트로 Maya와 언리얼 엔진에서 세컨더리 애니메이션 제작하기](https://www.youtube.com/watch?v=7BURJvP0Vjg&list=WL&index=4)