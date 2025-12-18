---
layout: post
title: Observability란 무엇인가?
categories: study
tags: [Observability]
---

## 관찰 가능성, Observability

> 시스템의 외부 출력(Output)만으로 시스템의 내부 상태(Internal State)를 얼마나 잘 이해할 수 있는가?

현대적인 분산 시스템과 MSA(Microservices Architecture) 환경에서 필수적인 개념으로 사용된다.
단순히 로그나 매트릭을 수집하는 행위가 아니라, 데이터를 통해 문제를 파악할 수 있는 능력을 의미한다.

> [!info] 모니터링(Monitoring)과 같은 선상이 아닌가?
 모니터링은 이미 알고 있는 문제를 감지하는 것에 초점을 맞춘다. (Ex.선형 데이터를 보여주는 것)
 관찰가능성은 시스템이 예측하지 못한 문제의 원인을 파악하고 디버깅하는 능력이다.

## 왜 사용하는가?

1. 과거 모놀리틱 아키텍처와 다르게 세부적으로 상호작용하는 환경을 구축하는게 현대의 개발이다.
2. 개발자가 상상할 수 없는 에러 케이스를 추적할 수 있다.
3. MTTR(복구 시간)을 단축하여 근본 원인을 빠르게 찾아내어 비즈니스 손실을 줄여준다.

## 어떤 서적을 참고해야할까?

|순위|책 제목|설명|
|1|Observability Engineering (Charity Majors 외)|Observability의 개념을 정립한 저자들이 쓴 '바이블'입니다. 개념부터 실무 적용까지 다룬다.|
|2|Site Reliability Engineering (Google)|구글 SRE 팀의 노하우가 담긴 책으로, 모니터링과 Observability의 기반이 되는 철학을 배울 수 있다.|
|3|Distributed Systems Observability (Cindy Sridharan)|분산 시스템 환경에서의 관찰 가능성에 대해 간결하게 잘 정리된 책입니다.|

## 자격증

방법론에 가깝기 때문에 단일 표준 자격증이 존재하지 않는다. 클라우드 제공사의 자격증을 참고하는 것이 좋다.

1. PCA (Prometheus Certified Associate)
2. SaaS Service (Datadoc, Splunk, Dynatrace)
3. AWS/Azure/GCP DevOps Professional Certificated

## 문제를 정의하는 방법

비즈니스 목표에서 시작하여 기술지표로 내려가는 방식이어야 한다.

1. 사용자 목표 파악
2. SLI((Service Level Indicator)) 선정
3. SLO((Service Level Objective)) 설정
4. 질문 중심의 데이터 구성

## The Four Golden Signals 외의 다른 기준

구글 SRE북의 Four Golden Signals (Latency, Traffic, Errors, Saturation)가 가장 유명하지만, 시스템의 성격에 따라 다른 프레임워크를 사용하기도 한다.

A. USE Method (인프라 중심)
Brendan Gregg가 제안한 방법으로, 주로 하드웨어 리소스나 인프라 상태를 파악할 때 유용합니다.

- U (Utilization): 자원이 얼마나 사용되고 있는가? (예: CPU 90% 사용)
- S (Saturation): 자원이 포화되어 대기열(Queue)이 발생하고 있는가?
- E (Errors): 자원 레벨에서 에러가 발생하고 있는가? (예: 디스크 I/O 에러)

B. RED Method (마이크로서비스 중심)
Tom Wilkie가 제안한 방법으로, 서비스(Request) 관점에서 사용자가 겪는 경험을 측정하기 좋습니다. Prometheus 커뮤니티에서 널리 쓰입니다.

- R (Rate): 초당 요청 수 (Request per second).
- E (Errors): 실패한 요청 수.
- D (Duration): 요청을 처리하는 데 걸린 시간 (Latency와 유사).

C. The Three Pillars (데이터 유형 기준)
기준이라기보다는 Observability를 구성하는 3대 요소입니다.

- Metrics (메트릭): "무엇"이 일어났는가? (시계열 데이터, 수치)
- Logs (로그): "왜" 일어났는가? (이벤트의 구체적 기록)
- Traces (트레이스): "어디서" 일어났는가? (서비스 간의 요청 흐름 추적)