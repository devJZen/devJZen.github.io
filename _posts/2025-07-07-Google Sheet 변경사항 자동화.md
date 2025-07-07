---
layout: post
title: Google Sheets 알림봇 만들기
categories: study
tags: [Automation, Google]
---

1. [개요](#google-sheets-알림봇)
2. [디스코드 설정](#디스코드-서버-설정)
3. [구글 시트 설정](#google-sheets-설정)


## Google Sheets 알림봇

> Google Sheets 하나를 작업하는데 쓰기 권한이 여러명인 경우, 신입은 어떻게 해야될까?

1. 기획/개발의 작업이 추가되면 행이 추가된다.
2. 기획이 수정되면 행이 추가되거나 이동, 삭제된다.
3. 리뷰를 시작하면 컬럼에 데이터를 추가해야된다.
4. 개발을 시작하면 컬럼에 데이터를 추가해야된다.
5. 리뷰나 개발은 무조건 하루 안에 해야되며, 2일 이상 진행된 경우에는 비고 컬럼에 데이터를 추가해야된다. 

업무 분장이 끝나지 않고(기획에 따라 달라져서) 기획은 계속 바뀌는 상황(추가, 수정, 삭제의 연속)이라 시트 변경사항에 대한 알림을 받고 싶었다.

적어도 담당한 부분이 달라지면 알림을 받아야 하는데 지금 프로젝트는 작업 내용을 **Google Sheets**로 관리하고, 변경 사항이나 문서화는 **Confluence**를 사용하며, 형상관리는 **SVN**을 상용한다. 업무 추가보고나 질문은 대면으로 대화 또는 카카오톡을 이용하는 상황이었고 작업자가 시시때때로 업데이트를 하며 관리해야되는데 도무지 일이 정리가 되질 않았다. 지난날 이런 상황에서 어떻게 작업을 하셨는지 의문이었다. 여러번 확인을 한다고 하더라도 작업물의 퀄리티가 당연히 떨어질 수 밖에 없는 환경이라서 알림봇을 구현했다.

## 디스코드 서버 설정

- 알림봇을 구현할 서버를 설정한다.
- 알림봇이 구현될 서버는 커뮤니티가 활성화 되어야한다.
- 커뮤니티 활성화(온보딩)이 완수 되려면 역할과, 권한을 설정해야되는데 이 때, 웹후크 권한을 포함한 매니징 권한을 만들고 본인 계정과 연결한다.
- 온보딩이 완수 되려면 채널여러개 생성해야 되는데 원하는 알림옵션을 여기에 추가해둔다.
- 온보딩이 끝나면, 채팅 채널 > 채널 편집 > 연동 > 웹후크 > 새웹후크 로 웹후크를 생성한다.
- 웹후크의 이름를 설정하고 URL을 복사할 준비를 한다.

## Google Sheets 설정

- 확장프로그램 > Apps Script > Code.gs에 접속
- 스크립트 작성 후 저장
- 권한 요청은 전부 수락하시면 됩니다.

``` JavaScript

const WEBHOOK_URL = '디스코드 웹후크 주소 입력';

function countCellsByColorAndValue(range, color, value) {
  let count = 0;
  let bgColors = range.getBackgrounds();
  let values = range.getValues();

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (bgColors[i][j] === color && values[i][j] === value) {
        count++;
      }
    }
  }

  return count;
}


function onEdit(e) {
  // e 또는 e.range가 정의되지 않은 경우 (수동 실행 시 발생) 오류 로깅 후 함수 종료
  if (!e || !e.range) {
    Logger.log("오류: 이벤트 객체 또는 범위가 정의되지 않았습니다. 이는 종종 함수를 수동으로 실행할 때 발생합니다.");
    return;
  }

  const range = e.range;
  const sheet = range.getSheet();

  // 수정된 셀의 행과 열 인덱스 가져오기
  const row = range.getRow();
  const column = range.getColumn();

  // 수정된 셀의 컬럼 헤더 텍스트 가져오기
  // 2열부터 -> 설정은 시트에 맞춰서 작성해주세요.
  const headerRange = sheet.getRange(2, column);
  const columnName = headerRange.getValue();

  // oldValue가 없을 경우 '없음'으로 설정
  const oldValue = e.oldValue || "없음";
  const value = e.value;
  // 사용자 이메일이 없을 경우 '알 수 없는 사용자'으로 설정
  // 이메일 대신 사용자명을 원한다면, 이전 답변의 userinfo.email 스코프 추가 후 userEmail.split('@')[0] 활용
  const user = Session.getActiveUser().getEmail() || "**알 수 없는 사용자**";

  const payload = {
    content: `${user}님이 시트: \`${sheet.getName()}\`의 컬럼: \`${columnName}\` (\`${range.getA1Notation()}\`) 셀을 수정했습니다. **이전 데이터:** \`${oldValue}\`, **새 데이터:** \`${value}\``
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("디스코드 알림이 성공적으로 전송되었습니다!");
  } catch (error) {
    Logger.log("디스코드 알림 전송 실패: " + error.toString());
  }
}

```
JavaScript가 아닌 Google Apps Script 입니다.
Code.gs 작성 하시고 저장 잊지마세요.

- 왼쪽 패널의 시계모양 아이콘(트리거) > 트리거 추가
- 실행할 함수 선택: onEdit
- 실행할 배포 선택: Head
- 이벤트 소스 선택: 스프레드시트에서
- 이벤트 유형 선택: 수정시
- 트리거 실패 알림 설정: 즉시 알림
- 반드시 시트에서 데이터 수정 후에 디스코드 채널 확인

> 성공 메시지 : test@gmail.com 님이 시트: 담당자현황의 컬럼: ` (D7) 셀을 수정했습니다. **이전 데이터:** 15.0, **새 데이터:** undefined`

시트를 다른 사람이 수정하면 '알 수 없는 사용자' 라고 알림이 옵니다. 이 부분을 수정하고 싶으시다면 세션에 있는 사람들의 이메일 또는 이름을 가져오면 됩니다.
