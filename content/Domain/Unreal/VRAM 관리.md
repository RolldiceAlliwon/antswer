---
aliases:
date: 2023-01-05
tags:
  - Optimization
  - Texture
  - GPU
  - VRAM
---

해상도(Resolution)는 디지털 이미지나 디스플레이가 표현할 수 있는 세밀함의 정도를 나타냅니다. 3D 그래픽스 작업에서 해상도는 텍스처의 품질과 성능 최적화에 직접적인 영향을 미치는 핵심 요소입니다. 이 글에서는 해상도의 개념과 GPU 최적화 관점에서 텍스처 해상도를 관리하는 방법에 대해 알아보겠습니다.

![[Resolution 비교.png]]

PPI는 'Pixel per Inch', 즉, '1인치 안에 들어 있는 픽셀 수'라는 의미입니다.
디스플레이는 같은 면적 안에 픽셀(화소)이 더 조밀하게 배치돼있을수록 이미지가 더 선명하게 보입니다.

---

## GPU 최적화와 VRAM 관리

#### 텍스처 처리 과정

3D 프로그램에서 텍스처가 렌더링될 때, 저장장치(HDD/SSD)에 있는 텍스처 파일은 먼저 그래픽카드의 VRAM(Video RAM)으로 로드된 후 연산됩니다. 이 과정에서 텍스처의 해상도가 높을수록 VRAM 사용량이 증가하게 됩니다.

#### VRAM 부족 시 발생하는 문제

VRAM이 부족하면 다음과 같은 현상이 발생할 수 있습니다.
- 텍스처 스트리밍으로 인한 품질 저하
- 프레임 드랍
- Unreal에서 “Out of memory” 크래시

하지만 그래픽 카드는 3D 프로그램 뿐 아니라 윈도우, 영상 플레이어 등 다양한 프로그램의 그래픽 처리를 동시에 담당합니다.
따라서 텍스처 해상도를 VRAM 예산 내에서 효율적으로 관리하는 것이 중요합니다.

#### 텍스처 해상도와 메모리 관계

텍스처 해상도는 가로 × 세로 픽셀 수로 계산됩니다.
즉, 해상도가 2배 증가하면 픽셀 수는 4배 증가합니다.
예를 들어 2048px에서 4096px로 해상도를 높이면, 실제 메모리 사용량은 약 4배 증가하게 됩니다.

|            | 2048px  | 4096px   |
| ---------- | ------- | -------- |
| Texture    | 2~3mib  | 8~12mib  |
| Normal Map | 8~12mib | 최대 40mib |

> [!info] 
> 노멀 맵이 일반 텍스처보다 메모리를 더 많이 사용하는 이유는 RGB 채널의 압축률이 낮기 때문입니다.

---

**참고자료**
- [Tips and Tricks: Vulkan Dos and Don’ts](https://developer.nvidia.com/blog/vulkan-dos-donts/)
- [Texture Streaming](https://docs.unrealengine.com/5.3/en-US/texture-streaming-in-unreal-engine/)

