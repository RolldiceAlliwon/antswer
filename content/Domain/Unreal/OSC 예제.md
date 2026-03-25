---
date created: 2026-03-24
tags:
  - Unreal
  - Interective
  - Blueprint
---
## OSC Creative Coding with ZigSim

### 프로젝트 생성 및 기본 세팅

- **필수 플러그인 활성화**
    - **OSC 플러그인** 활성화
    - (선택 사항) **Electronic Nodes 플러그인** 활성화

- **에디터 환경 설정**
    - 에디터 환경 설정에서 **Asset Editor Open Location**- **Main Window**로 변경
    - Electronic Nodes 플러그인 설정을 **WireStyle- Manhattan mode**로 변경하고 **Round Radius: 10** 조정

### OSC 통신을 위한 프로그램 사전 세팅

- **스마트폰 준비**
    - **ZigSim 앱** 다운로드 및 설치
        - [Download ZIG SIM Latest Version 1.0.2 Android APK File](https://apkpure.com/zig-sim/com.onetoten.app.zig_sim/download?utm_source=chatgpt.com) - 안드로이드 올드 버전
        - 업데이트 중단 + 앱 유지보수 축소 이슈로 플레이스토어에서 다운로드 불가

- **PC 준비**
    - [Protokol](https://hexler.net/protokol#windows) 프로그램 다운로드 및 설치

### 레벨 환경 및 기본 오브젝트 배치

- [YFJSR-UE5_OSC_Interactive_Art_Files.zip](https://www.dropbox.com/scl/fi/cjehts83o8qp29s0nthe7/YFJSR-UE5_OSC_Interactive_Art_Files.zip?rlkey=xbgvktzqi3t9sac9sexx4ppst&e=1)
- import options
	- Generate Missing Collision ❌
	- import Rotation 90, 0, -90
### 네트워크 설정 및 OSC 연결 테스트

1. **네트워크 연결 권장 사항**
    - **로컬 핫스팟**을 통한 네트워킹 권장 (IP 주소 고정, 인터넷 연결 의존성 낮음)

2. **핫스팟 설정 및 IP 주소 복사**
    - PC에서 모바일 핫스팟 활성화
    - 휴대폰에서 핫스팟 연결
    - 스마트폰의 게이트웨이 주소 복사
        - 192.168.137.1

3. **ZigSim 앱 설정**
    - ZigSim 앱 실행 후 설정(Settings) 탭으로 이동
    - 복사한 핫스팟의 IP 주소 붙여넣기
    - 포트 번호(Port Number)를 1234로 설정
    - 기타 설정: App, UDP, OSC, 30c Message Rate

4. **Protokol 프로그램 설정 및 OSC 연결 확인**
    - PC에서 Protokol 프로그램 실행 후 OSC 탭으로 이동
    - 포트 번호(Port Number)를 1234로 설정
    - ZigSim 앱의 센서(Sensor) 탭에서 **Accel** 활성화 (다른 센서는 비활성화)
    - ZigSim 앱의 시작(Start) 탭에서 Protokol을 체크하여 메시지 수신 확인
    - ⚠️ 메시지를 수신하지 못하는 경우 병화벽에서 수신 메시지를 차단하고 있을 수 있다.
        
5. **방화벽 설정 (메시지 수신 문제 시)**
    - Windows 방화벽 설정- Allow an app through firewall에서 Protocol, UE4 Editor, Unreal Editor 허용
        - Private 및 Public 네트워크 모두 체크

6. **배터리 소모 방지를 위한 메시지 전송 중지**
    - ZigSim 앱에서 센서 또는 설정 탭 선택하여 메시지 전송 중지. 그렇지 않으면 휴대폰에서 계속해서 메시지를 보내 배터리가 소모됨.

7. **Protocol 프로그램 종료**
    - OSC 기능이 정상 작동함을 확인 후 Protokol 프로그램 종료

---

## 언리얼 엔진 5 OSC 설정 및 메시지 수신

### OSC 서버 생성 및 메시지 수신 설정

1. **블루프린트 액터 생성 및 OSC 서버 설정**
    
    - `BP_OSC`라는 이름의 블루프린트 액터를 생성한다.
    - 이벤트 그래프에서 `Event Begin Play` 노드에 `Create OSC Server` 노드를 연결한다.
    - ZigSim 앱과 동일한 IPv4 라우터 주소와 포트 번호를 입력하고 `Start Listening`을 활성화한다.
    - 생성된 OSC 서버 참조를 `OSC server` 변수로 저장하여 자동으로 가비지 컬렉터에 의해 참조가 지워지지  않도록 한다.

2. **OSC 메시지 수신 이벤트 바인딩**
    - `OSC server` 변수에서 `Bind Event on OSC Message Received` 노드를 연결한다.
    - `Create Matching Event`를 통해 `OSC In`이라는 이름의 이벤트를 생성한다.
    - 이벤트 드롭다운에서 `OSC In`을 수동으로 선택한다.

### 수신된 OSC 메시지 처리 및 파싱

1. **OSC 메시지 변수화 및 주소 추출**
    - 수신된 OSC 메시지를 `OSC Messages` 변수로 저장한다.
    - `Get OSC Message Address` 노드를 사용하여 메시지 주소를 추출한다.
    - 추출된 주소를 `Convert OSC Address to String` 노드를 통해 문자열로 변환한다.
    - 서버 작동 확인을 위해 `Print String` 노드를 연결하여 메시지를 출력한다.
    - 뷰포트에 액터를 배치하고 게임을 플레이하여 출력이 정상적으로 나오는지 테스트해본다. 
        - Accle Float 값을 추출하려면 이 문자열을 [parsing](https://ko.wikipedia.org/wiki/%EA%B5%AC%EB%AC%B8_%EB%B6%84%EC%84%9D)해야함.

2. **메시지 문자열 파싱 및 필터링**
    - `Print String` 노드를 제거하고, `/`를 구분자로 사용하는 `Split` 노드를 연결한다.
    - `Split` 노드의 오른쪽 출력(`S` 아웃렛)을 다시 `Print String`에 연결하여 파싱된 문자열을 확인한다.
        - 이를 통해 문자열에 대한 스위치를 사용하여 필터링 할 수 있다.
    - `Print String` 노드를 제거하고 `Switch on String` 노드를 생성한다.
    - `Switch on String` 노드에 `accel`이라는 이름의 핀을 추가하고, 해당 핀에서 실행될 로직을 설정한다.
    - `accel` 메시지 수신 시 `Get OSC Message Float at Index` 노드를 사용하여 X축 값(인덱스 0)을 추출한다.
    - X축 값은 가속도를 나타내며, 화면 평면에 수직인 수평 축을 따라 움직임을 감지한다.

### 가속도 값 필터링 및 변수 저장

- `Print String` 노드를 다시 연결하여 X축 가속도 값을 확인하고, 좌우 움직임에 따라 값이 변하는 것을 확인한다.
- 가속도 값이 특정 임계값(-0.5)보다 크고, 특정 방향(오른쪽으로 스윙)으로 움직일 때만 값을 저장하도록 설정한다. 즉 오른쪽으로 충분히 강하게 스윙할 때만 값을 저장하고 작은 움직임은 무시하도록 설정한다.
- `Less Than` 노드와 `Branch` 노드를 사용하여 조건을 검사한다.
- 조건이 참일 경우, X축 가속도 값의 절대값을 `Accel X` 변수에 저장한다.
- 조건이 거짓일 경우, `Accel X` 변수 값을 0으로 설정한다.
- 임계값은 추후 조절 가능하며, 현재 설정으로 컴파일 및 저장한다.

## 물리 제약 조건을 활용한 스피너 액터 생성

### 1.1. 스피너 액터 컴포넌트 설정

스피너 액터를 생성하고 필요한 컴포넌트들을 배치하며 초기 설정을 진행한다.

1. **BP_spinner 액터 생성 및 컴포넌트 배치**
    - `BP_spinner`라는 이름의 액터를 생성한다.
    - `root`라는 이름의 씬 컴포넌트를 추가하고 새로운 루트로 설정한다.
        - movable 모빌리티로 설정

2. **기본 베이스 컴포넌트 설정**
    - `base`라는 이름의 큐브 컴포넌트를 추가한다.
    - 큐브의 크기를 `0.1, 0.2, 0.1`로 조정하여 물리 제약 조건의 앵커로 사용한다.

3. **팔(Arm) 컴포넌트 추가 및 설정**
    - `root`의 자식으로 `arm1`이라는 이름의 스태틱 메시 컴포넌트를 추가하고 `arm1` 메시를 할당한다.
    - `arm1`의 자식으로 `impulseArrow`라는 이름의 화살표 컴포넌트를 추가하고 Z축으로 -80 위치에 배치한다.
    - `root`의 자식으로 `arm2end`라는 이름의 스태틱 메시 컴포넌트를 추가하고 `arm2end` 메시를 할당한다.
    - `arm2end`의 자식으로 `arm2light`, `arm2bar`, `arm2start`라는 이름의 스태틱 메시 컴포넌트 세 개를 추가하고 각각 해당 메시를 할당한다.
    - `arm2start`와 `arm2bar`의 Z축 위치를 80으로 설정하고, `arm2light`의 위치를 0으로 설정한다.

4. **컴파일 및 저장**
    - 설정이 완료되면 컴파일하고 저장한다.

### 1.2. 물리 제약 조건(Physics Constraint) 설정

실시간 물리 시뮬레이션을 위해 물리 제약 조건을 추가하고 각 컴포넌트 간의 연결 및 제한 사항을 설정한다.

1. **물리 제약 조건 컴포넌트 추가**
    - `root` 컴포넌트에 `PC_base`라는 이름의 물리 제약 조건 컴포넌트를 추가한다.
    - `PC_base`를 복제하여 `PC_joint`라는 이름으로 변경한다.
    - `PC_joint`를 두 팔이 만나는 지점으로 이동시킨다 (Y: 5, Z: -80).

2. **콜리전 메시 설정**
    - 물리 제약 조건이 제대로 작동하기 위해 `Arm1`과 `Arm2End` 메시에 충돌 메시를 추가해야 한다.
    - `Arm1` 메시를 열고 박스 충돌(Box Collision)을 추가하여 팔의 형태에 맞게 조정하고 저장한다.
    - `Arm2End` 메시에도 동일하게 박스 충돌을 추가하고 저장한다.

3. **물리 시뮬레이션 및 충돌 설정**
    - `BP_spinner`로 돌아와 `arm1` 컴포넌트의 디테일 패널에서 **물리 시뮬레이션(Simulate Physics)**을 활성화한다.
    - ~~`arm1`의 컨스트레인트 조건에서 Y축 위치를 잠그고, X축과 Z축 회전을 잠근다. 이는 불필요한 움직임을 방지하여 시뮬레이션 안정성을 높인다.~~
        - ⚠️ 스피너를 움직이려고 하면 움직임을 제한하는 원인이 됨
    - `arm1`의 충돌 프리셋을 `Physics Actor`로 설정한다.
    - `arm2end` 컴포넌트에도 동일한 설정을 반복한다.
    - `arm2end`의 고급 설정에서 **질량 스케일(Mass Scale)**을 2로 설정한다.
    - `base` 큐브 메시의 충돌 설정을 **Custom - 쿼리 전용(Query Only)** 으로 변경하고, 오브젝트 타입을 `Physics Body`로 설정한다. `Physics Body`만 Block하도록 설정하고, 다른 모든 것은 ignore한다.
    - `base` 큐브의 **가시성(Visibility)**을 끄고, 이는 물리적 용도로만 사용되기 때문이다.

4. **물리 제약 조건 연결 설정**
    - `PC_Base` 컴포넌트에서 **컴포넌트 이름 1(Component Name 1)**을 `Base`로, **컴포넌트 이름 2(Component Name 2)**를 `Arm1`으로 설정한다.
    - `PC_Joint` 컴포넌트에서 **컴포넌트 이름 1**을 `Arm1`로, **컴포넌트 이름 2**를 `Arm2End`로 설정한다. (⚠️이름은 대소문자를 구분하므로 주의한다.)
    - `PC_Base`와 `PC_joint`의 **각도 제한(Angular Limits)**에서 `Swing 1`과 `Twist` 모션을 잠그고, `Swing 2` 모션은 자유롭게 Free 둔다. 이는 팔이 Y축을 중심으로만 자유롭게 움직이도록 한다.

5. **충돌 비활성화 및 강성 설정**
    - `PC_base`에서 `base`와 `arm1`이 겹치는 문제를 해결하기 위해 **충돌 비활성화(Disable Collision)**를 클릭하여 물리적 충돌로 인한 폭발을 방지한다.
    - 회전 시 마찰을 추가하기 위해 `PC_Base`와 `PC_joint`의 **각도 모터(Angular Motor)** 섹션으로 이동한다.
    - `Drive Mode`를 `Twist and Swing`으로 설정하고, `Target Velocity`에서 `Swing`을 활성화하며 **강도(Strength)**를 10으로 설정한다. 강도 값은 회전 시 마찰의 정도를 결정한다.

6. **시뮬레이션 테스트**
    - BP_Spinner - Construction Script로 이동하여 `PC_Base`를 가져와 **각도 속도 타겟(Set Angular Velocity Target)** 노드를 사용한다.
    - `make vector`를 생성하고 Y 값을 1.5로 설정한다.
    - 컴파일하고 저장한 후 뷰포트에서 **시뮬레이트(Simulate)**를 클릭하여 스피너가 회전하는지 확인한다.
    - 만약 예상대로 작동하지 않으면 이전 단계에서 누락된 부분이 없는지 확인한다.

---

## OSC와 블루프린트를 활용한 인터랙티브 아트 구현

Unreal Engine 5에서 OSC 신호를 받아 게임 내 오브젝트를 움직이고 파티클 효과를 생성하는 방법을 블루프린트를 통해 단계별로 학습한다.

### 1.1. 카메라 설정 및 BP_Spinner 액터 준비

영상 시청 환경 설정을 위해 카메라를 레벨에 배치하고 레벨 블루프린트에서 카메라 참조를 생성하여 플레이 시 올바르게 보이도록 설정한다. 또한, OSC 신호를 받을 `BP_Spinner` 액터에 OSC 오브젝트 참조 변수를 추가하고 인스턴스 편집 가능하도록 설정한다.

1. **카메라 설정 및 레벨 블루프린트 구성**
    - `BP_Spinner` 액터를 레벨에 배치하고 위치를 초기화한다.
    - 레벨에 카메라가 할당되지 않았으므로, 카메라를 선택하고 레벨 블루프린트를 연다.
    - `Event Tick` 노드를 삭제하고 카메라에 대한 참조를 생성한다.
    - 플레이어 컨트롤러도 필요하며, `Set View Target with Blend` 노드를 사용하여 카메라를 타겟으로 설정한다.
    - 코드를 정리하고 컴파일 및 저장한다.
        
2. `BP_Spinner` 액터에 OSC 참조 변수 추가
    - 레벨에서 카메라가 올바르게 설정되었는지 확인하고 플레이한다.
    - `BP_Spinner` 액터에서 새로운 변수 `BP_OSC`를 생성한다.
    - 변수 타입을 `BP_OSC` 오브젝트 참조로 변경한다.
    - "Instance Editable" 옵션을 체크하여 인스턴스 편집 가능하게 설정한다.
    - 컴파일 및 저장한다.

### 1.2. BP_Spinner와 OSC 연동 및 회전 구현

`BP_Spinner` 액터와 OSC 데이터를 연동하여, OSC 신호의 X, Y, Z 값을 받아 `BP_Spinner` 액터를 회전시키는 로직을 구현한다.

1. `BP_Spinner`와 `BP_OSC` 액터 연결
    - `Map 1`으로 이동하여 `BP_Spinner`를 선택한다.
    - 스포이드 도구를 사용하여 레벨에 있는 `BP_OSC` 액터를 선택하여 연결한다.
    - 이 방식은 직접적인 액터 참조로, 대규모 게임에서는 오류 발생 가능성이 높아 좋지 않은 프로그래밍 습관임을 인지한다.
    - 프로젝트에서 해당 액터를 수정하지 않을 것이므로 안전하게 사용할 수 있다.
    - 일반적으로는 `Get All Actors Of Class`, 캐스팅, `Is Valid` 체크를 사용하여 유효하지 않은 참조로 코드가 실행되는 것을 방지하는 것이 좋다.

2. **OSC 값 기반 회전 로직 구현**
    - `BP_Spinner`의 이벤트 그래프로 이동하여 `Event Tick` 노드를 활용한다.
    - `Event Tick`에서 `BP_OSC` 참조를 드래그하여 OSC의 X, Y, Z 값을 가져온다.
    - 가져온 X, Y, Z 값을 `Accel_X`변수로 승격시켜 저장한다.
    > [!tip] 
    >센서 값에 따라 `FInterp To` 노드를 사용하여 값을 부드럽게 처리할 수 있으며, 이는 TouchDesigner의 Lag Chop과 유사한 역할을 한다.	
    >본 프로젝트에서는 값의 차이가 없어 해당 기능을 제거했다.
    - 이제 얻은 부동 소수점 값으로 임펄스를 추가하는 로직을 구현한다.
    - `Impulse Arm1`이라는 커스텀 이벤트를 생성하고, `Event Tick`에서 얻은 Accel X 값을 이 이벤트로 전달한다.
    - 임펄스 벡터를 계산하기 위해 `Impulse Arrow`를 드래그하고, `Get Forward Vector`와 `Get World Location`을 사용한다.
        - 벡터 연산을 수행하며, 선형 대수학 학습을 강력히 추천한다.
    - 먼저 Accle X값을 Scalar 값과 곱한다.
	    - 이 스칼라 값을 `Impulse Scalar` 변수로 승격시키고 기본값을 200으로 설정한다.
    - 단위 벡터인 `Forward Vector`를 곱셈 결과로 스케일링하고, 이 결과를 `World Location`과 더하여 필요한 임펄스 벡터를 생성한다.
    - `Arm1` 컴포넌트를 드래그하여 `Add Impulse at Location` 노드를 사용하고, 계산된 임펄스 벡터를 `Impulse`에, `World Location`을 `Location`에 연결한다.
        
3. **회전 기능 테스트**
    - 설정된 로직으로 휴대폰을 오른쪽으로 흔들면 `BP_Spinner`가 반시계 방향으로 회전해야 한다.
    - `Map 1`으로 이동하여 Zig Sim이 실행 중인지 확인하고 플레이한다.
    - 휴대폰을 오른쪽으로 흔들면 `BP_Spinner`가 정상적으로 회전하는 것을 확인할 수 있다.

### 1.3. 파티클 트레일 생성을 위한 Niagara 시스템 구현

`BP_Spinner`의 움직임을 따라가는 파티클 트레일을 생성하기 위해 Niagara 시스템을 만들고, 파티클 재질을 설정하며, Niagara 시스템의 파라미터를 조정한다.

1. **파티클 재질 생성**
    - 파티클 트레일을 생성하기 전에 파티클에 사용할 재질을 생성한다.
    - `Map` 폴더에 `M_NS_Trail`이라는 이름의 재질을 생성한다.
    - 재질의 블렌드 모드를 `Translucent`로, 셰이딩 모델을 `Unlit`으로 설정한다.
    - `Particle Color` 노드를 생성하고, 알파 값을 `Opacity`에 연결한다.
    - `Multiply` 노드를 생성하여 색상과 5를 곱하고, 그 결과를 `Emissive Color`에 연결한다.
    - 재질을 저장하고 닫는다.

2. **Niagara 시스템 생성 및 설정**
    - 콘텐츠 브라우저에 `_effects` 폴더를 생성한다.
    - `_effects` 폴더 안에서 Niagara 시스템을 생성하고 `NS_Trail`로 이름을 지정한다.
    - 템플릿으로 `Fountain`을 선택하고 `Add`를 클릭한다.
    - 생성된 Niagara 시스템을 열고 다음 설정을 적용한다.
    - `Shape Location`, `Add Velocity`, `Drag`, `Sprite Renderer`를 삭제한다.
    - 대신 `Ribbon Renderer`를 추가한다.
    - 생성한 `M_NS_Trail` 재질을 `Ribbon Renderer`에 적용한다.
    - 파라미터 설정을 변경한다.
    - `Spawn Rate`를 초당 30으로 설정한다.
    - `Initialize Particle`에서 `Lifetime Mode`를 `Direct Set`으로 설정하고 수명을 2.5초로 지정한다.
    - `Color Mode`에서 색상 벡터 옆 드롭다운을 `User`로 변경하여 블루프린트에서 색상을 설정할 수 있도록 한다.
    - `Mass Mode` 이하의 모든 항목은 기본값으로 되돌린다.
    - `Ribbon Width`를 `Direct Set`으로 설정하고 1.5로 지정한다.
    - `Gravity`를 X: 0, Y: 500, Z: 0으로 설정한다.
    - 모든 설정이 완료되면 Niagara 시스템을 저장하고 닫는다.
        

### 1.4. Niagara 시스템을 BP_Spinner에 연결 및 테스트

생성한 Niagara 시스템을 `BP_Spinner` 액터에 연결하여 움직임에 따라 파티클 트레일이 생성되도록 설정하고, 최종적으로 작동을 확인한다.

1. **Niagara 시스템 컴포넌트 추가 및 연결**
    - `BP_Spinner` 액터에 `Arm Two` 컴포넌트의 자식으로 `Niagara_Pos`라는 이름의 Scene Component를 추가한다.
    - `Niagara_pos` 컴포넌트를 `Arm2End`의 자손으로 종속한다.
    - 이벤트 그래프에서 `Event Begin Play` 노드로부터 `Spawn System Attached` 노드를 호출한다.
    - `Niagara Pause` 컴포넌트를 `Attach Component`에 연결한다.
    - `System Template`에 생성한 `NS_Trail`을 선택한다.
    - 생성된 Niagara 시스템을 `NS_Trail`이라는 변수로 저장한다.
    - 컴파일 및 저장한다.