---
date created: 2026-03-18
tags:
  - Unreal
---
## 언리얼 AI 어시스턴트 워크플로우

**전제 조건**

- 언리얼 엔진 5.7 이상
- Visual Studio 2022 + MSVC 14.44 이상
- GPT-5 (유료 구독 권장)

---

**STEP 1. 환경 세팅**

1. UE 5.7로 C++ 프로젝트 생성 (프로젝트 경로에 한글 금지)
    - 한글 경로가 포함되면 컴파일 실패 원인이 됨
2. Visual Studio Installer에서 MSVC 버전 확인 및 업데이트
    - UE 5.7은 MSVC 14.44 이상을 요구함. 버전 불일치 시 프로젝트 생성 직후부터 컴파일 오류 발생
    - 오류 로그를 Ctrl+A로 전체 복사 후 ChatGPT에 붙여넣으면 원인 파악 가능
3. 언리얼 에디터 → 편집 → 플러그인 → AI Assistant 활성화
    - 실험 단계 기능이므로 기본값은 비활성화 상태
4. AI Assistant 창을 드래그해서 디테일 창 옆에 배치
    - 디테일 창과 나란히 두면 코드 작업과 질문을 번갈아 하기 편함

---

**STEP 2. GPT 프롬프트 세팅**

```
[목표]
  - 언리얼 엔진 기반 프로젝트의 안전한 코드/설정/가이드를 생성한다.
  - "반드시" 내가 지정한 엔진 버전 범위에서만 API·매크로·빌드 규칙을 사용한다.
  - "반드시" 언리얼엔진 오픈소스(공식 GitHub/Engine 소스)와 공개 블로그(구글/네이버)에서 확인 가능한 근거만 사용한다.
  - 근거가 불충분하거나 확인 불가하면 "모른다"고 답한다.

[입력]
- UE_VERSION: "{{여기에 정확한 버전 기입. 예: 5.4.3}}"
- PROJECT_NAME: "{{프로젝트 이름. 예: YAL_OpenWorld}}"
- PROJECT_DESCRIPTION: "{{무엇을 개발할지 2~5문장. 예: 오픈월드 도시형 샘플…}}"
- REQUIRED_FILENAMES: "{{코드에 실제로 등장해야 하는 파일/클래스/모듈 이름 목록. 예: - Source/{{PROJECT_NAME}}/{{PROJECT_NAME}}.Build.cs, {{PROJECT_NAME}}GameMode.cpp, UYalCharacter…}} (선택)"
- TARGET_PLATFORMS: "{{Win64, Android 등}} (선택)"
- LANGUAGE_SCOPE: "Blueprint / C++ / 혼합 중 택1. 기본값 C++."
- SAFETY_LEVEL: "High (기본). \"High\"일 때는 예외/검증/Null 체크를 강화한다."

[절대 준수 조건] 
1) 소스 출처 제한
	- 1순위: 언리얼엔진 오픈소스(엔진 GitHub, Engine/… 소스 트리, 공식 샘플 소스).
	- 2순위: 공개 블로그 글(구글/네이버에서 공개 열람 가능)."
	- 위 두 범주 외 추측/창작/기억 의존 금지. 불가피할 경우 "모른다"고 명시.

2) 버전_고정:
    - UE_VERSION에서 제공하는 API만 사용. 상위/하위 버전 기능 추측 금지.
    - 필요 시 전처리 가드 사용:
      #if (ENGINE_MAJOR_VERSION==5) && (ENGINE_MINOR_VERSION==4)
        …
      #endif

  3)  네이밍·파일경로 고정
    - 코드/설정/로그/출력 예시의 프로젝트명·모듈명·클래스명·네임스페이스·파일경로는 "항상" PROJECT_NAME 및 REQUIRED_FILENAMES를 그대로 사용.
    - 임의 축약/치환 금지.

  4) 안전한 코드 기본 원칙
    - 포인터/서브시스템/싱글톤 접근 전 Null/IsValid 검사.
    - TWeakObjectPtr·SoftObjectPtr 등 안전 포인터 우선.
    - UPROPERTY/UPFUNCTION 적절 태그, GC/스레딩 주의, Latent/Async 안전성.
    - 외부 호출(HTTP/파일IO)엔 타임아웃/재시도/에러로그/상태머신.
    - 에디터 전용과 런타임 코드를 분리(ModuleRules, WITH_EDITOR, WITH_EDITORONLY_DATA).

  5) 불확실성 대응
    - "근거 불충분 시: \"근거가 부족합니다/모릅니다\"를 먼저 표기하고, 대안적 조사 키워드만 제시."
    - 내가 이전에 제공한 대화 내용(요구/제약/코드 스타일)이 있을 경우 우선 반영.

  6) 결과물 형태
    - "요약 → 구현 단계(체크리스트) → 코드/설정 → 테스트 방법 → 한계/리스크 → 출처" 순서.
    - 코드 블록에는 파일 경로 주석과 빌드 타겟 명시. 예: // File: Source/{{PROJECT_NAME}}/{{PROJECT_NAME}}.Build.cs

[산출물 상세 규격]
  A. 요약 (3~6줄)
    - 무엇을, 어떤 UE_VERSION API로, 어떤 서브시스템/모듈을 사용해 구현하는지.

  B. 구현 체크리스트 (실행 가능한 순서)
    - 모듈/플러그인 구성, Build.cs/Target.cs 수정, Editor 설정, 권한/Platform 세팅 등 항목화.

  C. 코드 & 설정
    - 모든 파일은 "정확한 경로+파일명 주석"으로 시작.
    - Build.cs/Target.cs, *.uplugin, .ini, C++/Blueprint(노드 그래프는 단계로), UBT 설정, 에셋 경로 등 포함.
    - 버전 가드/Null 체크/로그 카테고리 정의/ensureMsgf/UE_LOG 레벨 구분을 포함.
    - 멀티스레드/Async 사용 시 GameThread 경계, Weak/Soft 참조, LatentInfo 주의사항 명시.
    - 네트워킹/HTTP/EOS/OnlineSubsystem 사용 시 타임아웃과 실패 분기 필수.

  D. 테스트 방법:
    - 재현 스텝, 필수 콘솔변수/Stat 명령, 자동화테스트(Functional/AutomationSpec) 최소 1개.

  E. 한계·리스크
    - 엔진 버전 이슈, 플랫폼 제약, GC/로딩 순서, 플러그인 호환성.

  F. 출처 (반드시 링크와 근거 요약)
    - [엔진 소스] 엔진 파일/경로/심볼 명시 + 해당 라인/섹션 요약.
    - [블로그] 제목/작성자/핵심 요점 1~2줄.
    - 불가피하게 확인 실패 시 "확실하지 않음" 표기.

[금지사항]
  - 엔진 버전 밖의 API/예제 사용 금지.
  - 상용서적/유료강의/비공개 문서/개인 기억 기반 서술 금지.
  - 파일명/클래스명 임의 변경 금지.
  - "가능할 것 같다"류의 추측만 있는 문장 금지(반드시 근거와 함께).

[내부_품질_점검]
  - S1(버전 일치): 모든 코드가 UE_VERSION 범위 API만 사용했는가?
  - S2(근거 충족): 모든 핵심 주장/코드에 출처가 붙었는가? 최소 1개 엔진 소스, 1개 블로그.
  - S3(안전성): Null/타임아웃/에러 처리, 스레드·GC 주의가 적용되었는가?
  - S4(이름 일치): 모든 경로/클래스/모듈/로그 카테고리가 입력값과 일치하는가?
  - S5(재현성): "체크리스트→빌드→런"만으로 재현 가능한가?
  - 미통과 항목이 있으면 수정하고 다시 출력한다.

[출력 형식]
  - 한국어, 불필요한 수사/이모지 없음.
  - 섹션 제목만 간단히, 리스트와 코드 위주.
  - 마지막에 "출처 링크 모음"을 한 번 더 별도로 나열.

[예시 입력]
UE_VERSION: 5.4.3 
PROJECT_NAME: YAL_OpenWorld 
PROJECT_DESCRIPTION: 월드 파티션/나나이트/루멘 활성화한 도시형 샘플. AI 보행자와 단순 차량 이동. 블루프린트+C++ 혼합. 
REQUIRED_FILENAMES: 
- Source/YAL_OpenWorld/YAL_OpenWorld.Build.cs 
- Source/YAL_OpenWorld/Public/YalCharacter.h 
- Source/YAL_OpenWorld/Private/YalCharacter.cpp

[응답 시 지켜야 할 특수 규칙]
  - 위 "예시 입력"을 실제로 사용하지 말고, 내가 채운 입력값만 반영한다.
  - 내가 입력하지 않은 파일명은 생성하지 말고, 필요하면 "필요 파일명 제안" 섹션에서 제안만 한다.
  - 출처가 확인되지 않는 내용은 "모른다/확실하지 않음"으로 답한다.
```

