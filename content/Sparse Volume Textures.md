---
title: Sparse Volume Textures
tags:
  - Unreal
  - VDB
  - VFX
---
2024-01-07

## 예제

>VDB 파일 임포트

> 엔진 폴더에서 Sparse Volume Texture Viewer 생성

> VDB Material 구성
> - Material Domain - Volume
> - Material Blend mode - Addtive^[반투명끼리 겹쳐진 부분에 밝기가 추가된다 (뒷배경에 색을 더함)]  
> ---
>SVT Material Preview  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/45a1b2e4-095e-4842-a486-bb5aa5ee5b94/image.png)

> Add VDB to Material
>- BlackBody: 켈빈 온도에 대한 사용자 입력을 받아 기본 색상을 구동하는데 사용할 수 있는 색상과 강도를 반환함 

> Create Material Instance

>Heterogeneous Volume Actor

>Animated VDB


>[!tip] Cvar  
>```
>r.HeterogeneousVolumes.MaxTraceDistance` 
>```
>볼륨을 얼마나 멀리 렌더링할건지