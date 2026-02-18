---
type: note
date: 2025-03-19
tags:
  - Optimization
  - Config
  - Unreal
description: ShaderCompiler 성능 최적화
---
Unreal Engine을 사용하다 보면 프로젝트를 열거나 머티리얼을 수정할 때, 수천 개의 셰이더가 한꺼번에 컴파일되는 상황을 자주 마주하게 됩니다.

특히 다음과 같은 경우 체감 속도가 급격히 느려지죠
- 대규모 프로젝트 최초 로딩
- 새로운 플랫폼 타겟 추가
- 머티리얼 파라미터 구조 변경
- 엔진 버전 업그레이드 이후 재컴파일

이는 언리얼 기본 설정에서는 시스템 안정성과 에디터 응답성을 유지하기 위해 CPU 자원을 일부만 사용하도록 제한되어 있기 때문입니다. 즉, 모든 코어가 셰이더 컴파일에 동원되지 않는거죠.

그러나 다른 작업을 병행하지 않는 환경이라면, CPU 자원과 프로세스 우선순위를 적극적으로 조정하여 컴파일 시간을 단축할 수 있습니다.

이 튜토리얼은 Shader Compiler 성능을 개선하는 두 가지 설정 방법에 대해 다룹니다.

## Step1. ShaderCompiler 작업 개수 늘리기

CPU의 모든 Thread를 셰이더 컴파일에 집중하도록 설정하는 방법입니다.

#### 설정 방법

📂 {EngineDir}/Config/BaseEngine.ini

>NumUnusedShaderCompilingThreads 값을 `3` → `0`으로 변경 후 저장
>
>![[Find NumUnusedShaderCompilingTreads.png]]

>[!tip] 
>디버깅은 작업관리자에서 할 수 있습니다.  

---

## Step2. ShaderCompiler 우선순위 높이기

📂 작업관리자

>High 이상으로 설정 시 Windows 백그라운드 작업에 문제가 발생할 수 있어서
*>*Above Normal ~ Normal**로 유지하는 것을 권장합니다.
>
>![[Set priority.png]]
   

#### 엔진 설정으로 우선순위 변경

📂 {EngineDir}/Config/BaseEngine.ini

>WorkerProcessPriority 값을 `-1` → `1`로 변경
>
>![[Find WorkerProcessPirority.png]]

> [!warning]
> 다른 작업에 신경쓰지 않는다는 전제하에 설정해야합니다.