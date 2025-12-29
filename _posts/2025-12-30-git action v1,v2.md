---
layout: post
title: git action의 종속성 업데이트
categories: study
tags: [web]
---

## 블로그 글이 계속 보이지 않았다.

빌드가 실패했는데, 내가 사용하던 actions가 버전이 낮다는 것을 확인함.
[공식문서](https://github.blog/changelog/2024-12-05-notice-of-upcoming-releases-and-breaking-changes-for-github-actions/#actions-cache-v1-v2-and-actions-toolkit-cache-package-closing-down) 참고

**actions-cache-v1-v2-and-actions-toolkit-cache-package-closing-down**

업데이트: 우분투 20 이미지 지원 종료일이 4월 15일로 변경되었습니다. 아래 게시글은 해당 변경 사항을 반영하여 수정되었습니다.

Ubuntu 최신 버전에서 예정된 주요 변경 사항
2024년 12월 5일부터 2025년 1월 17일 ubuntu-latest까지 레이블 을 새로운 이미지로 이전할 예정입니다 . 새 이미지는 기존 이미지와 다른 도구 및 패키지 세트를 포함하고 있습니다 . 디스크 공간 확보를 위한 서비스 수준 계약(SLA)을 유지하기 위해 일부 패키지 목록을 삭제했습니다. 삭제된 패키지에 의존하는 워크플로우를 사용하는 경우 문제가 발생할 수 있습니다. 영향을 받는 패키지를 사용하고 있는지 확인하려면 아래 목록을 검토해 주세요.ubuntu 24ubuntu 24ubuntu 22

우분투 20 이미지 서비스가 종료됩니다
저희는 N-1 OS 지원 정책 에 따라 Ubuntu 20 호스팅 러너 이미지 지원을 단계적으로 종료할 예정입니다 . 이 이미지는 2025년 4월 15일까지 완전히 지원이 중단됩니다. 이후에는 워크플로우를 업데이트하여 ubuntu-22.04또는 를 사용하시기를 권장합니다 ubuntu-24.04.

...