  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('code[class*="mermaid"]').forEach(function(block) {
      // 이미 변환된 경우(내부에 div.mermaid가 있으면) 패스
      if (block.querySelector('.mermaid')) return;
      var pre = block.parentElement;
      var container = document.createElement('div');
      container.className = 'mermaid';
      container.textContent = block.textContent;
      pre.parentElement.replaceChild(container, pre);
    });
    mermaid.initialize({ startOnLoad: true });
  });