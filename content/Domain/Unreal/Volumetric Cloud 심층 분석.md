---
date: 2024-01-05
tags:
  - Lighting
  - Cinematic
  - Unreal
---

언리얼 엔진의 Volumetric Cloud는 실시간으로 동적인 구름을 생성할 수 있는 시스템입니다. 
메테리얼 기반으로 동작하기 때문에 메테리얼 인스턴스의 파라미터를 조정하여 구름의 형태와 외형을 세밀하게 제어할 수 있습니다.

Volumetric Cloud를 사용하기 위해서는 플러그인을 활성화해야 합니다.
⚙️ Plugins → Volumetric 활성화 ✅

## Cloud Material Parameter for Artist

아티스트 관점에서 구름의 외형을 제어하는 주요 파라미터들입니다. 각 파라미터는 구름의 형태, 밀도, 음영 등에 직접적인 영향을 미칩니다.

#### 기본 형태 제어

- `Bias`: 전체 구름의 양을 조절합니다.
    - 값이 증가할수록 구름이 감소해 깔끔한 하늘을 구현할 수 있습니다.
<br>
- `Density`: 구름의 밀도를 제어합니다.
    - 밀도가 높을수록 구름이 두껍고 불투명하게 보입니다.
<br>
- `Depth Density Bias`: 구름의 불투명도를 조절합니다.
    - 구름 내부의 깊이감과 볼륨감(대비)에 영향을 줍니다.

#### 디테일 제어

- `Detail`, `Detail2`: 구름 표면의 디테일 정도를 조절합니다.
    - 내부적으로 노이즈 텍스처의 타일링을 조정하여 구름의 세밀한 형태를 만들어냅니다.
<br>
- `Scale`, `Scale2`: Detail과는 다른 느낌의 노이즈 형상 타일링을 조절합니다.
    - 여러 스케일의 노이즈를 조합하면 실제 존재하는 자연스러운 구름을 만들 수 있습니다.

#### 라이팅 제어

