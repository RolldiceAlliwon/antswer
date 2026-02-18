---
date: 2022-08-13
tags:
  - Unreal
  - Megascan
---
Unreal Engine 프로젝트에서 Quixel Megascans 에셋을 사용할 때, 프로젝트 설정 변경이나 렌더링 파이프라인 차이로 인해 예기치 않은 오류가 발생하는 경우가 있습니다. 
특히 **Virtual Texture 설정 변경 이후 Material 오류가 발생하는 문제**와, 
**특정 Megascans 에셋의 그림자가 비정상적으로 어둡게 렌더링되는 문제**는 언리얼 사용자라면 한번 쯤 겪는 사례입니다.
이 글에서는 해당 문제의 발생 원인을 분석하고, 해결 방법을 정리합니다.

## 문제 1. Quixel MSPreset 폴더 VT 손상

#### 원인 분석

프로젝트 세팅에서 'Enable Virtual Texture Support(버츄얼 텍스쳐 지원 활성화)'를 활성화한 후, Megascans Material Instance에서 오류가 발생할 수 있습니다.

![[Quixel MSPreset Folder VT Corruption.png]]

이 문제는 Megascans Master Material이 참조하는 텍스쳐가 Virtual Texture로 설정되어 있지 않기 때문에 발생합니다. 
엔진이 Virtual Texture 모드에서 일반 텍스쳐를 읽으려고 시도하면서 텍스쳐 샘플러가 손상되는 것입니다.

#### 해결 방법

Master Material에 직접 접근하여 오류가 발생한 텍스쳐 샘플러의 텍스쳐를 'Placeholder' 텍스쳐로 교체하면 문제를 해결할 수 있습니다. 이렇게 하면 Material Instance들이 정상적으로 작동하게 됩니다.

![[Resolving Quixel MSPreset Folder VT Corruption.png]]


## Megascan Asset의 비정상적인 그림자 문제

Megascan에서 다운로드 받은 일부 에셋의 그림자가 비정상적으로 어둡게(pitch black) 렌더링되는 경우가 있습니다.

![](https://preview.redd.it/n0rhp2y27ge81.png?width=1112&format=png&auto=webp&s=d157176f6fc328923002b9f6823cffd4d166f6cd)

 이 문제의 핵심은 **AO와 실시간 GI의 중첩 적용**으로 추정됩니다.
 
 Ambient Occlusion 와 Lumen같은 실시간 GI 시스템과 함께 사용할 경우, 이미 간접광 계산이 이루어진 상태에서 AO가 추가로 곱해지면서 암부가 과도하게 강조될 수 있다고 합니다.

#### 해결방법

Material에서 Ambient Occlusion 노드를 비활성화하면 문제가 해결됩니다. 

1️⃣ 해당 Material 또는 Master Material을 엽니다.
2️⃣ Ambient Occlusion 입력 핀의 연결을 해제합니다. 

이렇게 하면 그림자가 자연스럽게 복원됩니다.

---
## 결론

이번 글에서 다룬 내용을 정리하면 다음과 같습니다.

- Virtual Texture를 활성화할 경우 → 텍스처 타입 일관성 확보가 필수.
- Lumen 환경에서 AO 사용 시 → 암부가 과도하게 강조될 수 있음.

언리얼 엔진은 점점 개선되고 있지만,  
업데이트 되면서 바뀌는 설정과 파이프라인의 “전제 조건”이 어긋나면 예외가 발생합니다.

---
**참고자료**
- [Virtual Texturing in Unreal Engine | Unreal Engine 5.7 Documentation | Epic Developer Community](https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-texturing-in-unreal-engine)
- [Some meshes shadows are pitch black](https://www.reddit.com/r/unrealengine/comments/sethiw/some_meshes_shadows_are_pitch_black/?rdt=65282)
