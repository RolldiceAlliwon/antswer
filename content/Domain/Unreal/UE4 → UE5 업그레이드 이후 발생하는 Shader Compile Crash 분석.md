---
date: 2023-04-13
tags:
  - CrashError
  - Unreal
  - Shader
description: FVertexFactoryInterpolantsVSToDS
---
Unreal Engine 4 프로젝트를 Unreal Engine 5로 업그레이드하는 과정에서,
다음과 같은 Shader Compile 오류가 발생하는 경우가 있습니다.

> [!error]
>[SM5] /Engine/Private/HitProxyVertexShader.usf(37,3-34):  error X3000: unrecognized identifier 'FVertexFactoryInterpolantsVSToDS'

이번 내용은 해당 오류의 발생 배경과 해결방법을 정리했습니다.

## 오류 메시지의 의미

언리얼 엔진(Unreal Engine)에서 셰이더 컴파일 중 `unrecognized identifier 'FVertexFactoryInterpolantsVSToDS'` 오류는 주로 **테셀레이션(Tessellation)** 또는 **디스플레이스먼트(Displacement)** 머티리얼을 사용할 때 발생하는 고질적인 셰이더 에러로 밝혀져 있습니다.

---

## 구조적 원인 분석

이 오류는 **UE4의 ‘테셀레이션 기반 디스플레이스먼트’가 UE5의 렌더링 구조와 어긋나면서 충돌하는 호환성 문제**이며, 특히 업그레이드 프로젝트에서 더 자주 보입니다.

UE4에서는 머티리얼 안에 **World Displacement**나 **Tessellation Multiplier** 슬롯이 존재했습니다.  
이를 통해 Height Map을 기반으로 메시의 실루엣을 실제로 변형시키는 테셀레이션 기반 디스플레이스먼트를 구현할 수 있었습니다.

하지만 UE5에서는 렌더링의 중심이 **Nanite 기반 고밀도 메시 처리 방식**으로 이동했습니다.

이 과정에서 UE4 시절의 테셀레이션 셰이더 단계(Domain Shader 등)는 기본 파이프라인에서 밀려났습니다.

그런데 UE4 프로젝트를 그대로 UE5로 업그레이드하면, 머티리얼 그래프 안에 남아 있는 **월드 디스플레이스먼트 로직**,  
혹은 과거 셰이더 캐시 정보가 여전히 “테셀레이션 경로를 사용해야 한다”고 판단하게 만드는 경우가 있습니다.

엔진은 내부적으로 그 경로를 따라 셰이더를 컴파일하려고 시도하지만,UE5 환경에서는 그 단계에 필요한 데이터 구조(예: `FVertexFactoryInterpolantsVSToDS`)가 더 이상 유효하지 않습니다.

그 결과, **“식별자를 찾을 수 없다”는 셰이더 컴파일 에러로 크래시가 발생하게 됩니다.**

---

## 해결방법

#### 머티리얼 설정 수정

오류가 발생하는 머티리얼(Material)**을 열어 **테셀레이션 머티리얼의 설정을 비활성화하거나 해제하는 것이 가장 빠른 해결책입니다.**
- Wolrd Displacement 노드 제거.
- 디테일 패널 - 테셀레이션 모드가 `Flat Tessellation` 또는 `PN Triangles`로 설정되어 있다면, 이를 **None**으로 변경하거나, 사용하지 않는다면 끄기.

#### Dervied Data Cache 초기화

셰이더 캐시가 꼬여서 발생할 수 있으므로, 
프로젝트 폴더 내의 `Intermediate/DerivedDataCache` 폴더를 삭제하고 에디터를 재시작하여 셰이더를 다시 컴파일합니다.


## 결론

이 오류는 단순 Shader 구조 오류가 아니라, **UE4 → UE5 렌더링 아키텍처 변화로 인해 생긴 결과**입니다.

그래서 UE5에서는 Tessellation 기반 디스플레이스먼트를 유지하려 하기보다, **Nanite 중심으로 전환하는 것이 장기적으로 안정적입니다.**
