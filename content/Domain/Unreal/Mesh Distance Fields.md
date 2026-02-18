---
cssClass: img-grid
date: 2022-01-04
tags:
  - Shadow
  - unreal
  - UE4
---

Mesh Distance Field는 스태틱 메시의 Signed Distance Field 볼륨 데이터를 생성하는 시스템입니다. 
즉, 복잡한 메시의 표면 정보를 단순화된 볼륨 데이터로 변환하여, 동적 조명 환경에서 효율적인 그림자 계산을 가능하게 합니다. 

Distance Field Shadow는 원거리 영역에서 Cascaded Shadow Map보다 해상도 유지에 유리하며, 
대규모 오픈월드 환경에서 Shadow Map의 해상도 의존 문제를 완화할 수 있습니다.

## 기본 설정

#### 프로젝트 설정

>⚙️ Project Setting - Generate Mesh Distance Field ✅

이 옵션을 활성화하면 프로젝트의 모든 Static Mesh에 대해 Distance Field 데이터가 자동으로 생성됩니다.

#### 메모리 최적화 옵션

> ⚙️ Project Setting - Rendering - Lighting

특정 상황에서 메모리 사용량을 줄이고 싶다면 다음 옵션들을 고려해볼 수 있습니다.

- **8bit Mesh Distance Field**: 16비트 데이터를 8비트로 변환해 메모리 소비량을 대폭 감소시켜줍니다. 하지만 크거나 얇은 형태의 Mesh에는 그림자 품질 저하나 아티팩트가 발생할 수 있으니 유의해 주세요.
<br>
- **Compress Mesh Distance Field**: 마찬가지로 메모리를 절약하지만 퀄리티는 소실되지 않습니다. 단, Level Streaming을 사용하는 프로젝트에서는 레벨 로딩 시 압축 해제 과정에서 약간의 부하가 발생할 수 있습니다.

## Distance Field의 작동 원리

Mesh Distance Field는 메시 표면으로부터의 “거리”를 3차원 볼륨 텍스처에 저장하는 Signed Distance Field 구조을 활용해, 복잡한 지오메트리를 단순화된 볼륨 데이터로 변환합니다. 각 복셀마다 가장 가까운 표면까지의 거리 정보를 저장하여, 이를 기반으로 효율적인 레이 트레이싱과 그림자 계산을 수행합니다.

#### 디버깅

- 뷰포트 상단의 'Show' 메뉴에서 'Visualize' > 'Mesh Distance Fields' 또는 'Global Distance Field'를 선택합니다.
	- 이상적인 상태에서는 대부분의 메시가 흰색이 아닌 회색으로 표시됩니다.
	- 흰색으로 표시되는 영역은 Distance Field 계산을 위해 더 많은 레이 트레이싱이 필요하다는 의미이므로, 해당 메시의 Distance Field 해상도를 조정하거나 지오메트리를 단순화하는 것이 좋습니다.ng

---

## 동적 조명에서의 활용

#### Distance Field Shadows의 원리

Movable(동적) 광원에서 Distance Field Shadows(DFS)는 각 Static Mesh의 Distance Field 데이터를 활용하여 실시간으로 영역 그림자(Area Shadow)를 계산합니다. 이 기법은 [공식 문서](https://docs.unrealengine.com/4.27/en-US/BuildingWorlds/LightingAndShadows/MeshDistanceFields/Reference/)에 자세히 설명되어 있습니다.

그림자를 받을 지점에서 광원 방향으로 Signed Distance Field(SDF)를 따라 레이 트레이싱을 수행합니다. 차폐된 오브젝트까지의 최단 거리 정보를 활용하여 콘 트레이싱(Cone Tracing)을 근사하므로, 전통적인 레이 트레이싱과 비슷한 비용으로 부드러운 영역 그림자를 생성할 수 있습니다.

#### 그림자 부드러움 조절

광원 타입에 따라 그림자의 반그늘(Penumbra) 크기를 조절하는 방법이 다릅니다.

- **Point Light와 Spot Light**: 'Source Radius' 값을 조정하여 광원의 크기를 설정합니다. 값이 클수록 그림자가 더 부드러워집니다
- **Directional Light**: 'Light Source Angle' 값으로 태양의 각도 크기를 설정합니다. 실제 태양의 각도는 약 0.5도이지만, 게임에서는 표현 목적에 따라 조절할 수 있습니다


#### 원거리 그림자 설정

오픈 월드와 같은 넓은 환경에서 원거리 그림자를 표현하고 싶을 때 Distance Field Shadow가 유용합니다.

- Directional Light의 'Cascaded Shadow Map' 섹션에서 'Dynamic Shadow Distance Movable Light' 값을 늘리면 기존 Shadow Map의 적용 범위가 확장됩니다
- 하지만 이 값을 무한정 늘리면 성능 문제가 발생하므로, 적절한 거리 이후부터는 'Distance Field Shadows' 옵션을 활성화하는 것이 효율적입니다
- [Movable](app://obsidian.md/Movable) 라이트를 선택한 후 Details 패널의 'Light' 섹션에서 'Distance Field Shadows' 체크박스를 활성화하면 원거리 영역에서 Distance Field 기반 그림자가 렌더링됩니다

## Distance Field Texture 설정

![[DF textures.png|800]]

각 Static Mesh는 개별적으로 Distance Field 텍스처를 생성합니다. 메시의 복잡도에 따라 적절한 해상도를 설정하는 것이 중요합니다.

- UE4 기준 istance Field 해상도는 최대 128 x 128 x 128까지 설정할 수 있으며, 최대 메모리 크기는 8MB입니다
- Static Mesh 에디터에서 'Distance Field Resolution Scale' 값을 조정하여 해상도를 변경할 수 있습니다
- 단순한 형태의 메시는 낮은 해상도로도 충분하지만, 복잡하거나 얇은 형태의 메시는 높은 해상도가 필요할 수 있습니다
- 해상도를 0으로 설정하면 해당 메시의 Distance Field 생성을 비활성화합니다

## 최적화 가이드

Distance Field Shadows를 사용할 때 성능을 최적화하기 위해 고려해야 할 사항들입니다.

#### 광원 설정 최적화

- **Light Source Angle 조절**: Directional Light의 Light Source Angle 값이 클수록 더 넓은 반그늘을 생성하지만, 그만큼 계산해야 할 오브젝트 수가 증가하여 성능 비용이 높아집니다.
- **Distance Field Shadow Distance 제한**: 이 값이 너무 크면 컬링 효율이 떨어져 필요 이상으로 많은 오브젝트를 계산하게 됩니다. 카메라 뷰 거리에 맞춰 적절히 제한하는 것이 좋습니다

#### 메시 설정 최적화
- **Two-Sided Distance Field 사용 주의**: Static Mesh의 Build Settings에서 'Two-Sided Distance Field Generation' 옵션을 활성화하면 얇은 메시(예: 잎, 천)에 대해 양면 SDF를 생성합니다.  
  이 옵션은 계산 비용과 메모리 사용량을 증가시키며, 불필요한 경우 비활성화하는 것이 좋습니다.
- **Distance Field 해상도 최적화**: 모든 메시에 높은 해상도를 적용하기보다는, 카메라에 가깝거나 그림자 품질이 중요한 메시에만 높은 해상도를 할당하고 나머지는 낮은 해상도를 사용하여 메모리와 성능을 절약할 수 있습니다


---
**참고자료**
- [언리얼 엔진의 메시 거리 필드](https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-in-unreal-engine?application_version=5.3)