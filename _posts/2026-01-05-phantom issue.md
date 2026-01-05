---
layout: post
title: 내 dApp이 악성이라니
categories: phantom
tags: [web3]
---

> dApp개발 첫 트러블슈팅

## This dApp could be malicious

Supabase의 개발 정책을 바꿨다가 갑자기 Request blocked 이슈를 경험했다.

[Domain and transaction warnings](https://docs.phantom.com/developer-powertools/domain-and-transaction-warnings#domain-and-transaction-warnings)을 참고하여 해결하면 된다.

나의 경우에는 거래 시뮬레이션 경고였고, Supabase의 정책으로 해결했다.