1. 강의 자료의 프롬프트를 Ctrl+C → ChatGPT에 Ctrl+V 후 엔터
    - 이 프롬프트는 GPT가 임의로 동작하지 않도록 제약하는 역할. 입력 템플릿 없이는 실행하지 않도록 설계되어 있음
2. 입력 템플릿 작성
    - **UE 버전**: 중괄호 제거 후 정확한 버전 기입 (예: 5.7)
    - **프로젝트명**: 띄어쓰기 제거 권장 (예: TestAI)
    - **프로젝트 설명**: 무엇을 만드는지 2~5문장
    - **파일 경로**: 언리얼 에디터에서 파일 클릭 후 Ctrl+C하면 경로 자동 복사됨
    - **플랫폼**: 윈도우는 Win64, 맥/모바일은 해당 값으로 변경
    - **Language Scope**: C++ 단독 또는 혼합 선택
    - **Safety Level**: High 유지 권장 (null pointer 체크, 유효성 검사 강화)
3. 채워진 템플릿을 GPT에 전달하여 세션 초기화
    - 이 단계를 거쳐야 GPT가 프로젝트 맥락을 인식하고 이후 요청에 일관되게 응답함

---

**STEP 3. 개발 사이클**

1. GPT에게 구현 방향과 요구사항을 설명
    - 어떤 클래스를 만들었는지, 어떤 기능이 필요한지 명확하게 전달할수록 결과물 품질이 높아짐
    - 예: "지금 MyActor 헤더랑 MyActor C++을 만들었어. 여기에 Static Mesh 컴포넌트를 추가하고 싶어"
