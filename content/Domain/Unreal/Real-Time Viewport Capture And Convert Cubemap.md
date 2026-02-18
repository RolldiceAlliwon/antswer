---
date: 2024-11-10
tags:
  - Reflection
  - Unreal
---
Render Target 기반 CubeMap 베이킹은 동적으로 계산되는 언리얼 씬의 환경을 HDR로 저장해 정적인 상태로 변환해서 저비용으로 재사용하기 위한 전략입니다.

이는 실시간 계산 비용을 줄이고, 안정적인 환경광과 반사를 확보하는 데 매우 유용하죠.

이 튜토리얼에서는 언리얼에서 리얼타임으로 렌더링되는 씬을 캡처하여 HDRI CubeMap 텍스처로 베이킹하는 방법을 다룹니다.

## Step1. 렌더 타깃을 활용한 실시간 뷰포트 캡처방법

> 1️⃣ **Scene Capture Cube 액터**를 레벨에 배치한다.

> 2️⃣ **콘텐츠 브라우저 Add → Texture - Cube Render Target 를 생성한다.

> 3️⃣ **Scene Capture Cube액터 디테일 창 - Texture Target**에 생성한 렌더 타깃을 연결해준다.
>
>그럼 이제 Scene Capture Cube 카메라에서 렌더링되는 이미지가 Real-Time으로 Cube Render Target으로 적용된다.

---

## Step2. CubeMap으로 변환하는 방법

> 1️⃣ 베이킹할 해상도를 설정하기 위해 렌더 타깃으로 들어가서 Size X 값을 Power of Two 규격에 맞게 수정한다. 그리고 HDR 토클을 활성화했는지 체크한다.

> 2️⃣ 큐브맵으로 베이킹하기 위해 Cube Render Target 우클릭 → Create Static Texture를 선택한다.


---

## 활용 사례

| 상황              | 베이크 추천 여부 |
| --------------- | --------- |
| 환경이 거의 변하지 않는 씬 | ✅ 매우 적합   |
| 실시간 날씨 변화       | ❌         |

#### Skylight용 HDRI 제작

씬 기반 HDRI Cube Map을 생성해 Skylight에 적용하면, 현재 장면의 조명 상태를 IBL(Image-based-Lighting)으로 사용할 수 있습니다. 이 방식을 사용하면 세가지 이점을 확보할 수 있습니다.

**퍼포먼스 안정성**
실시간 캡처를 사용할 경우 추가 랜더 팬스가 발생하지만, 베이킹된 텍스처 샘플링만 수행하므로 GPU 비용이 줄어듭니다.

**라이팅 환경 재현성**
환경을 고정된 HDRI로 사용하면 조명 결과가 변하지 않기 때문에, 동일한 조건에서 **일관된 렌더 결과를 재현**할 수 있습니다.

**반사 품질 개선**
HDRI 해상도가 높을수록 Specular IBL의 프리필터링된 Mip 체인 품질이 개선되어, 금속이나 유광 재질에서 **반사 디테일과 하이라이트 표현이 선명해집니다.**

특히 제품 렌더링과 같은 정적인 환경에서는 조명 일관성과 반사 품질이 중요하므로, 베이크된 HDRI Skylight 방식이 적합합니다.

---

#### 유리 재료에 선명한 반사를 얻고 싶을 때

📜[언리얼 엔진에서 씬 캡처 큐브로 반사를 만듭니다](https://www.artstation.com/blogs/saschahenrichs/Rm7o/build-reflections-with-a-scene-capture-cube-in-unreal-engine)

Scene Capture Cube는 선명한 로컬반사를 구현하는데 도움이 되지만 비용이 매우 높습니다.
- 매 프레임 6방향 렌더링
- 캡처 해상도가 고해상도일수록 GPU 부하 증가

이때 렌더 타깃 텍스처로 큐브맵을 한 번만 베이크하면 이후에는 단순한 Texture 샘플링만 수행합니다.

> [!example] 사용 예시
> - 쇼룸 환경 반사
> - 금속 재질 강조 씬


>![[Cube Render Target Material Setting.png]]
>텍스처 샘플은 물론 렌더 타겟 텍스처를 유지합니다.

---

**참고자료**
- [1.6 - 씬 캡처 큐브](https://dev.epicgames.com/documentation/en-us/unreal-engine/1.6---scene-capture-cube?application_version=4.27&utm_source=chatgpt.com)


