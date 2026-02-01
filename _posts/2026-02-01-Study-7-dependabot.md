---
layout: post
title: 7. dependabot으로 종속성 관리
categories: study
tags: [study]
---

## dependabot은 무엇인가?

> Configuring Dependabot security updates

[공식문서](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-security-updates)에 따르면 내가 매번 패치노트를 읽지 않아도 알아서 내게 읽어주는 친절한 봇이 있다는 걸 알게 됐다. 이래서 제조사의 공식문서를 자주 읽어봐야하는 것이구나 싶기도 하다.

## 어떻게 사용할 수 있을까?

`dependabot.yml` 을 만들 수 있으나 없어도 된다. Security updates 모드를 사용하면 취약점 발견되면 알아서 PR 요청 올려준다.

## 저장소에 라벨 생성

하..나는 깃허브 PR 요청에 익숙하지 않아서 어렵다고 느끼는데 dependabot이 추천해주는 방향으로 태그라벨도 찾아서 추가하고 직접 검토하고 서빙되는 공식문서를 읽으니까 편하다고 느낀다. 어감이 뭔가 다팬다 봇 같아서 ㅋㅋㅋㅋㅋㅋ재밌는 거 같다...요즘 재미찾기가 너무 어려워서(사실 잘생긴 사람들을 보면 재밌음) 이런 것에 재미느낀다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