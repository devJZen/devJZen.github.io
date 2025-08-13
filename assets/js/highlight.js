document.addEventListener('DOMContentLoaded', function() {
  function processHighlights() {
    const contentArea = document.querySelector('.post-content.e-content, .post-content, .e-content, article.post');
    if (!contentArea) return;

    const protectedBlocks = [];
    let protectedIndex = 0;

    // 1. 보호 대상 탐색 (mermaid div, pre, code 포함)
    contentArea.querySelectorAll('pre, code, div.mermaid').forEach(block => {
      if (block.dataset.highlightProtected) return;

      // Mermaid block 보호 조건
      const isMermaidBlock =
        (block.tagName.toLowerCase() === 'div' && block.classList.contains('mermaid')) ||
        (block.tagName.toLowerCase() === 'pre' && block.dataset.lang === 'mermaid') ||
        (block.tagName.toLowerCase() === 'code' && block.classList.contains('mermaid'));

      if (isMermaidBlock) {
        const placeholder = document.createComment(`CODEBLOCK_PLACEHOLDER_${protectedIndex}`);
        protectedBlocks.push(block);
        block.dataset.highlightProtected = 'true';
        block.parentNode.replaceChild(placeholder, block);
        protectedIndex++;
      }
    });

    // 2. 본문 하이라이트용 텍스트 치환 (예: ==highlight== 처리)
    let html = contentArea.innerHTML;

    html = html.replace(/==(?:(pink|green):)?([\s\S]*?)==/g, (match, color, content) => {
      if (match.startsWith('<!--') && match.endsWith('-->')) return match;
      if (color) return `<span class="highlight-${color}">${content}</span>`;
      else return `<mark>${content}</mark>`;
    });

    contentArea.innerHTML = html;

    // 3. placeholder 주석 노드 찾아서 복원
    const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_COMMENT);
    const commentsToReplace = [];

    while(walker.nextNode()) {
      if (walker.currentNode.nodeValue.startsWith('CODEBLOCK_PLACEHOLDER_')) {
        commentsToReplace.push(walker.currentNode);
      }
    }

    commentsToReplace.forEach(comment => {
      const match = comment.nodeValue.match(/CODEBLOCK_PLACEHOLDER_(\d+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (protectedBlocks[index]) {
          comment.parentNode.replaceChild(protectedBlocks[index], comment);
          // Mermaid 렌더링 재실행
          if (protectedBlocks[index].classList.contains('mermaid')) {
            try {
              mermaid.run({ nodes: [protectedBlocks[index]] });
            } catch(e) {
              console.error('Mermaid 렌더링 에러:', e);
            }
          }
        }
      }
    });
  }

  // MutationObserver로 DOM 변경 감지하여 다시 처리
  const observer = new MutationObserver((mutations) => {
    let needsProcessing = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        needsProcessing = true;
        break;
      }
    }
    if (needsProcessing) {
      observer.disconnect();
      processHighlights();
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });

  // 초기 실행 & 관찰 시작
  processHighlights();
  observer.observe(document.body, { childList: true, subtree: true });
});