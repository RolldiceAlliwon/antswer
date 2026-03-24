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
