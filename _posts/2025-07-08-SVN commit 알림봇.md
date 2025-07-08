---
layout: post
title: SVN commit 알림봇 만들기
categories: study
tags: [Automation, SVN]
---

1. [개요](#svn-commit-알림봇)
2. [디스코드 설정](#디스코드-서버-설정)
3. [SVN 설정](#svn-설정)


## SVN commit 알림봇

> 관리자가 SVN에서 파일과 소스를 관리하면 작업자는 어떻게 할당 업무에 대한 알림을 받아야 할까?

1. SVN document 폴더 기획안 변경 사항에 따라서 UI와 DB가 바뀐다.
2. DB 폴더도 SVN으로 관리한다. UI는 기획안을 확인해야 한다.
3. 작업자는 할당받은 폴더를 수시로 업데이트하며 변경 사항을 확인해야 한다.

그렇다면 작업자가 바뀌는 경우에 변경 이력을 어떻게 확인할까? 작업자는 변경 사항이 생길 때마다 구두로 또는 카카오톡, 메신저 등 여러 채널로 확인받아야 한다.
적어도 내가 담당한 업무에 변경 사항이 생긴다면 SVN 커밋이 있을 테고, 커밋 내역이라도 확인하자는 생각으로 알림봇을 구현했다.

## 디스코드 서버 설정

- 알림봇을 구현할 서버를 설정한다.
- 알림봇이 구현될 서버는 커뮤니티가 활성화되어야 한다.
- 커뮤니티 활성화(온보딩)이 완료되려면 역할과 권한을 설정해야 하는데, 이때 웹후크 권한을 포함한 매니징 권한을 만들고 본인 계정과 연결한다.
- 온보딩이 완료되려면 채널을 여러 개 생성해야 하는데, 원하는 알림 옵션을 여기에 추가해둔다.
- 온보딩이 끝나면, 채팅 채널 > 채널 편집 > 연동 > 웹후크 > 새 웹후크로 웹후크를 생성한다.
- 웹후크의 이름을 설정하고 URL을 복사할 준비를 한다.

## PowerShell 설정

- Remote 모드로 확인
- 스크립트 작성 후 저장
- 권한 요청은 전부 수락

```  PowerShell
$workingCopyPath = "SVN 경로" # 본인의 SVN 작업 사본 경로로 변경
$discordWebhookUrl = "웹훅 경로" 
$logFile = "로그 파일 저장할 경로\svn_update_log.txt" # 로그 파일을 저장할 경로로 변경 

$OutputEncoding = [System.Text.Encoding]::UTF8

# 작업 디렉토리로 이동. 경로에 공백이 있으면 따옴표로 감싸야 함.
Set-Location $workingCopyPath -ErrorAction Stop

"--- Document SVN 업데이트 시작: $(Get-Date) ---" | Out-File $logFile -Append

# 업데이트 전 리비전 확인
$oldRevision = (svn info | Select-String "Revision:").ToString().Split(':')[1].Trim()
"이전 리비전: $oldRevision" | Out-File $logFile -Append

# SVN 업데이트 실행 (결과를 로그 파일에 저장)
"SVN 업데이트 중..." | Out-File $logFile -Append
svn update | Out-File $logFile -Append 2>&1 # stdout과 stderr 모두 로그에 포함

# 업데이트 후 리비전 확인
$newRevision = (svn info | Select-String "Revision:").ToString().Split(':')[1].Trim()
"새 리비전: $newRevision" | Out-File $logFile -Append

"" | Out-File $logFile -Append

# 변경 사항이 있는 경우에만 Discord로 전송
if ($oldRevision -ne $newRevision) {
    $commitCount = [int]$newRevision - [int]$oldRevision
    "--- 리비전 ${oldRevision} 에서 ${newRevision} 까지의 변경 내역 (${commitCount}개 커밋) ---" | Out-File $logFile -Append
    
    # 변경 로그 가져오기 (커밋 메시지와 파일 목록)
    $svnLogOutput = svn log -r "$oldRevision`:$newRevision" -v | Out-String
    $svnLogOutput | Out-File $logFile -Append 2>&1

    # Discord 메시지 제한(2000자) 고려하여 메시지 구성
    $discordMessage = "SVN 업데이트 완료! 리비전 ${oldRevision} 에서 ${newRevision} 까지의 변경 내역 (${commitCount}개 커밋)"
    if ($svnLogOutput.Length -gt 1500) { # 너무 길면 잘라서 보내거나 요약
        $discordMessage += "`n`n변경 내역이 길어 요약합니다: " + $svnLogOutput.Substring(0, 1500) + "... (전체 내용은 로컬 로그 파일 참조)"
    } else {
        $discordMessage += "`n`n변경 내역:" + $svnLogOutput + " "
    }

    $payload = @{
        username = "SVN Update Notifier"
        content = $discordMessage
        
    } | ConvertTo-Json
    "Discord로 전송할 메시지: $discordMessage" | Out-File $logFile -Append    
    $utf8Payload = [System.Text.Encoding]::UTF8.GetBytes($payload)
    try {
            Invoke-RestMethod -Uri $discordWebhookUrl -Method Post -ContentType "application/json; charset=utf-8" -Body $utf8Payload
            "SVN 업데이트 변경 내역이 Discord로 성공적으로 전송되었습니다." | Out-File $logFile -Append
        } catch {
            "Discord 전송 실패: $($_.Exception.Message)" | Out-File $logFile -Append
        }
}
else {
    "새로운 변경사항이 없습니다." | Out-File $logFile -Append
}

"--- SVN 업데이트 종료 ---" | Out-File $logFile -Append
"로그 파일 위치: $logFile"
# 스크립트 실행 완료 메시지
Write-Host "SVN 업데이트 스크립트가 완료되었습니다. 로그 파일을 확인하세요: $logFile"
```
