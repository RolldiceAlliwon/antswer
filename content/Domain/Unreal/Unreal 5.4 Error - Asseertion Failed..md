---
publish date: 2024-06-03
tags:
  - CrashError
  - Unreal
---
🤬문제 발견: **Unreal 5.4**에서 레벨을 불러올 때 Crash Error가 반복적으로 나타남.

## Crash Error

```
Assertion failed: (Index >= 0) & (Index < ArrayNum) [File:D:\build++UE5\Sync\Engine\Source\Runtime\Core\Public\Containers\Array.h] [Line: 771] Array index out of bounds: 7969 from an array of size 7221

UnrealEditor_MeshDescription  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_MeshBuilder  
UnrealEditor_MeshBuilder  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_Engine  
UnrealEditor_Core  
UnrealEditor_Engine  
UnrealEditor  
UnrealEditor  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
UnrealEditor_Core  
kernel32  
ntdll
```

---

구글링을 통해 이번 문제가 Intel CPU에서만 나타나는 걸 알게 됐어요.

---

## Solution

> [인텔® Extreme Tuning Utility (인텔® XTU)](https://www.intel.co.kr/content/www/kr/ko/download/17881/intel-extreme-tuning-utility-intel-xtu.html) 설치

>Extreme tuning utility 실행 - Performance Core Ration 53x ✅
> 
> ![[CG_IntelExtremeTuningUtility.png]]

> [!warning] ♨️ 컴퓨터를 재부팅할 때마다 설정이 초기화되어, 매번 53x로 다시 맞춰야 합니다.

---

언리얼 5.4는 여러모로 불안정한 버전이네요.

> [!tip] 
> 5.4버전은 해외에서도 느리다고 많이들 불평합니다. 알고보니 여러가지 Plug-In이 켜져있어요.
> Telemetry Plug-In OFF 하면 더 개선 됩니다.