---
title: Car Paint Refelection Dev
tags:
  - Material
  - Unreal
  - Automotive
date: 2023-11-19
---
2023-11-19
## Project Setting

- Project setting - Rendering - Clear coat enable second normal ✅ 
- Project setting - Rendering - Reflection Capture Resolution 1024 or 2048 ✅   
- Project setting - Rendering - Extend default luminance range in auto exposure settings ✅ 
- Project setting - Rendering - Apply Pre-exposure before writing to the scene color ✅ 

## Car Paint Reflection 비교

Low Precision Normal로 인해 차량에 반사되는 물체가 물결치고 더군다나 Artifect가 생겼을 때 
해결하는 방법에 대해 알아봅시다.

> 프로젝트 세팅- 렌더링- G-buffer formet- high precision normal 👈
    
> 스태틱 메쉬 - Bulid setting - Use high precision Tangent basis ✅ 
> (Data smith로 오브젝트를 가져올 경우 기본으로 켜져 있음)

>```
> r. reflections.Denoiser 0
>```
> Denoiser는 반사를 부드럽게 해줌.

여기까지 설정하면 좋은 품질의 Ray-Tracing 반사를 구현할 수 있다.
    
>**G-buffer Default**  
>![G-buffer Default](https://velog.velcdn.com/images/coolguykeepgoing/post/fc27886c-defd-4f0e-9b1b-fd2e63330186/image.png)
    

> **G-buffer high precision normal**  
> ![](https://velog.velcdn.com/images/coolguykeepgoing/post/db4b3140-6ca9-4260-8cfe-25698cd9b9a6/image.png)

> [!help] G-buffer
> G-buffer^[Multi render targers에 픽셀 라이팅을 계산할 수 있는 요소들(Depth, Normals, Color 등등)의 렌더링 패스들을 독립된 텍스처 형태로 저장한다. 왜냐하면 Artifacts을 압축하기 위해서이다.] = Multiple Render Targers

