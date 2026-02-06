---
title: Data Smith Workflow
tags:
  - Unreal
  - Workflow
---
2024-01-14

> [!summary] Data Smith 
> DCC툴에서 만든 데이터를 다이렉트로 언리얼 엔진으로 임포트 해주는 플러그인입니다.

## Data Smith Ribbon 3Dmax

![](https://velog.velcdn.com/images/coolguykeepgoing/post/a2fb50ad-90c1-4b8f-b470-95041534ad6f/image.png)  

- ⚠ Sync Dcc with UE Editor / UE Runtime App / Twinmotion  
- ⚠ Export를 통해서만 애니메이션을 추출할 수 있다.

## Importing To UE5 Using Direct Link

**Workflow goes as follow** 

>1. Create project  

>2. 액터 추가 탭- Data smith- direct Link import  

>3. Select Source

>4. Import Forder & options

#### Direct Link Connection Status

![](https://velog.velcdn.com/images/coolguykeepgoing/post/34d68323-e352-4143-a04b-c57989636a98/image.png)

1. Asset이 동기화되고 소스 변경 시 자동으로 다시 가져오기 (Re-import 활성화됨)
2. Asset이 Direct link source와 함께 최신 상태가 아닙니다.
3. Direct link source로 가져온 Asset이 최신 상태임 (Re-import 비활성화됨)
4. Direct link source를 사용할 수 없습니다.

## 다이렉트 링크 소스를 언리얼에서 복원

![](https://velog.velcdn.com/images/coolguykeepgoing/post/51e54f2f-da63-4ae1-a468-c9bfb4a8b7a8/image.png)

> 1. DCC를 닫습니다. 연결이 끊어졌습니다.
> 2. DCC를 엽니다. 자동으로 다시 연결하려면 Direct link에 대해 동일한 장면/파일이어야 합니다.
> 3. Data smith asset status 상태 아이콘이 동기화 준비 완료로 변경됩니다.
> 4. UE 프로젝트를 닫거나 다시 열 때, Auto re-import가 비활성화됩니다.
> 5. DCC에서 sync/auto sync하여 업데이트함.

## Tip and Tricks

#### 1. Datasmith Scenes 을 인스턴스로 사용
- Data smith Scene 인스턴스화 가능
- DCC의 모든 변경 사항은 각 Data smith instance에 전파됩니다.
- Override는 수동으로 재설정할 때까지 유지됩니다.

#### 2. Optimizing scenes for direct link
- 재료 복잡성 제한
- PBR 워크플로우 Spec/Gloss
- 메쉬 xform 재설정
- Scene 계층 구조를 깔끔하게 유지
- VRAM이 부족하지 않도록 Power Of Two가 아닌 매우 높은 밀도(4k+) 텍스처 사용을 제한합니다.