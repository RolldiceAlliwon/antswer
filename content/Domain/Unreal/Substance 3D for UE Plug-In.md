---
aliases:
date: 2022-07-08
tags:
  - Texturing
  - Unreal
---
이번 포스팅은 Unreal Engine 5 환경에서 **Substance 3D for Unreal Engine 플러그인**을 활용하는 실무 파이프라인입니다. 
SBSAR 기반 절차적 머티리얼 워크플로우와 USD 기반 모델 연계 워크플로우를 구분하여 설명하고, 실제 프로젝트에서 자주 발생하는 이슈와 설정 포인트를 함께 다룹니다.

## Step1. 플러그인 설치 및 활성화

Fab Store에서 '**Substance 3D for UE**' 플러그인을 현재 사용 중인 언리얼 엔진 버전에 맞게 설치합니다.

설치 후 언리얼 엔진을 실행합니다.

#### 플러그인 활성화

> Plugins 창에서 **Substance in UE5** 활성화하고 엔진을 재시작합니다.
> 
> ![[Substance in UE5 Plug-In.png]]


> 플러그인이 활성화되면 언리얼에서 바로 Substance 3D assets으로 하이퍼링크를 탈 수 있습니다.
>
>![[Pasted image 20250408175856.png]]

---

## Step2a. SBSAR 기반 Workflow

SBSAR 방식은 Substance Designer 또는 Substance 3D Assets에서 제작된 절차적 방식의 머티리얼을 Unreal Engine 내부에서 직접 제어하는 방식입니다. 
메테리얼 파라미터 조정이 가능하다는 점에서 게임 제작에 매우 적합합니다.

#### SBSAR 파일 준비

 Substance 3D Assets 또는 자체 제작 `.sbsar` 파일 다운로드합니다.

![[Substance 3D Assets SBSAR.png]]


#### Substacne Import Options

Import 과정에서 템플릿을 선택할 수 있습니다.

> [!tip] 템플릿 비교
> **Standard**
> Substance 쪽에서 세팅을 다 마쳐 언리얼에서 수정할 필요없이 오버라이드만 해도 되는 경우 적합.
>
>**TriPlanar** 
>월드 좌표 기반 텍스처 투영을 지원해 UV 의존도를 줄일 수 있고
>섭페에서 만든 파라미터도 가져올 수 있어 언리얼에서 메테리얼 파라미터 제어 범위가 넓음.

![[Substance Import Options.png]]

#### 템플릿 변경하는 방법

1️⃣ 생성된 Material Instance의 Parent 변경하거나
2️⃣ Substance Graph Instance 설정에서 Output Template 수정

 ![[Create Graph Instance.png]]

---

## Step2b. USD Workflow 

USD(Universal Scene Description)는 DCC 툴과 Unreal 간의 비파괴적인 데이터 교환을 위한 표준 포맷입니다. Substance 3D Modeler에서 모델과 머티리얼을 함께 내보낼 수 있습니다.

#### USD Export

 Substance 3D Modeler 에서 USD 포맷으로 익스포트

![[Pasted image 20250408180248.png]]


#### USD Import

> [!warning] **USD 임포트 시 주의점** 
> - Unreal에서 USD Importer 플러그인 활성화 필요.
> - 반투명 재질이나 Sursface 재질은 USD 셰이더가 지원되지 않음.


## 두개의 워크플로우 비교

| 구분    | SBSAR 워크플로우   | USD 워크플로우          |
| ----- | ------------- | ------------------ |
| 중심 개념 | 절차적 머티리얼 제어   | Scene 단위 데이터 교환    |
| 수정 위치 | Unreal 내부     | DCC 툴에서 수정 후 리임포트  |
| 장점    | 언리얼 내 파라미터 변경 | 파이프라인 확장성          |
| 단점    | CPU 부하 가능성    | 언리얼에서 메테리얼 수정이 제한적 |
| 적합 사례 | 환경 베리에이션 제작   | DCC 툴을 연계하여 제작     |

---

## Trouble Shooting

> [!error] 여러 개의 UV 타일 (UDIM)을 사용하는 경우 텍스쳐링 맵핑의 이상한 현상이 발생한다면
>>[!check] **Project Settings → Virtual Texture Support**를 활성화했는지 체크합니다.

---
**참고자료**
- [언리얼 엔진의 범용 장면 설명](https://dev.epicgames.com/documentation/en-us/unreal-engine/universal-scene-description-in-unreal-engine?application_version=5.3)
- [Substance 3D plugin in UNREAL Engine](https://dev.epicgames.com/community/learning/tutorials/JPdb/substance-3d-plugin-in-unreal-engine?locale=ko-kr)