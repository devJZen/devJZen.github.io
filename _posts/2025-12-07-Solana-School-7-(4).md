---
layout: post
title: 솔라나 프로그래밍 모델 (2)
categories: web3
tags: [SolanaSchool7]
---
지금 포스팅은 SolanaSchool7에 대한 포스팅으로, 솔라나 스쿨 7기의 3강의 내용을 다룹니다.
문서를 간결하게 작성하기 위하여 평어체로 작성됩니다.

## 4강, 솔라나 프로그래밍 모델 (2)

솔라나 스쿨 7기 **[4강](https://youtu.be/wSRviwBG3zo)** 에서는 프로그래밍 모델을 위주로 학습한다.

앞선 2강에 이어서 PDA와 CPI에 대해서 심화 내용을 다룬다. 솔라나 국내 홈페이지에 올라온 [PDA](https://solana.com/ko/docs/core/pda)에 대한 자료를 우선 첨부한다.

## 프로그램 파생 주소 (Program Derived Addresses, PDA)

> 서명할 수 없는 주소

- PDA는 일반 계정 주소(Publick Key)와 다르게 프로그램과 시드(Seed) 조합으로 생성되는 주소다.
- Seed는 여러개 생성할 수 있다. Bump는 충돌 방지를 위해 존재한다.
- deterministic 주소를 생성할 수 있다.
- 권한 관리 없이 안전하게 프로그램 전용 데이터를 저장할 수 있다.

PDA는 Public Key이지만 ed25519 방식의 개인키가 존재하지 않는 주소다.
서명할 수 없는 주소이며 개인키가 없기 때문에 악의적인 사용자가 탈취할 수 없다는 점이 장점이다.

프로그램의 상태(State)를 저장하기 위해서 필수적인 요소다.
프로그램 외에는 접근할 수 없어서 보안이 우수하다.

## 크로스 프로그램 호출 (Cross Program Invocation, CPI)

> 유지보수를 쉽게 하도록 설계되었다.

PDA와 마찬가지로 솔라나 국내 홈페이지에 올라온 [CPI](https://solana.com/ko/docs/core/cpi)에 대한 자료를 첨부한다.

- CPI는 하나의 Solana의 프로그램(스마트 컨트랙트)가 다른 프로그램의 기능을 호출할 수 있게 해준다.
- 프로그램 과의 상호작용을 가능하게 하며, 모듈화된 설계와 코드 재사용, 복잡한 로직을 구현할 수 있다.
- 쉽게 말해서 프로그램 하나에 모든 기능을 넣을 필요가 없다. 프로그램을 모듈화 할 수 있다.
- 너무 많은 구현이나 반복적인 CPI는 성능을 저하시켜서 설계가 중요하다.

## Hands-on example

> Token Program 호출

주소에 첨부된 저장소에 들어가서 직접 예제를 구현해보는 것이 좋다.

- PDA를 mint authority로 갖는 token mint를 만든다.
- invocke_signed를 상요해서 mint를 실행한다.
- seed와 bump로 서명 검증을 대체한다.
- mint instruction 실행 시에 invoke_signed가 필요하다.