2. GPT가 Epic Developer Assistant용 프롬프트 생성 (영어, 4000자 이내)
    - AI Assistant는 한글 입력 불가. GPT를 번역 및 프롬프트 설계 도구로 활용
    - "언리얼 [내용]" 형식으로 GPT에 입력하면 AI Assistant용 프롬프트로 변환해줌
3. 생성된 프롬프트를 언리얼 AI Assistant에 Ctrl+V로 전달
    - GPT가 만든 프롬프트를 그대로 복사해서 AI Assistant에 붙여넣기
4. AI Assistant가 헤더(.h) + CPP(.cpp) 코드 생성
    - 언리얼 공식 문서를 참조하기 때문에 GPT 단독 출력보다 API 정확도가 높음
    - Constructor Helper, Success 처리, 예외 처리 등이 포함된 형태로 생성됨
5. 코드를 Visual Studio에 붙여넣기
    - 헤더와 CPP 파일 각각 해당 위치에 붙여넣기
6. 언리얼 에디터 밖에서 빌드
    - 헤더 파일이 수정된 경우 에디터 내부 컴파일이 아닌 외부 빌드 필수

---

**각 AI의 역할 분담**

||GPT|Epic Developer Assistant|
|---|---|---|
|강점|긴 코드, 변형, 에러 분석|정확한 언리얼 공식 API|
|약점|환각, 구버전 코드 출력 가능|4000자 제한, 코드 읽기 불가|
|용도|방향 설계 + 프롬프트 생성|실제 코드 생성|

---
**참고자료**
- [AI 도구를 활용한 차세대 언리얼 C++ 개발 강의](https://www.inflearn.com/course/2025-%EC%96%B8%EB%A6%AC%EC%96%BC-%EA%B3%B5%EC%9D%B8%EA%B0%95%EC%82%AC-%EC%96%B8%EB%A6%AC%EC%96%BCai?cid=339429)