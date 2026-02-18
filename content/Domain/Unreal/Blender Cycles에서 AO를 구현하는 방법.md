---
date: 2024-08-13
tags:
  - Blender
  - Texturing
  - Cycles
---
블렌더를 사용할 때 Cycles에는 Eevee처럼  ‘렌더 설정’ 탭에 AO 토글 옵션은 존재하지 않습니다.
이는 Cycles가 물리 기반 경로 추적(Path Tracing) 렌더러이기 때문입니다.

AO는 근본적으로 래스터화 방식의 게임 엔진 등에서 주로 렌더링 속도를 위해 실제 빛의 계산을 단순화(Fake) 하는 가짜 그림자 기법입니다. 
그런데 사실적인 광원 계산을 목표로 하는 Cycles에서는 그럴 필요가 없고, 더 정확한 방식이 존재하기 때문입니다.

그러나 특정 연출이나 디테일 강조를 위해 AO를 추가로 사용하고 싶다면, Shader Editor에서 노드를 활용하여 직접 구성하는 방식으로 구현할 수 있습니다.

## Cycles에서 AO 맵을 적용하는 방법

**기본 구조**

> 1. `Ambient Occlusion` 노드 추가
> 2. `ColorRamp` 출력을 활용해 음영 강도를 미세조정
> 3. `Mix` 또는 `Multiply` 방식으로 Base Color에 결합
>
>![[Relistic Detail in bledner with powerful node.png]]

