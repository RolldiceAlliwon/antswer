---
title: 한가지 Material로 Variation 만드는 방법
tags:
  - Unreal
  - Blueprint
date: 2022-09-16
---

한가지 Object에 다양한 베리에이션이 필요할 때 인스턴스를 생성하지 않고 [[Drawcall]]을 절약하는 방법에 대해 알아보겠습니다.

블루프린트를 사용하면 한가지 Material로도 다양한 베리에이션을 만들 수 있습니다. 
또한 아티스트가 레벨디자인할 때 디테일패널에서 직관적으로 수정할 수 있는 기능도 같이 추가할 수 있습니다.

## 예제

> Blueprint Actor Class를 생성하고 오브젝트를 불러옵니다.

>Construction Script^[런타임 실행 전에 '편집단계에서 어떤 작업을 처리할 것인가?' 대한 그래프창입니다.
] 에서 로직을 구성합니다.
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/6e11a529-9f62-4be9-973a-2ca5cdbf4015/image.png)

#### Switch on int/ String의 문제점

- ⚠ `Switch to int`를 사용한다면 힌트를 포함할 수 없이 정수로만 기록되서 협업간에 무슨 용도인지 알 수 있는 직관성이 떨어지는 한계를 가지고 있다.
- ⚠ `Switch to string`을 사용한다면 가령 자료형 변수가 오타가 나도 Compile 오류가 나지 않고, Defalut로 처리돼서 Debuging만으로 Bug를 인식할 수 없어 문제를 찾고 고치는데 상당한 시간이 걸릴 수 있는 단점이 있습니다.
- ✅ 이 둘을 보완할 수 있는 방법은 `Enum(열거형)` 으로 만드는 것 입니다.

#### Option1. 열거형으로 문제해결

>**Enum (열거형)** 은 자료형 데이터를 담아둔 일종의 컨테이너 박스입니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/e375a6ec-a6c3-453f-a619-ca2208c8f0c7/image.png)

>만들어둔 Enum (열거형)을 그래프에서 변수로 불러옵니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/d9858111-0afa-4e05-8c6b-7b4966660853/image.png)

> Enum(열거형) 은 특히 분기점에서 이점이 부각됩니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/586bd296-fe17-4306-8bf6-6f77f3e8fb6e/image.png)
> ✅ TopDown방식으로 정보가 포함된 분기점을 선택하면 되니 직관적이고, 오타 같은 실수를 범할 변수도 없어집니다.

#### Option2: Select방식
- 예제와 같이 하나의 함수를 가지고 Data Table을 만들고 싶다면 분기점보단 데이터 `Select` 방식을 사용하길 권장합니다.
- ⚠ 하나의 함수 `Set Vector Parameter Value on Materials` 를 가지고 분기점을 나누는게 비효율적일 수 있는 이유는 분기점이 많이 사용될수록 로직이 복잡해 보일 수 있어 혼란을 야기합니다.

>Enum (열거형)변수를 `Select` 함수 Index 입력핀에 연결하면, 전보다 깔끔한 로직을 만들 수 있습니다.  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/15dcb768-83b5-40ae-9e10-36d0cfa70ad7/image.png)