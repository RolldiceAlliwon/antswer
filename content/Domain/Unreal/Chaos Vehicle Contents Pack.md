---
title: Chaos Vehicle Contents Pack
tags:
  - Unreal
  - plugin
date: 2023-11-26
---
2023-11-26

>[!summary]
Vehicle Contents Pack를 활용해 게임에 바로 사용할 수 있는 Custom 차량을 만드는 과정을 공유합니다.

## Project Setting

- 프로젝트 세팅 - 엔진 - 피직스 - Tick physics async ✅ 

## 예제

> 시작 템플릿에서 '비히클' 콘텐츠 팩을 선택해서 프로젝트에 추가합니다.
    
> 콘텐츠 브라우저에서 '비히클 - SportCar - SKM_SportsCar'를 찾아 우클릭하여 에셋 액션- FBX로 익스포트합니다.
    
> Maya로 FBX 파일을 임포트합니다.
    
> 바퀴에 부착할 스켈레톤(FL, FR, BL, BR)은 제외하고 메시와 스켈레톤을 삭제합니다.
    
> 가지고 있는 자동차 FBX파일을 임포트합니다. 앞머리 방향은 SKM_SportCar와 똑같이 90도 변경해줍니다.
    
> Skining 작업을 진행합니다.
>
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/5a6833ab-f1d6-4e5f-a34b-82a6165210df/image.png)  
>- 바퀴 정중앙에 네바퀴 모두 조인트를 위치시켜줍니다.  
>	(1) Mesh pivot rotate를 활성화하면 쉽게 조인트를 정위치할 수 있습니다  
>	(2) 스키닝

> 스키닝 작업을 다 했다면 모델링탭 - Edit - Delete by type - non-deformer history기능으로 히스토리를 지워줍니다.
 
> FBX로 익스포트 해줍니다.
 
> 언리얼로 임포트합니다. 피직스에서 바디를 재성성해줍니다.
>
>**Body** 
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/7fcf6341-4157-4dbd-9349-d0357a805492/image.png) 
> 
> **Wheels**  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/dd9328a3-75d4-40cf-b03f-806273268e03/image.png)

> 콘텐츠 브라우저에서 VehicleTemplate - SportCar - SportsCar_Pawn를 우클릭해서 '자손 블루프린트 생성'을 선택합니다. 그리고 스켈레탈 메시를 바꿔줍니다.