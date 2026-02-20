---
title: USD Workflow
date: 2024-04-02
tags:
  - Blender
  - Unreal
---
>[!summary] 
>Blender에서 Unreal Engine으로 3D 데이터를 전송하는 두 가지 주요 워크플로우를 다룹니다. USD 포맷을 사용한 기본 씬 전송 방법과 Geometry Node로 생성한 프로시저럴 지오메트리를 전송하는 방법을 설명합니다. 

## USD Workflow

USD(Universal Scene Description)는 Pixar에서 개발한 포맷으로, 복잡한 씬 구조와 머티리얼 정보를 유지하면서 다른 Tool로 데이터를 전송할 수 있습니다.

#### Blender 설정

>![](https://velog.velcdn.com/images/coolguykeepgoing/post/2d23ac9f-7b42-46e0-a8d0-62f96827b027/image.png)
‼️ Materials, UV Maps, Normals 등의 옵션을 확인합니다.

#### Unreal Engine 설정

1. **플러그인 활성화**
	- Edit > Plugins에서 "USD Importer"를 검색하여 활성화합니다
	- 에디터를 재시작합니다
<br>
2. **USD Stage 열기**
	- Window → Virtual Production → USD Stage
	- Open File로 USD 파일을 불러옵니다
<br>
3. **에셋 임포트**
	- Actions > Import를 선택합니다
	- 콘텐츠 폴더로 에셋을 영구적으로 임포트합니다

![](https://velog.velcdn.com/images/coolguykeepgoing/post/5c41d5a5-d56b-42fc-a929-b2ecce2e656a/image.png)

#### Exposure 일치시키기

Blender와 Unreal Engine의 노출값을 맞춰 시각적 일관성을 유지합니다.

⚙️ **Blender** : Color Management → Look → High Contrast
⚙️ **Unreal**: Post Process Volume → Exposure → Metering Mode → Manual

---
## Geometry Node를 Unreal로 전송하기

Blender의 Geometry Node로 생성한 Procedural Geometry를 Unreal Engine에서 사용하는 방법입니다. 두 가지 접근 방식이 있습니다.
#### 방법 1: Alembic + MDD 워크플로우

Shape Key로 변환하여 Skeletal Mesh 애니메이션으로 임포트하는 방법입니다.

1. **Alembic Export**
	- Geometry Node의 Realize Instances 노드를 추가하여 인스턴스를 실제 지오메트리로 변환합니다
	- Use Instancing을 비활성화합니다
	- Selected Objects를 활성화합니다
2. **Alembic Reimport**
	- Modifier 탭에서 Mesh Sequence Cache Modifier의 Vertex Interpolation을 활성화합니다
	- 부드러운 버텍스 보간을 제공합니다
3. **MDD Export 준비**
	- Blender에 MDD Format 플러그인을 설치합니다
	- Edit > Preferences > Add-ons에서 "NewTek MDD format"을 검색하여 활성화합니다
4. **MDD Export**
	- File > Export > MDD (.mdd)
	- Frame Range를 체크하여 애니메이션 범위를 지정합니다
5. **MDD Reimport**
	- MDD 파일을 다시 임포트하여 Point Cache 데이터를 Shape Key로 변환합니다
	- Shape Key Editor에서 첫 프레임과 마지막 프레임의 불필요한 키를 삭제합니다
	- Dope Sheet를 Action Editor 모드로 전환합니다
	- 새 Action을 생성하고 Location 키프레임을 추가합니다
	- Push Down 버튼으로 NLA(Non-Linear Animation) 트랙으로 변환합니다
6. **FBX Export**
	- Selected Objects를 활성화합니다
	- Smoothing을 Face로 설정합니다
	- Bake Animation을 활성화하되, All Actions는 비활성화합니다
		- 현재 Action만 익스포트합니다
7. **Unreal Engine Import**
	- Skeletal Mesh를 활성화합니다
	- Import Morph Targets를 활성화합니다
	- Import Animation을 활성화합니다

> [!warning] 제한사항
> Animation Curve가 완전히 전달되지 않을 수 있습니다
> 복잡한 Geometry Node 애니메이션은 프레임 수가 많아져 용량이 커질 수 있습니다

#### 방법 2: AlterMesh 플러그인

[AlterMesh](https://www.fab.com/listings/8c4af9e8-2c1b-4525-bf1a-9bd53cbce9b4)는 Geometry Node를 Unreal Engine에서 직접 실행할 수 있는 플러그인입니다.

- 실시간으로 Geometry Node 로직을 Unreal에서 실행할 수 있습니다.
- 파라미터를 블루프린트로 노출하여 동적으로 제어할 수 있습니다.
- 베이킹 없이 Procedural Workflow를 유지할 수 있어 메모리 효율적입니다.

---
**참고자료**
- [USD in Unreal Engine](https://docs.unrealengine.com/5.3/en-US/universal-scene-description-in-unreal-engine/)
- [Geometry Nodes Documentation (Blender)](https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/index.html)