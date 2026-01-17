---
layout: post
title: Git의 cherry pick
categories: study
tags: [Git]
---

## cherry pick은 무엇인가?

git-cherry-pick: 기존 커밋에서 도입된 변경 사항을 적용합니다.

기존 커밋이 하나 이상 주어졌을 때, 각 커밋에서 발생하는 변경 사항을 적용하고 각각에 대해 새로운 커밋을 기록합니다. 이를 위해서는 작업 트리가 깨끗한 상태(HEAD 커밋 이후의 수정 사항이 없는 상태)여야 합니다.

다른 브랜치 또는 과거의 특정 커밋을 복사해서 현재 브랜치 위에 새 커밋으로 추가한다.
히스토리를 되돌리지 않고 같은 변경 내용이지만 새 커밋 해시가 생긴다.
기존의 코드에서 특정부분을 살리고 싶을 때 사용한다.

[공식 문서 참고](https://git-scm.com/docs/git-cherry-pick)

## Problem

> 커밋을 하다가 브랜치를 날려버림

1. 커밋은 성공 했으나
2. 브랜치를 체크아웃해서 확인을 해야 됐음

## Solution

> 브랜치 포인터를 확인해야되므로 revert가 아닌 cherry pick을 사용한다.

  1. 현재 상태 확인
  git status
  git log --oneline -5

  2. reflog로 사라진 커밋 찾기
  git reflog -10

  3. 체리픽으로 커밋 가져오기
  git cherry-pick 커밋해시

  4. 변경사항 확인
  git log --oneline -3
  git diff HEAD~1 파일명

  5. 원격 저장소에 푸시
  git push origin main

## Q. revert와 다른 점

git-revert: 기존 커밋 중 일부를 되돌립니다.

유의 사항은 cherry pick과 동일하지만 revert는 잘못된 커밋의 영향을 되돌리기 위해 새로운 커밋을 기록한다.
작업 디렉터리의 커밋되지 않은 모든 변경 사항을 버리려면 reset을 써야하고,
다른 커밋의 특정 상태로 특정 파일을 복원하려면 restore을 써야한다.
reset과 restore는 작업 디렉터리의 커밋되지 않은 변경 사항을 버리게되므로 주의하여 사용해야된다.

## 내가 몰랐던 내용

  - git reflog - HEAD의 이동 기록 확인 (체크아웃, 커밋 등 모든 히스토리)
  - git cherry-pick <commit-hash> - 특정 커밋만 현재 브랜치에 가져오기
  - git diff HEAD~1 <file> - 이전 커밋과 현재 커밋의 차이 확인