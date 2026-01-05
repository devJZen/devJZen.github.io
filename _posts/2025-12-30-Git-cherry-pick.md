---
layout: post
title: Git의 cherry pick
categories: study
tags: [Git]
---

## cherry pick

> 커밋을 하다가 브랜치를 날려버림

1. 커밋은 성공 했으나
2. 브랜치를 체크아웃해서 확인을 해야 됐음

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

## 내가 몰랐던 내용

  - git reflog - HEAD의 이동 기록 확인 (체크아웃, 커밋 등 모든 히스토리)
  - git cherry-pick <commit-hash> - 특정 커밋만 현재 브랜치에 가져오기
  - git diff HEAD~1 <file> - 이전 커밋과 현재 커밋의 차이 확인