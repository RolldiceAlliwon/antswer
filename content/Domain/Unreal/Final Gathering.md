---
title: Final Gathering
tags:
  - Unreal
  - Rendering/GI
date:
---

**Final Gathering**

1차 바운스에 한해 RTGI(Brute force)와 동일한 방식으로 진행되며, 이후 주변의 Gather Point를 평균화(공유)하여 **빠르게 부드러운 GI를 생성하는 방식** (Biased 방식)

특징
- UE5.1 기준 최대 바운스 횟수가 1회로 제한되어 있기에 샘플 값을 8이상으로 사용하는 것을 권장.
	- ∴ 즉 반사가 심하지 않은 곳엔 이것을 적용.
- Final Gathering Qulity를 높이는건 특히 인테리어나 건축 시각화에서 중요함.

---

**Brute Force**
가장 정교한 GI연산이 가능하지만, 비교적 큰 비용이 드는 방식

특징
- 애니메이션 플리커 및 고스팅 현상이 발생하지 않음.
- 또한 Samples per pixel 만으로 쉽게 컨트롤이 가능한 실용적인 GI엔진.
- 여러 번의 반사가 필요한 실내 같은 경우 이것을 사용.