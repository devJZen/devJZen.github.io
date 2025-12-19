---
layout: post
title: Supabase의 RLS
categories: study
tags: [web]
---

## Supabase RLS (Row Level Security) 정책

> CRUD 생성 중에 Delete가 안되고 있음

Supabase로 개발하다가 삭제가 구현이 안될 때가 있다. RLS 정책 때문인데 아래와 같이 해결하면 된다.

```sql
-- 기존 정책 삭제                                                   
  DROP POLICY IF EXISTS "Creators and admins can update projects" ON  
  projects;                                                           
  DROP POLICY IF EXISTS "Creators can delete projects" ON projects;   
                                                                      
-- 새로운 정책 생성 (개발용)                                        
  CREATE POLICY "Anyone can update projects"                          
    ON projects FOR UPDATE                                            
    USING (true);                                                     
                                                                      
  CREATE POLICY "Anyone can delete projects"                          
    ON projects FOR DELETE                                            
    USING (true);
```

개발용 정책을 만들어서 해결

## RLS가 무엇인가?

정책은 PostgreSQL의 규칙 엔진이다. 정책은 익숙해지면 쉽게 이해할 수 있다. 각 정책은 테이블에 연결되어 있으며, 해당 테이블에 접근할 때마다 정책이 실행된다.

==RLS를 활성화하면 정책을 생성하기 전까지는 공개 키를 사용하여 API를 통해 데이터에 액세스할 수 없습니다. [1^]==

>[!note] 언제 발생되는 것인가?  
>  - Supabase 인증은 하지 않음     
>  - 따라서 삭제 권한이 없었음   

[1^] : [Supabase 공식 홈페이지](https://supabase.com/docs/guides/database/postgres/row-level-security)