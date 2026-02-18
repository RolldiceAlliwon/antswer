---
aliases:
  - God Ray
date: 2026-02-14
tags:
  - Lighting
  - Unreal
description:
---
Light Shaft (또는 God Ray)는 빛이 대기 중의 입자들을 통과하며 만들어내는 광선 효과로, 
게임에서 사실적이고 드라마틱한 조명 연출을 위해 자주 사용됩니다.
Unreal Engine은 이러한 효과를 구현하기 위해 프로젝트에 따라 성능과 품질 측면을 고려한 각각 다른 전략이 필요하며 각각 다른 특성을 가지고 있습니다.
이번엔 세 가지 방식의 구현 방법의 특징과 사용 시나리오, 그리고 최적화 방법을 다룹니다.

## Light Shaft (God Ray)

![[Light Shaft.png]]

Light Shaft는 하늘에서 내리는 빛줄기를 표현하는 시각 효과입니다. 
오브젝트가 빛을 가리는 부분의 차폐를 표현하기 때문에 'Light Blocking'이라고도 불립니다.
태양의 고도가 낮을수록 빛이 대기를 더 긴 경로로 통과하게 되므로 산란 효과가 강해지고, 이로 인해 더욱 드라마틱한 Light Shaft가 형성됩니다.

---

## 방식1. Geometry / Material 기반 God Ray

### 특징

- 실제 광학 계산이 아닌, 시각적 연출에 가까운 방식입니다.
- 세가지 방식 중 GPU 비용이 가장 낮습니다. 

### 장점

- 모바일 및 저사양 플랫폼에 적합합니다.
- 성능 부담이 거의 없습니다.
- 원하는 위치에 배치할 수 있어서 연출을 통제하기 쉽습니다.

### 단점

- 물리적으로 정확하지 않습니다.
- 카메라 각도 변화에 따라 부자연스럽게 보일 수 있습니다.
- 라이트와의 상호작용이 제한적입니다.

### 사용 권장 상황

모바일 게임이나 저사양 플랫폼을 타겟으로 하는 프로젝트에서 경제적인 God Ray 효과가 필요할 때 사용하는 것이 좋습니다.

### 구현방식

1️⃣ Plugins - DMX Fixture 활성화✅

2️⃣ 📂 콘텐츠 브라우저 Plugins → DMXFixtures → Light Fixtures → DMX Material - MI_Beam

![[MI_Beam.png]]

3️⃣ Plane을 배치하고 메테리얼을 입히면 Fake God Ray효과를 사용할 수 있습니다.

## 방식2. Light Shaft 기반 God Ray

Directional Light에는 기본적으로 Screen Space 기반 Light Shaft 기능이 포함되어 있습니다.

### 장점

- 비교적 낮은 비용으로 구현 가능합니다.
- 설정이 간단합니다.
- 중간 사양 플랫폼에 적합합니다.

### 단점

- Screen Space 기반이므로 카메라 밖의 정보는 반영되지 않습니다.
- 실제 볼륨 산란과는 다릅니다.

### 사용 권장 상황

중간 사양의 PC나 콘솔 게임에서 적절한 품질과 성능의 균형이 필요할 때 적합합니다.

### 주요 설정

Directional Light의 주요 속성이 있고 제어할 수 있습니다.
- `Light Shaft Bloom`: 스크린을 밝게 만들어 God Ray를 생성합니다.
- `Light Shaft Occlusion`: 차폐 정도를 조절합니다



## 방식 3. Volumetric fog 기반 God Ray

가장 물리적으로 정확한 방식은 Volumetric Fog를 활용하는 것입니다.
이 방식은 실제로 3D 공간 내의 볼륨을 계산하여, 빛이 공기 중에서 산란되는 과정을 시뮬레이션합니다.

### 장점

- 물리적으로 정확한 결과를 제공합니다.
- 반투명(Translucency) 오브젝트와 상호작용합니다.
- Dynamic Shadow와 Static Shadow 모두 지원합니다.
- 다양한 광원 타입(Directional, Spot, Point, Rect...)과 연동됩니다.

### 단점

- GPU 비용이 가장 높습니다.
- 씬에서 사용하는 라이트가 많을수록 비용이 증가합니다.
- 특히 Volumetric Shadow를 생성하는 라이트의 경우 성능 비용이 더욱 커집니다.

### 사용 권장 상황

고사양 PC 게임이나 차세대 콘솔 프로젝트 그리고 게임 시네마틱 연출에서 최고 품질의 라이팅이 필요할 때 사용합니다.


### Volumetric fog 주요 설정

#### Directional Light 설정

- `Atmosphere/Fog Sun Light` 활성화
<br>
- Light 고급표시 → `Cast Volumetric Shadow` 활성화
<br>
- `Volumetric Scattering Intensity` 
	- 해당 라이트가 볼륨 안개에 얼마나 영향을 주는지 조절합니다. 즉 값이 높을수록 Godlay 세기가 강해집니다.

