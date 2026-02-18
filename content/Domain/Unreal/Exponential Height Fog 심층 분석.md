---
date: 2026-02-15
tags:
  - Fog
  - Unreal
---

Exponential Height Fog는 언리얼 엔진에서 높이에 따라 농도가 달라지는 안개를 구현하는 기능입니다. 낮은 지역일수록 안개가 짙고, 높은 지역일수록 옅어지는 자연스러운 대기 효과를 만들 수 있습니다.

이 기능은 Sky Atmosphere와 함께 사용하면 더욱 효과적입니다. Sky Atmosphere가 먼 거리의 대기 산란을 담당한다면, Exponential Height Fog는 카메라 근처의 부차적인 안개 표현을 추가하여 장면에 깊이감을 더해줍니다.

> [!summary] 주요 특징
> - 높이 기반의 직관적인 안개 제어
> - Depth 버퍼를 활용한 경량 연산으로 성능 부담이 적음
> - 빛 산란 효과가 가능한 Volumetric Fog 지원
> - Volumetric Light 기능 사용을 위한 필수 액터

---

## 기본 설정

#### Transform 설정

Height Fog는 월드 Z 값을 기준으로 계산됩니다. 따라서 액터의 위치가 잘못되면, 안개 분포가 비현실적으로 보일 수 있습니다.
왜냐하면 밀도 계산의 기준점이 액터 위치이기 때문입니다. 안개는 화면 위에 덧씌워지는 효과가 아니라, 공간 좌표에 반응합니다.

권장 세팅:
1. Transform을 (0,0,0)으로 초기화
2. Z축을 지면 높이에 맞춤
 
> [!tip]
> 물 표면이 있다면 물의 높이에 맞추면 더욱 자연스러운 효과를 얻을 수 있습니다.

---
## Exponential Height Fog 주요 속성

- **Fog Density**는 안개의 전체적인 농도를 조절합니다. Volumetric Fog가 켜져 있다면 근경 밀도에도 직접적으로 영향을 줍니다.
<br>
- **Fog Height Falloff**는 높이에 따른 안개 감쇠 정도를 설정합니다.
	- 낮은 값일수록 전체적으로 균일한 안개
	- 높은 값일수록 지면에만 얇게 깔린 안개
<br>
- **Fog Cutoff Distance**는 안개가 하늘의 색상을 침범하는 것이 부자연스럽게 보일 때, 해당 속성을 조정해 안개가 적용되는 최대 거리를 제한해서 확실한 경계를 둘 수 있습니다. 
  Sky Atmosphere와의 간섭을 줄이는 용도입니다.
<br>
- **Directional Inscattering** (방향성 산란)은 태양 방향으로 빛이 산란되는 효과를 조절합니다. 
  카메라가 광원을 향할 때만 확인할 수 있습니다.
	- **Directional Inscattering Exponent**: 빛 산란의 퍼짐 정도 조절
	- **Directional Inscattering Start Distance**: 산란 효과가 시작되는 거리 설정
	- **Directional Inscattering Color**: 산란광 색상 설정

---

## Volumetric Fog 설정

Volumetric Fog는 빛이 안개 입자를 통과하며 산란되는 효과를 시뮬레이션합니다. 
이를 통해 [[Light Shaft 심층 분석|Light Shaft]]와 같은 볼륨감 있는 조명 효과를 만들 수 있습니다.
<br>
- **Scattering distribution**은 빛이 안개를 통과할 때 산란되는 방향을 제어합니다.
	- **0**: 모든 방향으로 균등하게 산란 (등방성 산란)
	- **0.9**: 빛의 진행 방향으로 주로 산란 (전방 산란)
<br>
- **Extinction Scale**은 Volumetric Fog의 불투명도(Opacity)를 조절합니다. 
  값이 높을수록 안개가 더 짙어집니다.
<br>
- **Albedo**가 안개 입자의 색상을 설정합니다.
	- **White**: 빛을 그대로 반사하여 밝은 안개
	- **Black**: 빛을 흡수하여 어두운 안개 (View Distance 거리 내의 근경이 선명해지는 효과)
<br>
- **View Distance**는 카메라로부터 Volumetric Fog가 계산되는 최대 거리를 설정합니다 (단위: cm).
	- 값이 0 이라면 Volumetric Fog가 사실상 비활성화됩니다.
	- 이 거리를 넘어서는 Linear Fog가 적용됩니다.

---

## Mechanism

#### Linear Fog와 Volumetic fog의 관계

Exponential Height Fog는 실제로 두 가지 시스템이 조합되어 작동합니다.

- **Volumetric Fog (근경)**: View Distance 내의 영역에서 볼륨감 있는 3D 안개 렌더링
- **Linear Fog (원경)**: View Distance를 초과하는 영역에서 2D 화면 공간 안개 렌더링

#### Start Distance 작동 조건

- **Start Distance < View Distance**: Start Distance 설정이 무시됩니다. 
  (Volumetric Fog가 0부터 렌더링되므로)
- **Start Distance > View Distance**: Start Distance부터 Linear Fog가 시작됩니다

![[HeightFog Mechanism.png]]


---

## 트릭. Post Process 기반 커스텀 안개

PPV(Post Process Volume)의 머티리얼 슬롯에 커스텀 포스트 프로세스 머티리얼을 생성하여 Linear Fog를 독립적으로 제어하는 방법도 있습니다.

**공부자료**
- [https://www.artstation.com/artwork/lDE9BG](https://www.artstation.com/artwork/lDE9BG "https://www.artstation.com/artwork/lDE9BG")
- [https://youtu.be/sYYaIbkC5QU?si=ISjVoCmPG-vVmPZh](https://youtu.be/sYYaIbkC5QU?si=ISjVoCmPG-vVmPZh "https://youtu.be/sYYaIbkC5QU?si=ISjVoCmPG-vVmPZh")
---
**참고자료**
- [Exponential Height Fog in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/exponential-height-fog-in-unreal-engine?application_version=5.3)
- [Volumetric Fog in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-fog-in-unreal-engine?application_version=5.3)
