---
title: Sparse Volume Textures
publish date: 2023-11-13
tags:
  - Unreal
  - VDB
  - VFX
---
2023-11-13


## 예제

> **VDB 파일 임포트**
> 리소스를 Sequnce 형식으로 임포트할 수 있도록 박스를 체크한다.

<br>

> 엔진 - C++ 클래스 폴더에서 **Sparse Volume Texture Viewer** 생성

<br>

>**Creating VDB Material**
>
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/45a1b2e4-095e-4842-a486-bb5aa5ee5b94/image.png)
>Material Domain - Volume
>Material Blend mode - Addtive^[반투명끼리 겹쳐진 부분에 밝기가 추가된다 (후경에 색을 더함)]

<br>

>**Add VDB to Material**
>
>![[SparesVolumeMaterial.png]]
> >[!info] BlackBody? 
> >켈빈 온도에 대한 사용자 입력을 받아 기본 색상을 구동하는데 사용할 수 있는 색상과 강도를 반환함.

<br>

> **Create Material Instance**

<br>

>**Heterogeneous Volume Actor** 생성

<br>

>**콘솔 명령어 입력**
> ```
> r.HeterogeneousVolumes.IndirectLighting 1
> ``` 

<br>

> **Animated VDB**
>>시퀀서에서 VDB 애니메이션 세팅하는 방법
>>
>>![[VDB_Animate_Sequencer.png]]


---

## Trouble Shooting

> [!warning] Translucency Issue
> Material Blend Mode가 [[Translucency]]인  투명 재질의 오브젝트와 VDB가 겹쳐질 때 VDB가 렌더링되지 않는 문제를 발견 
> > [!check]
> >Material- Translucency Pass: Before DOF로 설정

>[!check] Artfect 개선
>```
>r.HeterogeneousVolumes.OrthoGrid.ShadingRate 1
>```
>```
> r.HeterogeneousVolume.FrustumGrid.ShadingRate 1
>```
>
>음영처리 속도를 올리고 나서 VDB Quality를 향상시키려면 더 많은 메모리가 필요함.
>```
>r.HeterogeneousVolumes.OrthoGrid.MaxBottomLevelMemotyInMegabytes 512 
>```
>```
> r.HeterogeneousVolumes.FrustumGrid.MaxBottomLevelMemotyInMegabytes 512 
>```

>[!info] PathTracing VDB 활성화
>```
>r.PathTracing.HeterogeneousVolumes 1
>```

> [!info] VDB 간접광 적용
>```
>r.HeterogeneousVolumes.IndirectLighting 1
>```

> [!info] 볼륨 렌더 최대 거리
> 
> ```
> r.HeterogeneousVolumes.MaxTraceDistance
> ```
> 
> 볼륨은 얼마나 멀리 렌더링할건지

> [!info] 스트리밍 프리패치 밉 레벨
> 
> ```
> r.SparseVolumeTexture.Streaming.PrefetchMipLevelBias
> ```
> 
> 애니메이션 볼륨이 깜박이고 흐릿한 경우 해당 변수의 값을 수정하여 더 높거나 낮은 품질의 Load를 강제할 수 있습니다. 충분히 빠르게 로드 할 수 없으면 1프레임에서 멈출 수 있습니다. 
>  
> 기본값 0
> 값이 커질수록 `속도↑ 품질↓`
>
>**Comment**: Movie Render Queue에는 영향을 미치지 않는 것 같습니다. 

