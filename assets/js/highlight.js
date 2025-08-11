// 하이라이트 문법 변환 스크립트
document.addEventListener('DOMContentLoaded', function() {
  console.log('Highlight script loaded');
  
  function processHighlights() {
    console.log('Processing highlights...');
    
    // 본문 영역 찾기
    let contentArea = document.querySelector('.post-content.e-content');
    if (!contentArea) {
      contentArea = document.querySelector('.post-content');
    }
    if (!contentArea) {
      contentArea = document.querySelector('.e-content');
    }
    if (!contentArea) {
      contentArea = document.querySelector('article.post');
    }
    
    console.log('Content area found:', contentArea ? contentArea.className : 'none');
    
    if (!contentArea) return;
    
    // 전체 텍스트를 한 번에 처리하는 방식으로 변경
    function processElement(element) {
      // 코드 블록과 인라인 코드는 제외
      if (element.matches && element.matches('pre, code, .highlight')) {
        return;
      }
      
      // 텍스트 노드인 경우 직접 처리하지 않고 부모 요소에서 innerHTML로 처리
      if (element.nodeType === Node.ELEMENT_NODE) {
        let html = element.innerHTML;
        let originalHtml = html;
        
        // 색상별 패턴을 먼저 처리 (더 구체적인 패턴 우선)
        
        // ==pink:텍스트== 패턴 (핑크색)
        if (html.includes('==pink:')) {
          console.log('Found pink pattern');
          html = html.replace(/==pink:([^]*?)==/g, '<span class="highlight-pink">$1</span>');
        }
        
        // ==green:텍스트== 패턴 (초록색)
        if (html.includes('==green:')) {
          console.log('Found green pattern');
          html = html.replace(/==green:([^]*?)==/g, '<span class="highlight-green">$1</span>');
        }
        
        // ==텍스트== 패턴 찾기 (기본 노란색)
        // 색상 패턴이 아닌 경우만 처리
        if (html.includes('==') && !html.includes('==pink:') && !html.includes('==green:')) {
          console.log('Found basic pattern');
          html = html.replace(/==([^]*?)==/g, '<mark>$1</mark>');
        }
        
        // 변경사항이 있으면 적용
        if (html !== originalHtml) {
          console.log('HTML changed in element:', element.tagName);
          element.innerHTML = html;
          return true;
        }
      }
      
      return false;
    }
    
    // 모든 하위 요소들을 순회하면서 처리
    let processed = 0;
    
    // 먼저 최상위 요소 자체를 처리
    if (processElement(contentArea)) {
      processed++;
    }
    
    // 그 다음 하위 요소들을 처리 (p, div, span 등)
    const childElements = contentArea.querySelectorAll('p, div, span, li, td, th, h1, h2, h3, h4, h5, h6');
    childElements.forEach(function(element) {
      // 이미 하이라이트가 적용된 요소는 건너뛰기
      if (!element.querySelector('mark, .highlight-pink, .highlight-green')) {
        if (processElement(element)) {
          processed++;
        }
      }
    });
    
    console.log('Total processed elements:', processed);
  }
  
  processHighlights();
});