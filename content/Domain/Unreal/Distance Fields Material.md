---
title: Distance Fields Material
tags:
  - Material
  - Unreal
date: 2022-09-16
---


Distance Fields를 활용해 사용자에게 인터렉티브한 효과를 주는 메테리얼을 만드는 방법에 대해 알아보겠습니다.

## 프로젝트 세팅

- 프로젝트 세팅 - `Mesh Distance field create` ✅ 

>[!tip] 특정 상황에서 효율을 높일 수 있는 관련된 옵션을 덧붙이자면
>- `8bit mesh distance field`는 16비트를 8비트로 변환해 메모리 소비량을 대폭 감소시켜줍니다. 
>	- ⚠ 하지만 크거나 얇은 메쉬에는 Artifact가 발생할 수 있으니 유의해 주세요.
>- `Compress mesh distance field`는 마찬가지로 메모리를 절약하지만 Bit Qulity가 소실되지 않습니다. 하지만 Level Streaming을 사용하면 로딩 시 부하가 발생할 수 있습니다. 왜냐면 레벨을 열 때 압축을 풀어야 하기 때문입니다.

## Distance field Near Surface

`Distance field Near Surface` 함수를 활용해 잔물결이나 슬라임을 만들어 낼 수 있습니다.

#### 파동 효과

>[!check] **파동 메테리얼**- 피사체가 겹쳤을 때 파동이 일어나는 효과입니다.  
>
>결과물
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/ad4999f9-23e0-4b27-84ae-8289bf23df8c/image.gif)  
 >
 >메테리얼 구성![](https://velog.velcdn.com/images/coolguykeepgoing/post/0f8ed52c-4e8c-43ed-a95f-d8f85074818c/image.png)

#### 슬라임 효과

> [!check] **슬라임 메테리얼** - 피사체와 접촉할 때 부피가 늘어나는 효과입니다.  
>
>*결과물*
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/6ae2c4a5-3f14-48ae-b78c-778bbd4f10a8/image.gif)  
>
> *메테리얼 구성*
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/9a9f3201-41b4-4b80-a401-238110f01075/image.png)
    
#### Distance Field Gradient

`Distance Field Gradient` 함수는 디스턴스 필드가 방사되는 방향을 결정하는 데 사용할 수 있습니다. 또한 WS 방향을 Local Space로 변환하여 **물 속에서의 파동 효과**를 만들 수도 있습니다.
