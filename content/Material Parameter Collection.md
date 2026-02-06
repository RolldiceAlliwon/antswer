---
title: Material Parameter Collection
tags:
  - Unreal
  - Material
  - Blueprint
---
2022-09-18

## 특징

- ⚠ Material Parameter Collection 방식으로 쓰이는 매개변수는 부모 Material의 값을 변경하기 때문에 블루프린트에서 매개변수 값을 바꿨을 때 자식 Material Instance에도 공통적으로 영향을 끼치는 단점이 있으니 주의해야합니다.
- 💰 공유하는데 필요한 비용이 비싼 편이기 때문에 활성화 유무에 대한 Switch(분기점)를 만들어줘야 합니다.

---

## 예제

먼저 간략한 설명을 위해 `Material Parameter Collection = MPC`로 명명하겠습니다.

#### 메테리얼 구성

메테리얼 그래프에서 MPC를 추가하고 블루프린트에서 MPC를 불러와보겠습니다.

> 콘텐츠 브라우저안에서 우클릭을 해서 '메테리얼 > 메테리얼 파라미터 컬렉션'을 생성합니다
    
> MPC을 더블클릭합니다. 용도에 맞는 타입의 (Scalar나 Vector) 매개변수를 추가하고 이름을 정의 해주세요.

> 메테리얼에서 'Collection Parameter' 노드를 추가하고 사용할 MPC와 매개변수를 선택합니다. 여기까지가 메테리얼에서 맞춰야할 세팅입니다.

---
#### 블루프린트 구성

> 이번엔 블루프린트로 들어갑니다. 'Construction Script' 그래프에서 'Set Scalar Parameter Vaule on Parameter' 노드를 추가합니다. 
> 입력핀을 살펴보면 'Collection'이란 대목에서 사용할 MPC를 지정합니다. 
> 이렇게 하면 메테리얼 매개변수를 블루프린트에서 사용할 수 있습니다. 이 방법을 통해
> 여러가지 시나리오를 구성하고 자동화하는데 큰 도움을 줄 수 있습니다.
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/eb066e1d-fa70-474c-aa6f-eed97add42a2/image.png)

>💥 Construction Script에서 MPC을 Setup했을 때 런타임이 실행될 때 기본 값으로 초기화되는 이슈가 발생합니다.  
>🚒 **로직을 복사해 이벤트 그래프에 붙여넣고 'Begin play' 이벤트에 연결해줍니다.**
>이러면 변수가 초기화되는 것을 런타임이 실행될 때 Override하여 막을 수 있습니다.

---

## 블루프린트에서 사용할 수 있는 메테리얼 함수

> [!tip] 블루프린트에서 사용할 수 있는 메테리얼 함수
>1. **Set Scalar^[방향의 구분 없이 하나의 수치만으로 표현되는 단위, 축을 가르키지 않고 크기만 가지고 있다.] Parameter Vaule on Parameter**
>	- 이미 적용된 Material의 매개변수를 변경하는 가장 간단하면서도 가장 빠른노드이다.
>	- Dynamic Material Instance가 아니어도 사용 가능
> 2. **Create Dynamic Material Instance**
> 	- 해당 노드에 지정한 Material을 바탕으로 Instance를 새로 생성하고, 
> 	  기존 Material에 덮어씌운 후(override) 매개변수를 제어할 수 있음.
> 	- 매개변수를 변경하려면 `Set Scalar Parameter Vaule on Parameter` 노드에 `Return Value`를 연결해야함.