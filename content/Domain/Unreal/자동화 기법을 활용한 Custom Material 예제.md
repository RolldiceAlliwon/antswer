---
title: 자동화 기법을 활용한 Custom Material 예제
tags:
  - Unreal
  - Material
---
>[!summary] 
> Avengers에서 나온 BlackPanther의 이펙트를 레퍼런스 삼아 언리얼 엔진에서 그와 비슷한 이펙트 제작하는 과정을 공유합니다.

> 
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/2d6e9aac-1844-4345-8f3a-0c4db1fd73ac/image.gif)
><br>
>BlackPanther가 전투 중에 적들을 일망타진(?)했던 충격파를 레퍼런스 삼아 메테리얼 자동화 기법에 대해 설명드리겠습니다.

## 예제 

>먼저 콘텐츠 브라우저에서 우클릭해서 메테리얼을 만들어줍니다.

> 언리얼에서 반투명한 재질을 만들기 위해선 몇가지 기본 세팅을 거쳐야 합니다.
>- Blend mode: Translucent(투명)
>- Shading Model: unlit  
>	- Translucent는 Opacity의 Value가 0과 가까울수록 불투명하지만 1에 가까울수록 투명해지는 특징을 가지고 있습니다.  
>	- Blend Mode중 가장 큰 퍼포먼스 비용이 발생됩니다. 비용을 최적화하기 위해서 Shading model를 Unlit으로 바꿔줍니다.
>- Two Sided 활성화  
>	- 이 기능을 활성화하면 오브젝트의 양면(보이는 바깥면과 안쪽 면) 모두 메테리얼이 적용됩니다.
>- Render After DOF 비활성화  
>	- 반투명 재질로 바꾸면 기본적으로 활성화 되는 옵션입니다.
>	- 피사계 심도를 처리한 다음에 반투명이 들어간 모델링을 렌더링 하는 기능입니다.
>	- 카메라 거리에 상관없이 반투명 재질은 흐려진 다음에 모델링을 다시 그리기 때문에 카메라와 반투명 오브젝트의 거리가 멀더라도 흐려지지 않고 어색하게 붕 뜨는 이슈를 해결할 수 있습니다.


> 세팅한 메테리얼 그래프로 돌아와 로직을 연결해줍니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/f7cb3a47-9c14-42c6-85a5-b003a8fdf482/image.png)

> ☑ 인스턴스화를 고려하여 매개변수의 정의를 잘 기록해 두셔야 합니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/e4af6ec9-c80b-4d24-8ecd-0c1a74b43077/image.png)

## 예제 분석

#### Energy Field

![](https://velog.velcdn.com/images/coolguykeepgoing/post/079e6ca7-5c56-4f27-8f57-0ffe88676b36/image.png)  

자기장을 감싸는 에너지 흐름의 불규칙함을 표현하는 부분입니다. 
Distord 변수를 조절해 원본 텍스쳐의 형태를 얼마나 왜곡하여 표현할 것인지 조정할 수 있습니다.

#### Texture Repetition 제거를 위한 반자동화 기법

![](https://velog.velcdn.com/images/coolguykeepgoing/post/0b687825-22f8-4f6b-9d74-2a9ac4e0ce0a/image.png)  
이 부분은 텍스처의 반복되는 패턴이 눈에 띄지않게 반자동화 기법을 사용한 부분입니다.

어떻게 작동하는지 단순하게 살펴보면 다음과 같습니다.  
![](https://velog.velcdn.com/images/coolguykeepgoing/post/9065690c-e0e3-4a5e-a9ea-1649b58a5114/image.png)

특징을 짚어보자면
- ✅ 이 작업을 제대로 하려면 Seamless Texture^[여러 번 타일링해도 그 경계면이 눈에 띄지 않고 자연스러운 Texture]를 사용해야합니다.
- ✅ 형상이 비슷한 텍스쳐를 사용해야 합니다
- ✅ 다양한 Noise Texture를 활용해야합니다. 
    - 같은 형상을 가진 Noise 텍스쳐를 자주 사용한다면 눈이 패턴을 인식하는 결과를 낳기 때문에 지양해야합니다.