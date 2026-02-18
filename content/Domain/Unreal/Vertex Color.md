---
aliases:
date: 2024-10-12
tags:
  - Modeling
  - Texturing
---
## 기본 개념

Vertex Color는 오브젝트의 각 정점(Vertex)에 색상 데이터를 저장하는 방식입니다. 이는 머테리얼과는 별개의 개념으로, 메시 자체에 포함되는 추가 데이터 채널이죠.

각 폴리곤을 구성하는 정점마다 서로 다른 색상 값을 지정할 수 있으며, 이를 통해 **모델 내부 영역을 구분하거나 마스킹 정보로 활용할** 수 있습니다. 

이러한 데이터는 Substance Painter와 같은 외부 툴에서도 인식되며, 모델의 섹션을 구분하거나 특정 영역에 다른 재질 효과를 적용하는 데 자주 사용됩니다.

## 기술적 관점에서의 특징

**✅ 장점**

| 장점         | 설명             |
| ---------- | -------------- |
| **메모리 효율** | 텍스처 메모리 절약     |
| **동적 수정**  | 런타임에서 수정 가능    |
| **간단한 구현** | 복잡한 UV 매핑 불필요  |
| **다채널 활용** | RGBA 4개 독립 마스크 |

❌ **제약사항**

Vertex Color는 Vertex 단위 데이터이기 때문에, 정점 사이의 값은 렌더링 과정에서 선형 보간(Linear interpolation)됩니다. 따라서 **폴리곤 밀도가 낮을수록 경계 표현은 부드럽게 블렌딩**됩니다.

그 결과 **하드 마스크 표현에 구조적 한계** 존재합니다.

하지만 명확한 분리가 필요할 경우에는 다음과 같은 방식으로 해결할 수 있습니다.
- 경계 지점에 정점을 추가하여 보간 범위 축소
- 메시를 분리하여 영역 자체를 물리적으로 분할
- 필요한 경우 텍스처 마스크와 병행 사용

---
 
 **프로그램 별 Vertex Color 참고자료:**
- Blender: [https://youtu.be/8mNk6r_bwxI](https://youtu.be/8mNk6r_bwxI)
- Cinema 4D: [https://youtu.be/Q7HWRrA1SFc](https://youtu.be/Q7HWRrA1SFc)
- 3Ds Max: [https://youtu.be/SA9S2-vTDCY](https://youtu.be/SA9S2-vTDCY)
- Maya: [https://youtu.be/av2dHq8NPag](https://youtu.be/av2dHq8NPag)
- Unreal: [https://youtu.be/lkxZ1DMRQPg](https://youtu.be/lkxZ1DMRQPg)
- Unity: [https://youtu.be/YfyFqUemD40](https://youtu.be/YfyFqUemD40)

## 활용 사례

>[!example] 영역 마스킹 활용 예시: 지형 재질 블렌딩
>```
>정점 색상:
>R 채널 = 흙 영역 (1.0 = 100% 흙)
>G 채널 = 풀 영역 (1.0 = 100% 풀)
>B 채널 = 돌 영역 (1.0 = 100% 돌)
>머티리얼에서:
> 최종 색상 = (흙 텍스처 × R) + (풀 텍스처 × G) + (돌 텍스처 × B)
>```
>**이점**
>- 별도의 마스크 텍스처가 불필요합니다.
>- 런타임에서 동적 수정 가능합니다.

> [!example] 섹션 구분 활용 예시: Substance Painter
>
>```
>캐릭터 모델:
>├─ 머리 영역: R=1, G=0, B=0
>├─ 몸통 영역: R=0, G=1, B=0
>└─ 팔다리 영역: R=0, G=0, B=1
>```
>**이점**
>- 분류한 섹션 별로 재질을 관리하기 용이합니다.
>- ID Map 대용으로 활용합니다.
>> [!warning]
>> Vertex Color로 표현 가능한 디테일 수준은 **메시의 버텍스 밀도(Vertex density)** 에 의해 제한됩니다.
>>Vertex 수가 적을수록 디테일한 표현에는 한계가 있습니다.

> [!example] 게임 엔진 활용 예시
> **눈 축적 효과**
>- Vertex Color로 눈이 쌓일 수 있는 영역 표시
>- 런타임에 눈 셰이더 강도 조절
>
>**데미지 시스템:**
> - 피격 부위에 Vertex Color 값을 변경하여 손상 정도를 시각화

