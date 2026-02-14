---
title: VR Contants - 360 Camera
tags:
  - Unreal
  - VR
  - plugin
date: 2022-09-16
---
2022-09-16

## 예제

> 에픽스토어에서 'Camera360 플러그인'을 다운 받습니다.
    
> 프로젝트에 추가하면 '콘텐츠 브라우저 >Camera360' 폴더가 추가됩니다. 
> 폴더에서 `BP_Camera point`, `BP_Camera Rec 360` 액터를 레벨에 배치합니다

> BP_Camera point 디테일 패널 - Target all transform에서 카메라를 선택하면 시퀀스에 저장된 카메라의 키프레임을 그대로 Overlap할 수 있습니다.

> **Is active**는 비활성화✖, **Auto Play**는 활성화✅
> 그리고 시뮬레이션^[단축키는 alt+p이다.]을 실행해서 360 카메라를 테스트해봅니다.
> 
> **is active**  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/70ac72c2-3073-4374-aba4-29d249bae919/image.png)
> 
> **Auto play**  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/6406ed94-f927-42d9-85f5-dbef01f7ae2e/image.png)
 
>시퀀스에서 BP_Camera rec 360 카메라를 추가합니다. 
>그리고 최종 Camera Cut에 바인딩합니다.
    
> Movie Render Queue를 통해 이미지시퀀스를 렌더링합니다.
    
> 이미지를 동영상으로 변환하기 위해 'Adobe media encoder'프로그램으로 작업을 진행합니다. 세팅값을 맞추고 최종영상으로 렌더링합니다.
> - video- render at maxium depth 활성화 ✅
> - ideo- VR video- Frame Layout 프로젝션 타입에 맞게 설정
> - Use maximum render quality 활성화 ✅

## 360 Camera 기능

#### Projection Mode

| Mode                        | 플러그인                  | 출력해상도           |
| --------------------------- | --------------------- | --------------- |
| 360_stereo(streo panoramic) | Panoramic capture 활성화 | 5760x5760       |
| Mono type                   |                       | 5760x2880(5.2k) |

- 출력해상도는 렌더링 하기 전 무비렌더큐에서 설정합니다.
    ex) Movie render queue> File Output Resoultion 5760x2880(5.2k)

#### Stereo Panotamic System
- `Capture Speed`는 2K 이상의 이미지를 캡처하는 경우 보통 50~ 70 권장합니다.