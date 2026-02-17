---
title: Sparse Volume Textures
date: 2023-11-13
tags:
  - Unreal
  - VDB
  - VFX
draft: false
---

> [!summary]
>VDB는 연기, 구름, 불꽃과 같은 볼륨메트릭 데이터를 효율적으로 저장하고 렌더링하는 파일 포맷입니다. 
>
>UE5에선 Sparse Volume Texture(SVT) 시스템을 통해 OpenVDB 파일을 임포트할 수 있으며,  
>5.3 버전 이후 Heterogeneous Volume Actor를 통해 안정적인 실시간 렌더링이 가능해졌습니다.
>
>이 기능을 활용하면 Houdini나 EmberGen 같은 외부 툴에서 제작한 고품질 볼륨 이펙트를 게임이나 시네마틱 영상에 그대로 사용할 수 있습니다.


## 기본 설정 및 워크플로우

#### 1단계. VDB 파일 임포트

- VDB 파일을 언리얼 엔진 콘텐츠 브라우저로 드래그 앤 드롭합니다.
- 임포트 옵션에서 'Import as Sequence'를 체크하면 애니메이션된 VDB 시퀀스를 불러올 수 있습니다.
- 시퀀스 형식으로 임포트하면 여러 프레임으로 구성된 볼륨 애니메이션을 재생할 수 있습니다

<br>
#### 2단계. Sparse Volume Texture Viewer 생성

- VDB를 임포트하면 Sparse Volume Texture 에셋이 생성되며, 이를 더블클릭하여 내부 데이터를 확인할 수 있습니다.
- 이 뷰어를 통해 임포트한 VDB 데이터를 미리보기하고 확인할 수 있습니다.

<br>

#### 3단계. VDB용 머티리얼 생성

VDB를 렌더링하기 위해서는 특별한 설정이 필요한 머티리얼을 생성해야 합니다:

- 새 머티리얼을 생성하고 Details 패널에서 다음과 같이 설정합니다.
    - **Material Domain**: Volume (볼륨 데이터 렌더링을 위한 설정)
    - **Blend Mode**는 효과 유형에 따라 Additive 또는 AlphaComposite로 선택합니다.
        - 불꽃/에너지 계열 - Additive
        - 연기나 구름 계열 - AlphaComposite

![SVT_Material.png](app://8aa7b0a2f59527e624dc67ddfc8ba17724e3/C:/Users/user/Documents/CG/Migration/Inbox/Image/SVT_Material.png?1719747627011)

<br>

#### 4단계. VDB 데이터를 머티리얼에 연결

임포트한 Sparse Volume Texture 에셋을 머티리얼 그래프로 가져옵니다

%%
- BlackBody 노드를 사용하면 온도 기반의 색상 표현이 가능합니다.
    - BlackBody는 켈빈 온도 값을 입력받아 물리적으로 정확한 색상과 강도를 반환합니다
    - 불이나 용암 같은 고온 이펙트에 특히 유용합니다.

> [!warning]
> BlackBody 노드는 VDB에 Temperature 필드가 포함되어 있을 때만 정상적으로 작동합니다. Temperature 데이터가 없는 경우 Emissive를 직접 구성해야 합니다.
%%
<br>

#### 5단계. 머티리얼 인스턴스 생성

- 생성한 VDB 머티리얼을 우클릭하고 'Create Material Instance'를 선택합니다
- 머티리얼 인스턴스를 사용하면 원본 머티리얼을 수정하지 않고도 파라미터를 실시간으로 조정할 수 있습니다.

<br>

#### 6단계. Heterogeneous Volume Actor 배치

- 레벨에 'Heterogeneous Volume' 액터를 배치합니다.
- Details 패널에서 생성한 머티리얼 인스턴스를 할당합니다.
- 이 액터가 실제로 VDB 데이터를 월드에서 Ray Marching 기반 볼륨 렌더링을 수행하는 역할을 합니다.

> [!tip]
> 출력 콘솔(~)에 다음 명령어를 입력하여 VDB에 간접광을 적용합니다
> ```
> r.HeterogeneousVolumes.IndirectLighting 1
> ``` 
>
> 이 설정을 활성화하면 주변 환경의 조명이 볼륨에 반영되어 더욱 사실적인 결과를 얻을 수 있습니다.

<br>

## 애니메이션 VDB 설정

시퀀서(Sequencer)를 사용하면 프레임별로 VDB 애니메이션을 제어할 수 있습니다.

- 시퀀서를 열고 Heterogeneous Volume 액터를 트랙에 추가하고 다음 순서에 따라 설정합니다.

![Pasted image 20250408181408.png](app://8aa7b0a2f59527e624dc67ddfc8ba17724e3/C:/Users/user/Documents/CG/Migration/Inbox/Image/Pasted%20image%2020250408181408.png?1744103648588)

프레임 레이트와 타이밍을 조정하여 원하는 속도로 애니메이션을 재생할 수 있습니다.

---

## Trouble Shooting


> [!error] Translucency Issue
> Volume과 Translucent 오브젝트가 겹칠 경우 VDB가 렌더링되지 않는 문제를 발견 
> > [!check]
> >Material- Translucency Pass: Before DOF로 설정

>[!Error] Artfect 개선
>```
>r.HeterogeneousVolumes.OrthoGrid.ShadingRate 1
>```
>```
> r.HeterogeneousVolume.FrustumGrid.ShadingRate 1
>```
>
>ShadingRate 값이 낮을수록 더 촘촘한 샘플링이 이루어져 품질이 향상되지만 성능 비용이 증가합니다.
>
>```
>r.HeterogeneousVolumes.OrthoGrid.MaxBottomLevelMemoryInMegabytes 512 
>```
>```
> r.HeterogeneousVolumes.FrustumGrid.MaxBottomLevelMemoryInMegabytes 512 
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
> 볼륨을 얼마나 멀리까지 렌더링할건지

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

---

**참고자료**
- [5.3 이종 볼륨 렌더링 팁과 요령](https://forums.unrealengine.com/t/5-3-heterogeneous-volume-rendering-tips-and-tricks/1291002)
- [Epic Clouds for Unreal Engine 5.3](https://www.youtube.com/watch?v=AHK_mbTvoyc&t=615s)