> [!tip] Volumetric Scattering Intensity
> 디렉셔널 라이트뿐만 아니라 모든 광원 타입에 장착된 속성입니다.

<br>

#### Exponential Height Fog 설정

Volumetric Fog는 Exponential Height Fog 컴포넌트에서 제어됩니다.

- `Scattering Distribution`
	- 빛이 얼마나 전방 산란되는지 결정합니다.  
	- 값이 1에 가까울수록 카메라 방향으로 강하게 산란됩니다.
<br>
- `Albedo`
	- 공기 입자의 반사율입니다.
	- 수증기 기반 안개는 Value가 높은 값(백색)에 가깝고, 연기나 스모그는 Value가 낮은 값(흑색)을 사용합니다.
<br>
- `Extinction Scale`
	- 매질이 빛을 얼마나 흡수하는지 결정합니다.  
	- 값이 높을수록 빛이 빠르게 감쇠합니다.
<br>
- `View Distance`
	- 카메라에서 계산되어 렌더링되는 볼륨 범위를 설정합니다.
<br>
- `Static Lighting Scattering Intensity`
	- Lightmass로 베이크된 Volumetric Lightmap의 영향도를 조절합니다.
		- 🐛 디버깅:  표시 → 시각화 → 볼류메트릭 라이트맵
<br>
- `Override Light color with fog inscattering colors`
	- 고급에 숨겨져 있는 이 기능은 Fog Color를 God Ray에 반영합니다.
<br>
%%
- `Emissive` 베이크 라이팅을 사용하지 않은 경우 일루미네이티드 포그(?) 예술적 표현를 할 떄 쓰임
%%

#### Volumetric Fog 최적화

Volumetric Fog는 해상도 기반 3D 그리드를 사용합니다.  
따라서 해상도와 거리 설정이 성능에 직접적인 영향을 줍니다.

`Global Fog Density` 값을 줄여서 전반적인 연산량을 낮출 수 있습니다.

---

## 시네마틱 품질을 위한 고급 옵션

### 옵션1. Raytraced Shadows로 God Ray 얻는 방법

Ray Traced Shadow는 기존 섀도 맵 방식보다 Geometry 정보를 더 정확하게 반영하여 그림자를 계산합니다.
이를 Volumetric Fog와 함께 사용하면, 공기 중에서 형성되는 God Ray의 차폐 표현이 보다 정교해질 수 있습니다.

특히 다음과 같은 상황에서 차이가 드러납니다.
- 얇은 구조물(난간, 철골, 나뭇가지 등)을 통과하는 역광 장면
- 복잡한 실루엣이 강조되는 시네마틱 컷
- 안개 밀도가 높아 빛줄기 디테일이 중요한 장면

이 경우 Ray Traced Shadow는 구조물의 형태를 더 정확하게 반영하여, God Ray의 경계가 자연스럽고 선명하게 표현됩니다.
실제로 Blur Studio에서 제작한 Unreal 기반 시네마틱 프로젝트인 _Secret Level: Unreal Tournament_ 단편에서도 이러한 방식이 활용됐습니다.

#### 설정 방법

1️⃣ 조명에 Cast Volumetric Shadow 활성화

2️⃣ Cast Ray Traced Shadows - Enable로 설정

3️⃣ 그런 다음 콘솔 변수를 입력합니다.

```
r.VolumetricFog.InjectRaytracedLights 1
```

레이 트레이싱 그림자를 사용하는 라이트가 볼류메트릭 포그 계산에 반영될지 여부를 결정합니다.

> [!warning]
> - 이 기능은 하드웨어 레이트레이싱을사용하는 프로젝트에서만 동작합니다.
> - 라이트 수가 많을수록 GPU 비용이 빠르게 상승합니다.
> - 실시간 게임보다는 시네마틱, 고사양 타겟에 적합합니다.

### 옵션2. Volumetric Fog 품질 향상

```
r.volumetricfog.gridpixelsize 
```
min: 4 / max: 2

값을 낮출수록 품질이 향상되지만, 그만큼 성능 비용도 증가합니다. 
프로젝트의 타겟 플랫폼과 성능 요구사항에 맞춰 적절한 값을 설정하는 것이 중요합니다.

---

**참고자료**
- [Unreal Engine Light Shaft Documentation](https://bit.ly/32sIa2I)
- [How to get "God Rays" with Raytraced Shadows](https://dev.epicgames.com/community/learning/tutorials/oLba/unreal-engine-how-to-get-god-rays-with-raytraced-shadows)
- [Volumetric Fog Feature Highlight](http://www.youtube.com/watch?v=N4mkgbwLg7U)
- [Why You Need Volumetric Fog & God Rays in UE5](https://www.youtube.com/watch?v=Kjg6kCW2BtY) - Render Volumetric Fog AOVs 관련 내용