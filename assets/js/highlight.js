window.addEventListener('load', function() {
  const contentArea = document.querySelector('.post-content.e-content, .post-content, .e-content, article.post');
  if (!contentArea) {
    return;
  }

  const processed_mark = 'data-highlight-processed';

  const elements = contentArea.querySelectorAll('p, li, dd, dt, h1, h2, h3, h4, h5, h6, blockquote, td, th');
  elements.forEach(element => {
    // If element was detached from DOM by a parent's innerHTML change, skip it.
    if (!element.parentElement) {
        return;
    }

    if (element.closest('pre, code, script, style, mark, div.mermaid') || element.hasAttribute(processed_mark)) {
        return;
    }
    
    // If a parent element was already processed, skip this one.
    if (element.parentElement.closest(`[${processed_mark}]`)) {
        return;
    }

    const originalHtml = element.innerHTML;
    const regex = /==(?:(pink|green):)?([\s\S]*?)==/g;
    const newHtml = originalHtml.replace(regex, (match, color, content) => {
        const tag = color ? 'span' : 'mark';
        const className = color ? ` class="highlight-${color}"` : '';
        return `<${tag}${className} data-highlighted="true">${content}</${tag}>`;
    });

    if (originalHtml !== newHtml) {
        element.innerHTML = newHtml;
        element.setAttribute(processed_mark, 'true');
    }
  });
});