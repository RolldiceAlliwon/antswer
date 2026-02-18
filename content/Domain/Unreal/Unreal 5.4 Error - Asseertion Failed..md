---
date: 2024-06-03
tags:
  - CrashError
  - Unreal
---
## 문제 발견

Unreal Engine 5.4에서 작업을 진행하던 중, 에디터를 재부팅한 뒤 작업하던 레벨을 다시 불러오는 과정에서 반복적으로 Crash가 발생했습니다. 🤬

프로젝트 자체는 정상적으로 열렸지만, 지뢰처럼 레벨을 로드하는 순간 에디터가 종료되었고 동일한 문제가 지속적으로 나타났습니다. 💣

단순한 일회성 오류가 아닌 반복적인 Crash였기 때문에, 엔진 버그인지 프로젝트 손상인지, 혹은 다른 환경적 요인인지에 대한 분석이 필요했습니다.

---

## Crash Error 로그 분석

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

## 원인: Intel CPU 불안정 이슈

구글링 및 해외 포럼 확인 결과, Unreal Engine 5.4에서 특정 14세대 Intel CPU에서 유사한 Crash가 논의되고 있었습니다.

특히 다음 조건에서 발생 빈도가 높았죠
- 기본값으로 과도하게 높은 P-Core 클럭
- 전력 제한 해제 상태
- 자동 오버클럭 활성화 환경

Unreal은 메시 빌드, 셰이더 컴파일 등에서 CPU에 높은 부하를 주는데, 이 과정에서 CPU가 불안정하면 메모리 접근 오류가 발생하고, 그 결과 Array 범위를 벗어나는 것처럼 보이는 Assertion Crash가 발생할 수 있다는 것으로 추정됩니다.

---

## 해결 방법: XTU 설치 

🧷 [인텔® Extreme Tuning Utility (인텔® XTU)](https://www.intel.co.kr/content/www/kr/ko/download/17881/intel-extreme-tuning-utility-intel-xtu.html) 설치

기본값보다 약간 낮춰 안정성을 확보했습니다. 이 설정 이후 동일 레벨에서 Crash가 터지지 않더군요.

>**설정 변경**
>
>Extreme Tuning Utility 실행 - Performance Core Ration 53x ✅
> 
> ![[CG_IntelExtremeTuningUtility.png]]

> [!warning] ♨️ 컴퓨터를 재부팅할 때마다 설정이 초기화되어, 매번 53x로 다시 맞춰야 합니다.

---

> [!tip] 추가 개선: UE 5.4 플러그인 최적화
> 5.4버전은 해외에서도 느리다고 많이들 불평합니다. 알고보니 여러가지 Plug-In이 켜져있어요.
> Telemetry Plug-In OFF 하면 더 개선 됩니다.

---
**참고자료**
- [Constantly getting crash errors like "Assertion failed: DDC key constructed from deserialized shadermap does not match request key!"](https://forums.unrealengine.com/t/constantly-getting-crash-errors-like-assertion-failed-ddc-key-constructed-from-deserialized-shadermap-does-not-match-request-key/1747073/7)
