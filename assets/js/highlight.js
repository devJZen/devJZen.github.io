document.addEventListener('DOMContentLoaded', function() {
      function processHighlights() {
        const contentArea = document.querySelector('.post-content.e-content, .post-content, .e-content, article.post');
        if (!contentArea) return;

        const protectedBlocks = [];
        // Protect code blocks, mermaid diagrams, and footnote superscript tags
        contentArea.querySelectorAll('pre, code, div.mermaid, sup').forEach((block, index) => {
          const placeholder = document.createComment(`HIGHLIGHT_PLACEHOLDER_${index}`);
          protectedBlocks.push(block.cloneNode(true)); // Store a clone of the node
          block.parentNode.replaceChild(placeholder, block);
        });

        let html = contentArea.innerHTML;

        // Replace ==...== with <mark> or <span class-highlight-color>
        html = html.replace(/==(?:(pink|green):)?([\s\S]*?)==/g, (match, color, content) => {
          if (color) {
            return `<span class="highlight-${color}">${content}</span>`;
          }
          return `<mark>${content}</mark>`;
        });

        contentArea.innerHTML = html;

        // Restore protected blocks
        const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_COMMENT);
        const commentsToReplace = [];
        while(walker.nextNode()) {
          const node = walker.currentNode;
          if (node.nodeValue.trim().startsWith('HIGHLIGHT_PLACEHOLDER_')) {
            commentsToReplace.push(node);
          }
        }

        commentsToReplace.forEach(comment => {
          const match = comment.nodeValue.match(/HIGHLIGHT_PLACEHOLDER_(\d+)/);
          if (match) {
            const index = parseInt(match[1], 10);
            if (protectedBlocks[index]) {
              comment.parentNode.replaceChild(protectedBlocks[index], comment);
            }
          }
        });
      }

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            observer.disconnect();
            processHighlights();
            observer.observe(document.body, { childList: true, subtree: true });
            return;
          }
        }
      });

      processHighlights();
      observer.observe(document.body, { childList: true, subtree: true });
    });