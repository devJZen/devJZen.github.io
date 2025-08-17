window.addEventListener('load', function() {
  const contentArea = document.querySelector('.post-content.e-content, .post-content, .e-content, article.post');
  if (!contentArea) {
    return;
  }

  // This function surgically replaces text nodes with highlighted versions
  function highlightTextInNode(node) {
    const text = node.nodeValue;
    const regex = /==(?:(pink|green):)?([\s\S]*?)==/g;
    let match;
    let lastIndex = 0;
    const fragment = document.createDocumentFragment();

    // To prevent infinite loops on replacement
    if (node.parentElement && node.parentElement.hasAttribute('data-highlighted')) {
        return;
    }

    let found = false;
    while ((match = regex.exec(text)) !== null) {
      found = true;
      // Add the text before the match
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

      // Create the highlight element
      const color = match[1];
      const content = match[2];
      const el = document.createElement(color ? 'span' : 'mark');
      el.setAttribute('data-highlighted', 'true'); // Mark as processed
      if (color) {
        el.className = `highlight-${color}`;
      }
      el.textContent = content;
      fragment.appendChild(el);

      lastIndex = regex.lastIndex;
    }

    // If we found matches, replace the node with the new fragment
    if (found) {
      // Add any remaining text after the last match
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      node.parentNode.replaceChild(fragment, node);
    }
  }

  // Use a TreeWalker to find all text nodes
  const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT);
  const nodesToProcess = [];
  let node;
  while (node = walker.nextNode()) {
    nodesToProcess.push(node);
  }

  // Process nodes in a separate loop to avoid issues with modifying the DOM while traversing
  for (const n of nodesToProcess) {
    // Ensure the node is not inside a protected element
    if (!n.parentElement.closest('pre, code, script, style, mark, div.mermaid')) {
      highlightTextInNode(n);
    }
  }
});