- `MS C` (Multi Scattering Contribution): [Directional Light](app://obsidian.md/Directional%20Light)의 영향력을 조절합니다.
    - 값이 높을수록 태양광이 구름에 미치는 영향이 커집니다.
<br>
- `Out D` (Output Density): 음영과 함께 조절되는 수채화 느낌의 구름을 구현합니다.
	- 구름 하단에 그림자가 부각돼 입체감이 강조됩니다.
	- 구름 내부의 어두운 영역(빗물이 포함된 부분)과 밝은 영역의 대비가 극명해져 동적인 느낌을 연출할 수 있습니다.

![[out D.png]]
<br>
- `Pre Exponential Density`: 또 다른 방식의 수채화 느낌 구름을 구현합니다.
	- Out D와 달리 구름 하단의 명도가 유지되어 더 부드러운 느낌을 줍니다

![[Pre Exponential density.png]]
<br>

> [!tip] Volumetric Cloud Rim Lighting
>
>Directional Light → Atmosphere and Cloud → Cloud Scatterd Luminance Scale
>
>구름 가장자리에 림 라이팅 효과를 추가하여 백라이팅 상황에서 구름의 실루엣을 강조할 수 있습니다. 

<br>

#### 색상 제어

- `ecx` (Extinction): 구름의 Subsurface Scattering 효과를 통한 색상을 조절합니다.
    - 동적이고 비현실적인 판타지풍 구름을 연출할 수 있습니다.

![[etc+ absorption.png]]

> [!warning] [Absorption](app://obsidian.md/Sky%20Atmosphere)과 함께 사용할 경우 지정한 색의 보색으로 색이 입혀지므로, 색상 선택 시 이를 고려해야 합니다.


## Local Volumetric Cloud

특정 영역에만 구름을 배치하고 싶을 때 사용하는 기능입니다.

#### 사용 방법

📂 콘텐츠 브라우저 → 플러그인 폴더 → Volumetric
`BP_CloudMaskObject`: Local Cloud를 원하는 위치에 배치할 수 있습니다.
`BP_CloudMaskGenerator`: Local Cloud의 렌더링을 제어합니다.
<br>
⚠️ BP_CloudMaskObject를 제거한 후 Generator에서 'Render Cloud'를 선택하면 Volumetric Cloud가 다시 캡처됩니다.
⚠️ 구름의 위치나 형태를 변경한 후 반드시 리캡쳐를 거쳐야 변경 사항이 반영됩니다.

---

## Cinematic Qulity Render Setting

#### Voulumetric Cloud

%%- **Volumetric Cloud Properties → Volumetric Sample**
	- 1000 이상으로 설정하여 충분한 샘플링 품질을 확보합니다.%%

- **클라우드 트레이싱(Cloud Tracing)** 섹션에서 리플렉션 표면의 Ray-Marching에 사용할 샘플 수를 제어할 수 있습니다. 이를 통해 구름 리플렉션과 구름 섀도 리플렉션의 품질을 독립적으로 조절할 수 있습니다.
- **View, Reflections,** **Shadows** 의 Sample Count Scale을 늘립니다. 샘플 수는 콘솔변수로 스케일의 최대값을 더 높게 설정할 수 있습니다.
    - `r.VolumetricCloud.ReflectionRaySampleMaxCount`
	- `r.VolumetricCloud.Shadow.ReflectionRaySampleMaxCount`
	- `r.VolumetricCloud.ViewRaySampleMaxCount`
	- `r.VolumetricCloud.SampleMinCount`
	- `r.VolumetricCloud.DistanceToSampleMaxCount`
<br>
- **샘플별 애트머스페릭 라이트 투과율 사용(Use per Sample Atmospheric Light Transmittance)** 속성을 활성화해서 디렉셔널 라이트의 글로벌 투과율 대신 샘플당 대기 투과율을 적용합니다.

---

```
r.VolumetricRenderTarget.Mode 0
```
Ray Maching 퀄리티 모드 한눈에 보기

| Mode  | 렌더링 특성         | 품질   | 퍼포먼스       | 장점              | 제한 사항                     | 권장 사용 상황                 |
| ----- | -------------- | ---- | ---------- | --------------- | ------------------------- | ------------------------ |
| **0** | 레이 마칭 품질 우선 모드 | ⭐⭐⭐⭐ | ❌ 가장 무거움   | 가장 정확한 트레이싱 결과  | 저해상도 내부 표현 가능             | 시네마틱, 구름 내부 비행, 우주 전환 장면 |
| **1** | 품질과 성능 균형 모드   | ⭐⭐⭐  | ⚖️ 중간      | 지상 뷰에서 자연스러운 품질 | Mode 0보다 약간 단순화           | 일반 게임플레이, 오픈월드           |
| **2** | 고해상도 지상 최적화 모드 | ⭐⭐⭐⭐ | ⚡ 상대적으로 빠름 | 빠른 트레이싱 + 고해상도  | 불투명 메시와 구름의 중첩(오버랩) 효과 제한 | 지상 기반 게임, 구름 위 비행 없음     |

---

```
r.VolumetricCloud.HighQualityAerialPerspective 1 
```
구름의 시네마틱 대기 원근을 활성화하여 저해상도 LUT 대신 고품질 레이 트레이싱을 사용합니다.

<br>

#### Material

 - **볼류메트릭 고급 머티리얼 출력(Volumetric Advanced Material Output)** 표현식
	- 지면 반사광을 구름층 최하단에 적용하여 씬의 구름 모양과 색을 더 풍부하게 합니다.
	    - 디테일 패널의 **지면 기여(Ground Contribution)** 를 활성화합니다. 
	      볼류메트릭 클라우드 컴포넌트에서 **지면 알베도(Ground Albedo)** 를 사용하여 구름의 하단, 햇빛, 대기에 적용할 지면 색을 지정합니다.
	- **Multi Scattering Approximation Octaves** 수를 **2** 까지 늘리면 구름 속의 다중 광산란 효과 시뮬레이션이 향상됩니다.
		- 값이 높을수록 구름 재질에 추가적인 산란 근사치가 적용되어 더욱 사실적인 결과물을 얻을 수 있지만, 그만큼 셰이더 연산 비용이 증가합니다.

> [!tip] **퍼포먼스 최적화 방법**
> - 클라우드 머티리얼의 **Volumetric Advanced Output** 표현식에서  기여도(Contribution)을 높이고 오클루전(Occlusion)을 낮추면 물리 계산을 단순화하면서도 유사한 시각적 결과를 얻을 수 있습니다.
> - 이는 실제 다중 산란 계산 대신 근사치를 활용하는 방식입니다.

<br>

#### Directional Light

- **Cast Cloud Shadow** ✅
- **Cast Shadow On Clouds** ✅

<br>

#### Sky Atmosphere

> [!warning]
> 프로젝트 요구사항에 따라 선택적으로 적용할 수 있는 설정입니다. 
> Sky Atmosphere는 3D 볼륨 텍스처를 사용하므로 메모리 사용량이 크게 증가할 수 있으니 주의가 필요합니다.

```
r.SkyAtmosphere.FastSkyLUT 0
```
이 최적화 기능을 비활성화하면 렌더링 속도는 느려지지만, 고주파수 디테일 표현 시 지구의 Shadow또는 스캐터링 로브에서 나타날 수 있는 **아티팩트**가 줄어듭니다.

---

```
.SkyAtmosphere.AerialPerspectiveLUT.FastApplyOnOpaque 0
```
대기 내 Light Shaft의 트레이싱 품질이 향상됩니다.

---
```
r.SkyAtmosphere.FastSkyLUT.Width
```
```
r.SkyAtmosphere.FastSkyLUT.Height
```
크기 설정을 키워서 Light Shaft의 퀄리티를 향상합니다.

---
```
r.SkyAtmosphere.AerialPerspectiveLUT.Width
```


---
- Sky Atmosphere 컴포넌트의 **Trace Sample Count Scale**로 샘플 수를 조절합니다.
	- 슬라이더 범위가 부족할 경우 `r.SkyAtmosphere.SampleCountMax`의 콘솔로 직접 최댓값을 설정할 수 있습니다.
<br>
#### Movie Render Que

- **Anti Aliasing**
    - AA Method: None
        - Volumetric Cloud는 자체적으로 Temporal Antialiasing을 사용하므로 중복 적용은 피합니다.
    - Spatial Sample Count: 64 이상
        - 높은 샘플 수를 통해 노이즈를 최소화하고 부드러운 결과물을 얻을 수 있습니다.

---

## Trouble Shooting

#### 하늘 수평선 제거 방법

언리얼 엔진의 기본 Sky Atmosphere는 지구 곡률을 고려하여 수평선을 생성합니다. 
행성 규모가 아닌 환경에서 이를 제거하려면 다음 방법을 고려할 수 있습니다.

- [Simul trueSKY 플러그인](https://simul.co/) 사용
    - 상용 플러그인으로 더욱 유연한 하늘 시스템을 제공합니다.
- [행성 규모 구름 제작 튜토리얼](https://www.youtube.com/watch?v=RkpVzzTAVhw)
    - 대규모 환경에서의 구름 설정 방법을 다룹니다.

---
