---
date created: 2026-02-16
tags:
  - Unreal
  - Cinematic
  - Camera
---
언리얼 엔진에서 영화나 게임 장면에 실사적인 카메라 움직임을 부여하고 싶을 때 카메라 쉐이크 기능을 활용할 수 있습니다.

특히 Hand-Held 촬영기법의 자연스러운 흔들림이나 폭발, 지진 같은 강렬한 효과를 표현할 때 유용합니다. 이 글에서는 언리얼 엔진 5에서 카메라 쉐이크를 구현하는 두 가지 방법을 소개합니다.

## 방법 1. Camera Shake Base Blueprint

Blueprint Class에서 제공하는 Camera Shake Base를 사용하면 코드 없이 카메라 쉐이크를 구현할 수 있습니다. 
이 방법은 **런타임에서 동적으로 카메라 쉐이크를 트리거해야 하는 게임플레이 상황에 적합**합니다.

![[Camera _shake.png]]

#### 타일링 패턴 문제와 해결

카메라 쉐이크는 수학적 함수로 생성되기 때문에, 시간이 길어질수록 특정 패턴이 반복되어 보이는 타일링 현상이 발생할 수 있습니다. 이를 해결하기 위해서는 여러 개의 카메라 쉐이크를 레이어로 쌓아서 사용하는 것이 효과적입니다. 
예를 들어, 매우 미세하고 빠른 흔들림과 더 크고 느린 흔들림을 조합하면 훨씬 자연스럽고 무작위한 움직임을 만들어낼 수 있습니다.

#### 주요 속성 설정

**전역 강도 및 타이밍 조절**
- **Rotation Amplitude Multiplier**: 쉐이크의 전체 강도를 조절합니다. 값이 클수록 흔들림이 강해집니다.
- **Rotation Frequency Multiplier**: 쉐이크의 주기를 조절합니다. 값이 클수록 흔들림이 빨라집니다.  

<br>

**방향별 흔들림 가중치 조절**  
각 축의 수치는 전체 흔들림 안에서 특정 방향에 얼마나 비중을 둘지 결정하는 가중치 역할을 합니다. 예를 들어 Pitch 값을 높이면 위아래 흔들림이 더 두드러지게 표현됩니다.
- **Pitch**: 위아래 방향의 흔들림 가중치
- **Yaw**: 좌우 방향의 흔들림 가중치
- **Roll**: 화면이 좌우로 기울어지는 회전 흔들림 가중치

<br>

**추가 옵션**
- **FOV**: 시야각의 확대/축소를 통한 흔들림 효과를 추가할 수 있습니다.
- **Duration**: 쉐이크가 지속되는 시간을 설정합니다. -1으로 설정하면 무한 반복됩니다.


> [!warning] FOV 쉐이크 주의점
> 과하면 멀미를 유발해, VR과 FPS 게임에서도 매우 제한적으로 사용됩니다.


---

## 방법2. Sequencer Procedure Workflow 

시퀀서의 프로시주얼 워크플로우는 미리 동선을 잡아둔 시네마틱 시퀀스에 카메라 쉐이크를 추가할 때 유용한 방법입니다. 
방법 1에 비해 더 직관적이고 시각적으로 결과를 확인하면서 작업할 수 있으며, 
무작위성이 높은 자연스러운 카메라 쉐이크를 쉽게 구현할 수 있다는 장점이 있습니다.

#### Additive 트랙 추가하기

시퀀서에서 카메라의 Transform 트랙을 선택한 후, 플러스(+) 버튼을 클릭하여 Additive 트랙을 추가합니다. 
만들어진 Additive 트랙은 기존 Transform 값에 상대적인 변화값(delta)을 더하는 방식으로 동작하며, 기본 카메라 애니메이션을 유지한 채 추가적인 움직임을 레이어처럼 쌓을 수 있게 해줍니다. 

이렇게 하면 메인 트랙에는 의도한 카메라 이동 애니메이션을 유지하고, Additive 트랙에는 카메라쉐이크 효과를 위한 노이즈만 별도로 추가할 수 있어 작업이 훨씬 유연해집니다.


![[Sequencer Camera Procedutal Workflow 01.png]]

#### Perlin Noise 노이즈 적용하기

Additive 트랙에 카메라 노이즈를 추가하는 방법은 다음과 같습니다:

1️⃣ Additive 트랙의 Rotation Roll, Pitch, Yaw를 선택합니다.

2️⃣ 우클릭하여 컨텍스트 메뉴를 엽니다.

3️⃣ Override with Double Perlin Noise를 선택합니다.

 > [!info] 
 > Perlin Noise는 자연스러운 무작위성을 가진 수학적 노이즈 함수로, 구름이나 지형, 카메라 흔들림 같은 자연스러운 효과를 만드는 데 널리 사용됩니다.

![[Sequencer Camera Procedutal Workflow 02.png]]

#### 커브 에디터에서 노이즈 조정하기

추가한 노이즈의 세부 설정을 조정하려면 커브 에디터(Curve Editor)를 사용하는 것이 편리합니다.
커브 에디터에서는 노이즈의 진폭(amplitude), 주파수(frequency), 옥타브(octave) 등을 세밀하게 조절하여 원하는 느낌의 카메라 흔들림을 만들어낼 수 있습니다.

---

**참고자료**
- [Camera Shakes in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/camera-shakes-in-unreal-engine?application_version=5.3)
- [Making maps with noise functions](https://www.redblobgames.com/maps/terrain-from-noise/)