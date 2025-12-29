---
layout: post
title: Repository와 SSL 인증서 문제
categories: study
tags: [Jekyll, OpenSSL, Troubleshooting]
---

## 문제 상황

Jekyll 사이트를 로컬에서 빌드하던 중 두 가지 주요 오류가 발생했다.

### 1. GitHub Metadata 오류

```
GitHub Metadata: Error processing value 'description':
Liquid Exception: No repo name found. Specify using PAGES_REPO_NWO environment variables,
'repository' in your configuration, or set up an 'origin' git remote pointing to your
github.com repository.
```

Jekyll의 `github-metadata` 플러그인이 저장소 정보를 찾지 못하는 오류였다.

### 2. SSL 인증서 검증 실패

```
SSL_connect returned=1 errno=0 peeraddr=20.200.245.246:443 state=error:
certificate verify failed (unable to get certificate CRL)
```

`remote_theme`을 사용할 때 GitHub에서 테마를 다운로드하는 과정에서 OpenSSL 인증서 검증 오류가 발생했다.

## 원인 분석

### 1. Repository 정보 누락
`_config.yml`에 `repository` 필드가 명시되지 않아 GitHub Metadata 플러그인이 저장소 정보에 접근할 수 없었다.

### 2. macOS OpenSSL 인증서 경로 문제
- Ruby가 사용하는 OpenSSL 인증서 경로가 제대로 설정되지 않음
- Homebrew로 설치한 OpenSSL의 인증서 경로: `/opt/homebrew/etc/ca-certificates/cert.pem`
- Ruby 기본 설정에서 이 경로를 찾지 못함

## 해결 방법

### 1. Repository 필드 추가

`_config.yml` 파일에 저장소 정보 추가:

```yaml
repository: devJZen/devJZen.github.io
```

### 2. SSL 인증서 경로 설정

#### 방법 A: Bundle 설정 파일 생성

`~/.bundle/config` 파일에 SSL 인증서 경로 설정:

```yaml
---
BUNDLE_SSL_CERT_FILE: "/opt/homebrew/etc/ca-certificates/cert.pem"
```

#### 방법 B: 환경 변수 설정

`.zshrc` 또는 `.bash_profile`에 추가:

```bash
export SSL_CERT_FILE=/opt/homebrew/etc/ca-certificates/cert.pem
```

임시로 현재 세션에만 적용:

```bash
export SSL_CERT_FILE=/opt/homebrew/etc/ca-certificates/cert.pem
bundle exec jekyll serve
```

### 3. Remote Theme 문제 해결

프로젝트가 테마 소스 자체인 경우, `_config.yml`에서 테마 설정 제거:

```yaml
# Before
remote_theme: "jeffreytse/jekyll-theme-yat"

# After
# remote_theme: "jeffreytse/jekyll-theme-yat"
# theme: jekyll-theme-yat (Using local theme files)
```

로컬의 `_layouts`, `_includes`, `_sass` 디렉토리를 직접 사용하므로 원격 테마 다운로드가 불필요하다.

## 보안 고려사항

### SSL 검증 비활성화는 피할 것

일부 가이드에서 제안하는 다음 방법은 **절대 사용하지 말 것**:

```bash
# ❌ 위험: SSL 검증 완전 비활성화
export SSL_VERIFY_MODE=0
export BUNDLE_SSL_VERIFY=false
```

이 방법은 중간자 공격(MITM)에 취약하며, 악의적인 패키지를 다운로드할 위험이 있다.

### 권장하는 안전한 방법

1. **인증서 경로 명시**: 신뢰할 수 있는 CA 인증서 번들 사용
2. **로컬 테마 사용**: 원격 다운로드를 피하고 검증된 로컬 파일 사용
3. **정기적인 인증서 업데이트**: Homebrew를 통한 ca-certificates 패키지 업데이트

```bash
brew upgrade ca-certificates
```

## 검증

최종적으로 다음 명령어로 정상 작동 확인:

```bash
export SSL_CERT_FILE=/opt/homebrew/etc/ca-certificates/cert.pem
bundle install
bundle exec jekyll serve
```

서버가 정상적으로 시작되면 `http://localhost:4000`에서 사이트 확인 가능하다.

## 참고 자료

- [Jekyll GitHub Metadata Plugin](https://github.com/jekyll/github-metadata)
- [OpenSSL Certificate Verification](https://www.openssl.org/docs/)
- [Bundler Configuration](https://bundler.io/v2.0/man/bundle-config.1.html)

## 확인할 것

1. Jekyll GitHub Pages 플러그인은 저장소 메타데이터에 의존한다
2. macOS에서 Homebrew Ruby를 사용할 때 OpenSSL 경로 설정이 중요하다
3. 보안을 위해 SSL 검증을 비활성화하는 대신 올바른 인증서 경로를 설정해야 한다
4. 로컬 테마 개발 시 `remote_theme` 대신 로컬 파일을 직접 사용하는 것이 효율적이다
