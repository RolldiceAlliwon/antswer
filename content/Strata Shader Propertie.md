---
title: Strata Shader Propertie
tags:
  - Unreal
  - Material
  - Shader
---
2024-03-17

>[!summary] 특징
**BSDF Shader**는 Shader와 Shader 간 레이어링이 가능해 물리적인 재질현상 표현이 가능해짐.
    
## Substrate Slab BSDF
    
> F 0: IOR 표현
    
> F 90: Specular Color, Edge Specular Color 를 표현
    
>  SSS MFP(mean free path)  
>  - PBR 쉐이더에서 Surface Color 로 추상화 했던 물리적 Propertie
    
>   - MSF? 빛의 여러 파장이 물질로 들어가기 전 매질을 통과하는 평균거리  
>       - BSDF 쉐이더에서 Opacity가 없는 이유는 **Opacity 자체가 MSF이기 때문**이다.  
>       - 완전 투명한 재질을 만들고 싶다면 해당 매질을 통과하는 라이트의 MFP가 높아야 합니다

참조 링크: [Matt Oztalay (He/Him) | Linktree](https://linktr.ee/epicmattoztalay?utm_source=qr_code)