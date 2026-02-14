---
title: Camera Tracking Issue와 Trouble Shooting
tags:
  - Unreal
  - Camera
date: 2022-09-16
---

Camera Tracking 기능은 카메라가 움직여도 선택한 피사체를 중심으로 자동으로 초점이 맞춰져 카메라 움직임에도 피사체를 선명하게 유지하게 해주는 기능입니다.

## Actor To Tracking

>CineCamera 디테일 패널에서 Focus Mode를 Tracking으로 변경합니다.  

>Actor to Track 기능을 선택하고 스포이드를 사용하여 피사체를 샘플링하면 카메라가 이동해도 피사체를 중심으로 추적하여 포커싱합니다.
- ✅ 작은 피사체는 잘 작동합니다.  
- 🤯 하지만 캐릭터를 트랙킹하면 캐릭터의 발 끝을 추적하는 현상이 발생합니다.  
	- 이 현상은 **카메라가 피사체의 Pivot을 표적으로 삼아 트랙킹**하기 때문입니다.

이 문제를 해결하기 위해서 몇 가지 작업이 필요합니다.

## 예제

이번 예제를 통해 카메라가 캐릭터의 얼굴을 트랙킹하려고 합니다.

> 먼저 Head 스켈레탈 소켓에 종속할 빈 액터가 필요합니다. 
> 빈 액터를 만들어주고 `Trey_Head_Bone` 이라고 정의하겠습니다.
    
> 캐릭터의 Blueprint Class Editor로 접근하여 `Trey_Head_Bone` 액터를 `Body Component`의 자식으로 종속합니다.

> `Trey_Head_Bone` 이 종속된 Parent Sorket에서 트레킹할 부분인 Head 소켓을 선택합니다. 
> ![](https://velog.velcdn.com/images/coolguykeepgoing/post/fea1d246-ec60-40c8-9281-425ef2a2d343/image.png)
    
> 뷰포트로 돌아가 빈 액터를 만듭니다. 이름은 `focus_Trey`로 정의하겠습니다.
 
> 월드라이너에서 `Focus_Trey`액터를 `Trey_Head_bone` 밑으로 종속합니다.    

> 카메라로 돌아가 Actor to Track기능에서 `focus_trey`액터를 샘플링하면 정상적으로 작동합니다.
 
> [!tip]
> `Trey_Head_Bone` 위치를 변경할려면 캐릭터 블루프린트 클래스 에디터로 접근하여 부모 소켓에서 다른 원하는 위치의 소켓으로 수정합니다.