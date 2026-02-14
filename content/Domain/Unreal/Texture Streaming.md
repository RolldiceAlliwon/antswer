---
title: Texture Streaming
tags:
  - Unreal
  - Optimize
date: 2022-09-15
---

## Texture Streaming

- 언리얼에서 사용하는 텍스쳐의 Mipmap수준을 결정하는 과정을 Texture streaming이라고 합니다.
- 카메라가 텍스처에 가까워질수록 더 크게 Minmap을 스트리밍하여 Texture Streaming Pool이 더 가득 차게 됩니다.
- 스트리밍 데이터 (Mipmap 정보 포함)는 모든 레벨 빌드 절차에 일부로 미리 계산됩니다.  
	- 빌드 메뉴에서 '텍스처 스트리밍 빌드'를 선택하여 독립적으로 생성할 수 있습니다.

---

### Mipmap
- Mipmap은 Texture와 카메라 거리가 멀어질수록 Texture Size가 자동으로 작아져 메모리 효율성을 최대로 극대화하고 이미지를 부드럽게 만듭니다. 
- 최대 20단계로 세분화됩니다.


---

### Steaming Pool

- 언리얼을 구동할 때 **컴퓨터 메모리로부터 Texture 예산을 할당 받는 것**을 `Steaming pool`이라고 합니다.  
- Pool 용량은 즉 **표시할 텍스쳐 용량**을 제어한다는 의미입니다.

- 이 값은 컴퓨터에 설치한 **물리적 RAM과 동일하지 않으며** (운영 체제 및 기타 중요한 서비스에 일부가 필요하기 때문입니다), 함께 작동하는 여러 메모리 풀로 구성됩니다.  
    - Console Window에 `Stat Streaming`을 입력하면 상세하게 프로파일링할 수 있습니다.  
- 기본적인 Pool 크기는 1GB에 불과합니다.

- 때때로 뷰포트에서 흐릿한 Texutre가 보이는 문제의 원인은 
  더 많은 텍스처 용량이 필요할 때 Texture Streaming Pool이 자동으로 확장되지 않는 대신, Texture가 더 작은 Mipmap으로 크게 떨어지기 때문입니다.

---

#### Texture steaming pool 확장하는 방법

뷰포트에서 렌더링되는 장면 안에서 Streaming Pool에 비해 고해상도 텍스처들이 넘쳐날 때 뷰포트에 경고가 표시됩니다.

이 때 두가지 방법으로 Streaming Pool 크기를 키워서 해결할 수 있습니다.

- 1. 엔진에서 콘솔창을 열고 다음 명령어를 입력해줍니다.  
	- `r.Streaming.PoolSize = [DesiredSizeInMB]`
	- ⚠ 프로젝트를 재부팅하면 명령어를 다시 입력해주어야 합니다.

- 2. 재부팅 상관없이 Pool크기를 키우려면 DefaultEngine.ini 파일을 편집하는 방법이 있습니다.
    - 프로젝트 폴더 | config | DefaultEngine.ini
    - `[/Script/Engine.RendererSettings]` 섹션을 찾아 `r.Streaming.PoolSize = [DesiredSizeInMB]` 코드를 추가합니다.

---

#### Texture Streaming에서 제외하는 방법
- 이 방법은 어떠한 카메라 거리에서도 디테일을 포기할 수 없는 고해상도의 텍스처를 사용해야 하는 경우에 유용합니다.
- ✅ 보통 사용자가 명확하게 읽어야 하는 텍스처가 포함된 UI 요소 및 텍스트에 사용합니다.
- ⚠ 이 방법이 모든 텍스처에 적용되는 경우 성능에 심각한 영향을 미칩니다.

![](https://velog.velcdn.com/images/coolguykeepgoing/post/8b4cd963-0178-4aa3-9f8d-1af1d59ef8f1/image.png)
