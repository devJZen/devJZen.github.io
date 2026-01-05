---
layout: post
title: Jekyll
categories: study
tags: [Jekyll]
---

## Jekyll 이란?

정적 웹사이트 프레임워크, [Jekyll](https://jekyllrb.com/) 이다.
html, css, md 관리에 편하다.
이걸 썼던 이유는 나는 옵시디언을 사용하고 있었고 굳이 다른 프론트에 fast API를 붙여서 관리하고 싶지 않았다. 
재밌는 지점은 학술 블로그는 전부 Jekyll 테마 또는 html 하나로 유지되고 있는 걸 확인했다. 
운명같은 프레임워크다.

## Jekyll 테마

[jekyll-theme-yat](https://github.com/jeffreytse/jekyll-theme-yat)을 커스텀해서 사용하고 있다. 시간이 괜찮을 때 테마 생성자에게 소정의 금액을 지원하고 나만의 테마로 바꿀 예정인데 내가 이 테마에서 가장 좋아했던 것은 커스텀 자유도다. 
테마를 커스텀 한다고 하여도 저장소에 출처를 남기도록 하자.

## 자주 사용하는 명령어 모음

```shell
#기본 명령어

  # 로컬 개발 서버 실행 (가장 많이 사용)
  bundle exec jekyll serve

  # 개발 서버 + 자동 새로고침 + draft 포함
  bundle exec jekyll serve --livereload --drafts

  # 특정 포트로 실행
  bundle exec jekyll serve --port 4001

  # 빌드만 실행 (배포용)
  bundle exec jekyll build

  # 빌드 + 상세 로그
  bundle exec jekyll build --verbose

#새 프로젝트/포스트 생성

  # 새 Jekyll 사이트 생성
  jekyll new my-site

  # 특정 테마로 생성
  jekyll new my-site --blank

  # 새 포스트 생성 (플러그인 필요)
  bundle exec jekyll post "My New Post"

  # 새 draft 생성
  bundle exec jekyll draft "My Draft Post"

#개발 시 유용한 옵션

  # 증분 빌드 (변경된 파일만 빌드 - 속도 향상)
  bundle exec jekyll serve --incremental

  # future 날짜 포스트도 표시
  bundle exec jekyll serve --future

  # 모든 옵션 조합 (개발 시 추천)
  bundle exec jekyll serve --livereload --drafts --future --incremental

  # 특정 환경으로 실행
  JEKYLL_ENV=production bundle exec jekyll build

#클린/초기화

  # 빌드 캐시 삭제 후 재빌드
  bundle exec jekyll clean
  bundle exec jekyll build

  # 의존성 설치/업데이트
  bundle install
  bundle update

  # 특정 gem 업데이트
  bundle update jekyll

#디버깅

  # 상세 로그 출력
  bundle exec jekyll serve --verbose

  # 추적 모드 (매우 상세한 로그)
  bundle exec jekyll serve --trace

  # 설정 확인
  bundle exec jekyll doctor

  # 버전 확인
  bundle exec jekyll --version

#자주 쓰는 단축 명령어

  # 가장 기본 (개발 시)
  bundle exec jekyll s

  # livereload 포함
  bundle exec jekyll s -l

  # 빌드
  bundle exec jekyll b

  # 도움말
  bundle exec jekyll help
  bundle exec jekyll serve --help

#실전 팁

  # 1. 일반 개발 시
  bundle exec jekyll serve --livereload

  # 2. draft 작성 중
  bundle exec jekyll serve --livereload --drafts

  # 3. 문제 발생 시 클린 후 재시작
  bundle exec jekyll clean && bundle exec jekyll serve

  # 4. 프로덕션 빌드 (GitHub Pages 배포 전 확인)
  JEKYLL_ENV=production bundle exec jekyll build

  # 5. 빌드 속도 느릴 때
  bundle exec jekyll serve --incremental --livereload
```