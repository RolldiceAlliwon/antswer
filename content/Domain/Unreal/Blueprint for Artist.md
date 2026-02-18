---
date: 2022-07-03
tags:
  - Blueprint
  - Unreal
---
## Array 기능 구현

![[BP_MeshCloner.png]]

>[!info] 
>Mesh 사이의 간격을 입력해서 균일하게 에셋을 배치할 수 있습니다.

## Random Array 기능 구현

 ![[BP_meshcloner_random.png]]

> [!info] RandomRange 절대값 활용 
> -20과 20은 절대값이 같습니다. 
> 그래서 **RandomRange**변수 하나만 선언해서 효율적으로 사용할 수 있습니다.
>>**예시:** -20 ~ 20 범위가 필요한 경우
>>- **RandomRange** 변수에 20을 입력
>>- Min 입력: RandomRange × -1 → -20
>>- Max 입력: RandomRange → 20

> [!info] Stream을 통한 Random 값 고정
> Stream이라는 개념을 활용하면 Construction Script가 재실행될 때마다 Random 함수가 매번 새로운 값을 생성하지 않고  **고정된 값으로 Random**을 출력할 수 있게 합니다.

> [!info] Seed 기반 오차 범위 노드 복제 
> 그렇게 Seed를 바탕으로 오차 범위를 설정하는 노드 집합을 복제하여 각각 Location, Rotation, Scale 에 필요한 분류의 개수만큼 나누어 연결해줍니다.

> [!info] Seed 분리 
> 시드의 분리도 가능합니다. 시드도 물론 둘 이상 변수로 선언하여 별도의 Stream으로 나눈다면 원하는 변수들을 시드에 맞게 나누어 조절할 수 있습니다.