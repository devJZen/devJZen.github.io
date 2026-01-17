---
layout: post
title: 4. SSH? GPG?
categories: study
tags: [study]
---

> 커밋에 서명하고 싶다.

학습을 하다보니 계정 도용 사례가 있는 걸 보고 커밋에 서명을 직접 해보기로 했다.
그래서 찾아본 SSH와 GPG의 차이점을 설명해보려고 한다.

## SSH란?

SSH (Secure Shell)

  용도: 인증 (Authentication) - "나는 이 사람이 맞다"

  - Git 원격 저장소 접근 시 사용
  - GitHub/GitLab에 push/pull 할 권한 확인
  - 비밀번호 없이 자동 로그인

  ### SSH 사용 예시
  git clone git@github.com:username/repo.git
  git push origin main

## GPG란?
GPG (GNU Privacy Guard)

  용도: 서명 (Signing) - "이 커밋은 내가 작성한 게 맞다"

  - 커밋/태그에 디지털 서명
  - 커밋 위조 방지
  - GitHub에서 "Verified" 배지 표시

  ### GPG 사용 예시
  git commit -S -m "message"  # 서명된 커밋
  git tag -s v1.0.0           # 서명된 태그

  핵심 차이

  |       | SSH                        | GPG                             |
  |-------|----------------------------|---------------------------------|
  | 목적  | 접근 권한 확인             | 작성자 신원 확인                |
  | 언제  | push/pull/clone 시         | commit/tag 시                   |
  | 보장  | "이 사람이 접근 권한 있음" | "이 코드를 정말 이 사람이 썼음" |
  | 필수? | HTTPS 대신 사용 가능       | 선택사항 (보안 강화용)          |

  실무 사용

  - SSH: 거의 모든 개발자가 사용 (편의성)
  - GPG: 오픈소스 메인테이너, 보안 중요한 프로젝트에서 사용

  요약: SSH는 "로그인", GPG는 "도장/인장"

## 워크 플로우

> 설치 - generate gpg - github에 등록
  
1. 설치

```shell
# mac 기준 brew로 설치
brew install gpg

# gpg 키 생성
gpg --full-generate-key

# default로 설정 따라가기
# 만료 날짜 원하는 만큼...나는 최소 3개월에서 최대 1년 갱신한다.
# 생성 후에 keyid 확인
gpg --list-secret-keys --keyid-format=long
# gpg --list-keys는 가지고 있는 공개키를 다 볼 때 사용한다.
# pub ed25519 뒤에 오는 id 확인

gpg --armor --export <키_ID>
# Git에서 등록
```

### 암호화 서명 차이

- RSA : 오래된 시스템에서 사용된다.
- ECC (타원 곡선 함수)로 권장한다. Git에서도 사용하고 있다.
