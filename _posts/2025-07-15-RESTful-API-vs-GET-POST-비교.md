---
layout: post
title: "RESTful API vs GET/POST 요청만 사용한 프로젝트 비교"
author: "devJZen"
tags: [API, REST, web, development, architecture]
categories: [web]
excerpt: "RESTful API 설계와 GET/POST 요청만 사용한 프로젝트의 장단점을 상세히 비교분석"
---
# RESTful API vs GET/POST 요청만 사용한 프로젝트 비교

## REST란 무엇인가?

**REST(Representational State Transfer)** 는 2000년 Roy Fielding의 박사 논문에서 제시된 **웹 아키텍처 스타일**이다. 단순히 HTTP 메서드 사용 규칙이 아니라, 웹의 기존 설계 원칙을 최대한 활용하여 분산 시스템을 설계하는 방법론이다.

### REST의 6가지 아키텍처 제약조건

1. **Client-Server (클라이언트-서버)**: 사용자 인터페이스와 데이터 저장소를 분리
2. **Stateless (무상태)**: 각 요청은 독립적이며 서버는 클라이언트 상태를 저장하지 않음
3. **Cacheable (캐시 가능)**: 응답은 캐시 가능 여부가 명시되어야 함
4. **Uniform Interface (균일한 인터페이스)**:
   - 자원 식별 (URI)
   - 표현을 통한 자원 조작 (HTTP 메서드)
   - 자기 서술적 메시지 (HTTP 상태 코드, 헤더)
   - 애플리케이션 상태 전이의 엔진으로서 하이퍼미디어 (HATEOAS)
5. **Layered System (계층화된 시스템)**: 클라이언트는 중간 계층의 존재를 알 필요 없음
6. **Code-On-Demand (선택적)**: 서버가 클라이언트에 실행 코드를 전송할 수 있음

**즉, HTTP 메서드는 REST의 "균일한 인터페이스" 제약조건의 일부일 뿐이며, REST는 웹 전체의 아키텍처 원칙을 다루는 개념이지 메서드를 부합한다고 하여서 RESTful하진 않다.**

## 주요 오해와 명확화

### 🚫 잘못된 인식

- "RESTful API = GET, POST, PUT, DELETE 사용"
- "HTTP 메서드만 맞게 쓰면 RESTful"

### ✅ 올바른 인식

- **REST는 웹 아키텍처 스타일**로, HTTP 메서드는 그 중 일부일 뿐
- **자원(Resource) 중심의 설계**가 핵심
- **웹의 기존 인프라를 최대한 활용**하는 방법론
- **클라이언트-서버 간의 상호작용을 웹 표준에 맞게 설계**하는 것

### 실제 REST의 핵심

```
전통적 방식: POST /getUserById?id=123
RESTful 방식: GET /users/123

전통적 방식: POST /deleteUser?id=123  
RESTful 방식: DELETE /users/123
```

이처럼 REST는 **"웹을 어떻게 사용할 것인가"** 에 대한 철학적 접근이며, HTTP 메서드는 이를 구현하는 수단 중 하나입니다.

## API 설계에서 DB 구조 노출의 보안 위험성

### 올바르지 않은 API 응답 예시

```json
// ❌ 위험: DB 컬럼명 그대로 노출
{
  "user_id": 12345,
  "user_name": "홍길동",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-07-15T10:30:00Z",
  "is_deleted": false,
  "internal_status_code": 1,
  "admin_notes": null
}
```

### 보안상 문제점

1. **DB 스키마 유추 가능**

   - 컬럼명으로 테이블 구조 파악
   - 다른 테이블과의 관계 추측 가능
   - SQL Injection 공격 시 힌트 제공
2. **Internal ID(PK) 노출**

   - 시스템 규모 추정 가능 (user_id: 12345 → 대략 12,000명 이상의 사용자)
   - 순차적 ID로 다른 사용자 정보 추측 시도 가능
   - 비즈니스 로직 파악 (생성 순서, 삭제 여부 등)
3. **민감한 내부 정보 노출**

   - `admin_notes`, `internal_status_code` 등
   - 삭제 여부(`is_deleted`) 노출
   - 시스템 내부 상태 정보

### 안전한 API 응답 예시

```json
// ✅ 안전: DTO/VO 패턴 활용
{
  "id": "usr_8x9m2k3n",  // UUID 또는 인코딩된 ID
  "name": "홍길동",
  "joinDate": "2025-01-01",
  "profileStatus": "active"
}
```

### 보안 개선 방안

1. **DTO/VO 패턴 사용**

   - DB 엔티티와 API 응답 분리
   - 필요한 필드만 선택적 노출
2. **ID 인코딩/UUID 사용**

   - 순차적 ID 대신 UUID 사용
   - 또는 HashIds 등으로 인코딩
3. **필드명 일반화**

   - DB 컬럼명과 다른 일반적인 이름 사용
   - 비즈니스 로직과 독립적인 네이밍
4. **민감 정보 제거**

   - 내부 상태 코드, 관리자 메모 등 제외
   - 클라이언트에 불필요한 정보 차단
