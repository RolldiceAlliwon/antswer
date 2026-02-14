---
title: USD Workflow
date:
tags:
  - Blender
  - Unreal
---
>[!summary] 
>USD Format으로 블렌더 에셋을 언리얼 엔진으로 [[Data Smith Workflow|Data Smith]] 하는 과정에 대해 설명합니다.

## 예제

#### USD Setting (Blender data smith to unreal!)

> **Blender Setup** 
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/2d23ac9f-7b42-46e0-a8d0-62f96827b027/image.png)

> **Unreal Setup**  
>- PlugIn - USD Importer ✅ - 프로젝트 재부팅 
>- Window - Virtual Production - USD Stage-Open File  
>- 오브젝트를 언리얼 콘텐츠 폴더로 임포트하는 세팅: Actions-Import  
>![](https://velog.velcdn.com/images/coolguykeepgoing/post/5c41d5a5-d56b-42fc-a929-b2ecce2e656a/image.png)

#### Lighting Setting

추가적으로 Exposure 값을 일치시키기 위해 각각의 툴에서 설정해야하는 세팅값  

> Blender에선 Color Management - Look - High contrast 👈  

>Unreal에선 post process> Exposure-Metering Mode- Manual 👈 

